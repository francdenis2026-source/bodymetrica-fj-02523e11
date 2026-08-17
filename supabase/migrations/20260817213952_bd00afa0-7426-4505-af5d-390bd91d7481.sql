-- 1. Tabela de Configurações (Admin)
CREATE TABLE IF NOT EXISTS public.admin_settings (
    key TEXT PRIMARY KEY,
    value TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_settings TO authenticated;
GRANT ALL ON public.admin_settings TO service_role;

ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage settings" ON public.admin_settings
    FOR ALL
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));

-- 2. Trilha de Auditoria
CREATE TABLE IF NOT EXISTS public.license_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    license_id UUID,
    user_id UUID,
    admin_id UUID,
    action TEXT NOT NULL,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

GRANT SELECT ON public.license_audit_logs TO authenticated;
GRANT ALL ON public.license_audit_logs TO service_role;

ALTER TABLE public.license_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit logs" ON public.license_audit_logs
    FOR SELECT
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));

-- 3. Alteração na tabela de licenças para revogação
ALTER TABLE public.licenses ADD COLUMN IF NOT EXISTS revoked_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.licenses ADD COLUMN IF NOT EXISTS revoked_by UUID;
