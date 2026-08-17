
-- Fix linter warnings by revoking execution permissions on the security logger function
REVOKE ALL ON FUNCTION public.log_security_activity(UUID, TEXT, JSONB, TEXT, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.log_security_activity(UUID, TEXT, JSONB, TEXT, TEXT) FROM authenticated;
REVOKE ALL ON FUNCTION public.log_security_activity(UUID, TEXT, JSONB, TEXT, TEXT) FROM anon;

-- Explicitly allow service_role if needed, but since it's SECURITY DEFINER and owned by service_role,
-- it should be usable internally by system processes.
GRANT EXECUTE ON FUNCTION public.log_security_activity(UUID, TEXT, JSONB, TEXT, TEXT) TO service_role;
