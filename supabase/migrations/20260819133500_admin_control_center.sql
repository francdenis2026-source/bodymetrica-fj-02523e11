-- Administrative control center: accounts, commercial plans, sales and sponsorships.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS account_status text NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS admin_notes text,
  ADD COLUMN IF NOT EXISTS last_seen_at timestamptz;

DO $$ BEGIN
  ALTER TABLE public.profiles
    ADD CONSTRAINT profiles_account_status_check
    CHECK (account_status IN ('active','suspended','disabled','deleted'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric(12,2) NOT NULL DEFAULT 0,
  duration_days integer NOT NULL DEFAULT 30,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  plan_id uuid REFERENCES public.subscription_plans(id) ON DELETE SET NULL,
  license_id uuid REFERENCES public.licenses(id) ON DELETE SET NULL,
  amount numeric(12,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  provider text NOT NULL DEFAULT 'manual',
  provider_reference text,
  sold_at timestamptz NOT NULL DEFAULT now(),
  details jsonb NOT NULL DEFAULT '{}'::jsonb
);

DO $$ BEGIN
  ALTER TABLE public.sales
    ADD CONSTRAINT sales_status_check
    CHECK (status IN ('pending','paid','refunded','cancelled','failed'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.sponsor_ads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  sponsor_name text NOT NULL,
  image_url text,
  target_url text,
  placement text NOT NULL DEFAULT 'dashboard',
  is_active boolean NOT NULL DEFAULT true,
  starts_at timestamptz,
  ends_at timestamptz,
  impressions bigint NOT NULL DEFAULT 0,
  clicks bigint NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsor_ads ENABLE ROW LEVEL SECURITY;

-- Admin access to customer profiles and access logs.
DROP POLICY IF EXISTS "Admin manage profiles" ON public.profiles;
CREATE POLICY "Admin manage profiles" ON public.profiles
FOR ALL TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.user_roles ur
  WHERE ur.user_id = auth.uid() AND ur.role::text IN ('admin','super_admin')
))
WITH CHECK (EXISTS (
  SELECT 1 FROM public.user_roles ur
  WHERE ur.user_id = auth.uid() AND ur.role::text IN ('admin','super_admin')
));

DROP POLICY IF EXISTS "Admin view security logs" ON public.security_logs;
CREATE POLICY "Admin view security logs" ON public.security_logs
FOR SELECT TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.user_roles ur
  WHERE ur.user_id = auth.uid() AND ur.role::text IN ('admin','super_admin')
));

DROP POLICY IF EXISTS "Admin manage subscription plans" ON public.subscription_plans;
CREATE POLICY "Admin manage subscription plans" ON public.subscription_plans
FOR ALL TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.user_roles ur
  WHERE ur.user_id = auth.uid() AND ur.role::text IN ('admin','super_admin')
))
WITH CHECK (EXISTS (
  SELECT 1 FROM public.user_roles ur
  WHERE ur.user_id = auth.uid() AND ur.role::text IN ('admin','super_admin')
));

DROP POLICY IF EXISTS "Admin manage sales" ON public.sales;
CREATE POLICY "Admin manage sales" ON public.sales
FOR ALL TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.user_roles ur
  WHERE ur.user_id = auth.uid() AND ur.role::text IN ('admin','super_admin')
))
WITH CHECK (EXISTS (
  SELECT 1 FROM public.user_roles ur
  WHERE ur.user_id = auth.uid() AND ur.role::text IN ('admin','super_admin')
));

DROP POLICY IF EXISTS "Admin manage sponsor ads" ON public.sponsor_ads;
CREATE POLICY "Admin manage sponsor ads" ON public.sponsor_ads
FOR ALL TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.user_roles ur
  WHERE ur.user_id = auth.uid() AND ur.role::text IN ('admin','super_admin')
))
WITH CHECK (EXISTS (
  SELECT 1 FROM public.user_roles ur
  WHERE ur.user_id = auth.uid() AND ur.role::text IN ('admin','super_admin')
));

CREATE INDEX IF NOT EXISTS idx_profiles_account_status ON public.profiles(account_status);
CREATE INDEX IF NOT EXISTS idx_profiles_last_seen_at ON public.profiles(last_seen_at DESC);
CREATE INDEX IF NOT EXISTS idx_sales_sold_at ON public.sales(sold_at DESC);
CREATE INDEX IF NOT EXISTS idx_sales_status ON public.sales(status);
CREATE INDEX IF NOT EXISTS idx_sponsor_ads_active ON public.sponsor_ads(is_active);
