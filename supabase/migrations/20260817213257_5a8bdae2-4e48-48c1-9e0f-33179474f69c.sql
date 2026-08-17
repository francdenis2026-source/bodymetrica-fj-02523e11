-- Explicitly revoke from anon and authenticated, but we need it for authenticated to check roles in policies
-- Actually, RLS policies run as owner if SECURITY DEFINER, but the function itself is what's being checked.
-- To satisfy the linter, we can move it to a private schema or just ignore if it's necessary.
-- However, we can try to be more specific.

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM authenticated;

-- If we revoke from authenticated, policies using it might fail if they run in the context of the user.
-- But since it's SECURITY DEFINER, it should be fine if called by the system.
-- Wait, RLS policies DO run as the user. If the user can't execute the function, the policy fails.
-- So we MUST grant execute to authenticated. The linter warns because any authenticated user can call it directly.
-- This is a known trade-off for this pattern. I will add a comment to security memory later.

GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;
