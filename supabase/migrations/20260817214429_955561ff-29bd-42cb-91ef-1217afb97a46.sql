REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM public;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;