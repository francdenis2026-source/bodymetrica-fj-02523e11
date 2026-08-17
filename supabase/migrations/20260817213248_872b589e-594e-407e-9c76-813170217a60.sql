-- Fix for SECURITY DEFINER function executable by public/authenticated
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

-- Policy for user_roles so admins can manage roles
CREATE POLICY "Admins can manage user roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Policy so users can see their own role
CREATE POLICY "Users can see their own role"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());
