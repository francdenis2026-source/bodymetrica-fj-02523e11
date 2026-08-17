-- Add license fields to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS license_status text DEFAULT 'demonstrative',
ADD COLUMN IF NOT EXISTS license_key text,
ADD COLUMN IF NOT EXISTS license_expires_at timestamp with time zone;

-- Add check constraint for license_status
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'profiles_license_status_check'
    ) THEN
        ALTER TABLE public.profiles ADD CONSTRAINT profiles_license_status_check 
        CHECK (license_status IN ('demonstrative', 'active', 'expired', 'suspended'));
    END IF;
END $$;

-- Grant access
GRANT UPDATE(license_status, license_key, license_expires_at) ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO authenticated;
