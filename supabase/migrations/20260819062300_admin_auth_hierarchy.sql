-- Normalize administrative authorization and introduce a real super_admin role.
-- Existing admins remain admins; no account is promoted automatically.

ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'super_admin';

-- Keep role checks callable by authenticated users because RLS policies depend on them.
-- Restrict checks to the caller's own user id to avoid leaking role information for other users.
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    _user_id = auth.uid()
    AND EXISTS (
      SELECT 1
      FROM public.user_roles
      WHERE user_id = _user_id
        AND role = _role
    );
$$;

REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

-- Operational administration: admin OR super_admin.
CREATE OR REPLACE FUNCTION public.has_admin_role(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    _user_id = auth.uid()
    AND EXISTS (
      SELECT 1
      FROM public.user_roles
      WHERE user_id = _user_id
        AND role::text IN ('admin', 'super_admin')
    );
$$;

REVOKE ALL ON FUNCTION public.has_admin_role(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.has_admin_role(uuid) FROM anon;
GRANT EXECUTE ON FUNCTION public.has_admin_role(uuid) TO authenticated, service_role;

-- Highest privilege level: super_admin only.
CREATE OR REPLACE FUNCTION public.has_super_admin_role(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    _user_id = auth.uid()
    AND EXISTS (
      SELECT 1
      FROM public.user_roles
      WHERE user_id = _user_id
        AND role::text = 'super_admin'
    );
$$;

REVOKE ALL ON FUNCTION public.has_super_admin_role(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.has_super_admin_role(uuid) FROM anon;
GRANT EXECUTE ON FUNCTION public.has_super_admin_role(uuid) TO authenticated, service_role;

-- Single source of truth for the administrative login flow.
-- Returns only the currently authenticated user's own administrative role.
CREATE OR REPLACE FUNCTION public.admin_session()
RETURNS TABLE (
  user_id uuid,
  role text,
  is_super_admin boolean
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    ur.user_id,
    ur.role::text,
    (ur.role::text = 'super_admin') AS is_super_admin
  FROM public.user_roles ur
  WHERE ur.user_id = auth.uid()
    AND ur.role::text IN ('admin', 'super_admin')
  ORDER BY CASE WHEN ur.role::text = 'super_admin' THEN 0 ELSE 1 END
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.admin_session() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_session() FROM anon;
GRANT EXECUTE ON FUNCTION public.admin_session() TO authenticated, service_role;

-- ADMIN + SUPER ADMIN: operational license management.
DROP POLICY IF EXISTS "Admins can manage licenses" ON public.licenses;
CREATE POLICY "Admins can manage licenses"
ON public.licenses
FOR ALL
TO authenticated
USING (public.has_admin_role(auth.uid()))
WITH CHECK (public.has_admin_role(auth.uid()));

-- SUPER ADMIN ONLY: sensitive system/payment configuration.
DROP POLICY IF EXISTS "Admins can manage settings" ON public.admin_settings;
CREATE POLICY "Super admins can manage settings"
ON public.admin_settings
FOR ALL
TO authenticated
USING (public.has_super_admin_role(auth.uid()))
WITH CHECK (public.has_super_admin_role(auth.uid()));

-- ADMIN + SUPER ADMIN: audit visibility.
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.license_audit_logs;
CREATE POLICY "Admins can view audit logs"
ON public.license_audit_logs
FOR SELECT
TO authenticated
USING (public.has_admin_role(auth.uid()));

-- SUPER ADMIN ONLY: changing authorization roles can elevate privileges.
DROP POLICY IF EXISTS "Admins can manage user roles" ON public.user_roles;
CREATE POLICY "Super admins can manage user roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_super_admin_role(auth.uid()))
WITH CHECK (public.has_super_admin_role(auth.uid()));

-- Preserve each authenticated user's ability to read their own role.
DROP POLICY IF EXISTS "Users can see their own role" ON public.user_roles;
CREATE POLICY "Users can see their own role"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- ADMIN + SUPER ADMIN: webhook/audit operational visibility.
DROP POLICY IF EXISTS "Admins can view webhook events" ON public.webhook_events;
CREATE POLICY "Admins can view webhook events"
ON public.webhook_events
FOR SELECT
TO authenticated
USING (public.has_admin_role(auth.uid()));

COMMENT ON FUNCTION public.admin_session() IS
'Returns the authenticated administrative session. admin handles operations; super_admin additionally controls roles and sensitive settings.';
