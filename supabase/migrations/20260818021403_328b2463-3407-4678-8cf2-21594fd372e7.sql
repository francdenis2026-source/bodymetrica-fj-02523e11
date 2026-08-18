-- Add recovery_codes to users (via profiles since we can't easily modify auth.users)
-- Actually, it's better to have a dedicated table for MFA recovery codes linked to user_id
CREATE TABLE IF NOT EXISTS public.mfa_recovery_codes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    code_hash text NOT NULL,
    used_at timestamptz,
    created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.mfa_recovery_codes ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own recovery codes"
    ON public.mfa_recovery_codes
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Grants
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mfa_recovery_codes TO authenticated;
GRANT ALL ON public.mfa_recovery_codes TO service_role;

-- Function to check and use a recovery code
CREATE OR REPLACE FUNCTION public.use_mfa_recovery_code(_user_id uuid, _code text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    _code_id uuid;
BEGIN
    SELECT id INTO _code_id
    FROM public.mfa_recovery_codes
    WHERE user_id = _user_id
      AND used_at IS NULL
      AND code_hash = crypt(_code, code_hash)
    LIMIT 1;

    IF _code_id IS NOT NULL THEN
        UPDATE public.mfa_recovery_codes
        SET used_at = now()
        WHERE id = _code_id;
        RETURN true;
    END IF;

    RETURN false;
END;
$$;
