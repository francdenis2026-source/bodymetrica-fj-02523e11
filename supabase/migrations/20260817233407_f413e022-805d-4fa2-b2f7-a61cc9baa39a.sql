
-- Create security activity logs table
CREATE TABLE public.security_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    action TEXT NOT NULL,
    details JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Grant access
GRANT SELECT ON public.security_logs TO authenticated;
GRANT ALL ON public.security_logs TO service_role;

-- Enable RLS
ALTER TABLE public.security_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own logs
CREATE POLICY "Users can view their own security logs" 
ON public.security_logs 
FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- Function to log security activity (internal use)
CREATE OR REPLACE FUNCTION public.log_security_activity(
    _user_id UUID,
    _action TEXT,
    _details JSONB DEFAULT '{}'::jsonb,
    _ip_address TEXT DEFAULT NULL,
    _user_agent TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.security_logs (user_id, action, details, ip_address, user_agent)
    VALUES (_user_id, _action, _details, _ip_address, _user_agent);
END;
$$;

-- Flag in profiles for MFA status
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS mfa_enabled BOOLEAN DEFAULT FALSE;
