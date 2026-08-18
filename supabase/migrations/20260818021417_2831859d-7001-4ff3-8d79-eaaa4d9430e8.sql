REVOKE EXECUTE ON FUNCTION public.use_mfa_recovery_code(uuid, text) FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.use_mfa_recovery_code(uuid, text) TO service_role;
