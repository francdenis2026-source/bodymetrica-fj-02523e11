-- Administrative access tiers and flexible-duration license keys.
-- Safe to run more than once.

alter table if exists public.profiles
  add column if not exists access_tier text not null default 'free',
  add column if not exists access_source text,
  add column if not exists current_plan_id uuid,
  add column if not exists access_updated_at timestamptz;

alter table if exists public.licenses
  add column if not exists duration_minutes integer,
  add column if not exists access_tier text not null default 'paid',
  add column if not exists label text,
  add column if not exists source text not null default 'admin';

alter table if exists public.sales
  add column if not exists access_granted_at timestamptz,
  add column if not exists customer_email text;

-- Constraints are added defensively because this project has evolved through
-- multiple Supabase schemas.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'profiles_access_tier_check'
  ) then
    alter table public.profiles
      add constraint profiles_access_tier_check
      check (access_tier in ('free','paid','sponsored'));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'licenses_access_tier_check'
  ) then
    alter table public.licenses
      add constraint licenses_access_tier_check
      check (access_tier in ('paid','sponsored'));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'licenses_duration_minutes_check'
  ) then
    alter table public.licenses
      add constraint licenses_duration_minutes_check
      check (duration_minutes is null or duration_minutes > 0);
  end if;
end $$;

create index if not exists idx_profiles_access_tier on public.profiles(access_tier);
create index if not exists idx_profiles_license_status on public.profiles(license_status);
create index if not exists idx_licenses_duration_minutes on public.licenses(duration_minutes);
