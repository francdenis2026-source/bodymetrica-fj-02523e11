alter table public.profiles
  add column if not exists name text,
  add column if not exists full_name text,
  add column if not exists email text,
  add column if not exists cpf text,
  add column if not exists birth_date date,
  add column if not exists biological_sex text,
  add column if not exists goal text,
  add column if not exists weight numeric,
  add column if not exists height numeric,
  add column if not exists activity_level text,
  add column if not exists license_status text not null default 'demonstrative',
  add column if not exists license_key text,
  add column if not exists license_expires_at timestamptz,
  add column if not exists account_status text not null default 'active',
  add column if not exists admin_notes text,
  add column if not exists last_seen_at timestamptz,
  add column if not exists registration_source text not null default 'self';

update public.profiles p
set email = coalesce(p.email, u.email),
    name = coalesce(p.name, p.display_name, u.email),
    full_name = coalesce(p.full_name, p.display_name, p.name, u.email)
from auth.users u
where u.id = p.id;

create unique index if not exists profiles_cpf_normalized_unique
on public.profiles ((regexp_replace(cpf, '\D', '', 'g')))
where cpf is not null and btrim(cpf) <> '';

create table if not exists public.security_logs (
  id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete set null,
  action text not null, ip_address text, user_agent text, details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create table if not exists public.subscription_plans (
  id uuid primary key default gen_random_uuid(), name text not null, description text,
  price numeric(12,2) not null default 0, duration_days integer not null default 30,
  is_active boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.sales (
  id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete set null,
  plan_id uuid references public.subscription_plans(id) on delete set null, amount numeric(12,2) not null default 0,
  status text not null default 'pending', provider text, provider_reference text,
  sold_at timestamptz not null default now(), created_at timestamptz not null default now()
);
create table if not exists public.sponsor_ads (
  id uuid primary key default gen_random_uuid(), title text not null, sponsor_name text, image_url text,
  target_url text, placement text not null default 'dashboard', is_active boolean not null default true,
  impressions bigint not null default 0, clicks bigint not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.licenses (
  id uuid primary key default gen_random_uuid(), license_key text not null unique, status text not null default 'unused',
  user_id uuid references public.profiles(id) on delete set null, created_by uuid references auth.users(id) on delete set null,
  activated_at timestamptz, expires_at timestamptz, revoked_at timestamptz, revoked_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.license_audit_logs (
  id uuid primary key default gen_random_uuid(), license_id uuid references public.licenses(id) on delete set null,
  user_id uuid references auth.users(id) on delete set null, admin_id uuid references auth.users(id) on delete set null,
  action text not null, details jsonb not null default '{}'::jsonb, created_at timestamptz not null default now()
);
create table if not exists public.admin_settings (
  key text primary key, value text, updated_at timestamptz not null default now()
);
create table if not exists public.webhook_events (
  id uuid primary key default gen_random_uuid(), provider text, event_type text, payload jsonb not null default '{}'::jsonb,
  status text not null default 'received', created_at timestamptz not null default now()
);

create or replace function public.resolve_login_email(_identifier text)
returns text language plpgsql stable security definer set search_path = public, auth as $$
declare normalized text := regexp_replace(coalesce(_identifier, ''), '\D', '', 'g'); resolved text;
begin
  if position('@' in coalesce(_identifier, '')) > 0 then return lower(btrim(_identifier)); end if;
  if length(normalized) <> 11 then return null; end if;
  select u.email into resolved from public.profiles p join auth.users u on u.id=p.id
  where regexp_replace(coalesce(p.cpf,''), '\D', '', 'g')=normalized and coalesce(p.account_status,'active')='active' limit 1;
  return resolved;
end; $$;
grant execute on function public.resolve_login_email(text) to anon, authenticated;

create or replace function public.log_security_activity(_user_id uuid, _action text, _details jsonb default '{}'::jsonb)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.security_logs(user_id,action,details) values (_user_id,_action,coalesce(_details,'{}'::jsonb));
  update public.profiles set last_seen_at=now() where id=_user_id;
end; $$;
grant execute on function public.log_security_activity(uuid,text,jsonb) to authenticated;

alter table public.security_logs enable row level security;
alter table public.subscription_plans enable row level security;
alter table public.sales enable row level security;
alter table public.sponsor_ads enable row level security;
alter table public.licenses enable row level security;
alter table public.license_audit_logs enable row level security;
alter table public.admin_settings enable row level security;
alter table public.webhook_events enable row level security;

drop policy if exists bodymetrica_admin_read_profiles on public.profiles;
create policy bodymetrica_admin_read_profiles on public.profiles for select to authenticated using (public.is_admin());
drop policy if exists bodymetrica_admin_update_profiles on public.profiles;
create policy bodymetrica_admin_update_profiles on public.profiles for update to authenticated using (public.is_admin()) with check (public.is_admin());

do $$ declare t text; begin
  foreach t in array array['security_logs','subscription_plans','sales','sponsor_ads','licenses','license_audit_logs','admin_settings','webhook_events'] loop
    execute format('drop policy if exists bodymetrica_admin_all on public.%I', t);
    execute format('create policy bodymetrica_admin_all on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())', t);
  end loop;
end $$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles(id,display_name,role,name,full_name,email,cpf,birth_date,biological_sex,goal,weight,height,activity_level,account_status,registration_source)
  values(new.id,
    coalesce(nullif(new.raw_user_meta_data->>'name',''),nullif(new.raw_user_meta_data->>'full_name',''),new.email),
    'consumer',
    coalesce(nullif(new.raw_user_meta_data->>'name',''),nullif(new.raw_user_meta_data->>'full_name',''),new.email),
    coalesce(nullif(new.raw_user_meta_data->>'full_name',''),nullif(new.raw_user_meta_data->>'name',''),new.email),
    new.email,
    nullif(regexp_replace(coalesce(new.raw_user_meta_data->>'cpf',''), '\D', '', 'g'),''),
    nullif(new.raw_user_meta_data->>'birth_date','')::date,
    nullif(new.raw_user_meta_data->>'biological_sex',''), nullif(new.raw_user_meta_data->>'goal',''),
    nullif(new.raw_user_meta_data->>'weight','')::numeric, nullif(new.raw_user_meta_data->>'height','')::numeric,
    nullif(new.raw_user_meta_data->>'activity_level',''), 'active',
    coalesce(nullif(new.raw_user_meta_data->>'registration_source',''),'self'))
  on conflict(id) do update set
    display_name=coalesce(excluded.display_name,profiles.display_name), name=coalesce(excluded.name,profiles.name),
    full_name=coalesce(excluded.full_name,profiles.full_name), email=coalesce(excluded.email,profiles.email),
    cpf=coalesce(excluded.cpf,profiles.cpf), birth_date=coalesce(excluded.birth_date,profiles.birth_date),
    biological_sex=coalesce(excluded.biological_sex,profiles.biological_sex), goal=coalesce(excluded.goal,profiles.goal),
    weight=coalesce(excluded.weight,profiles.weight), height=coalesce(excluded.height,profiles.height),
    activity_level=coalesce(excluded.activity_level,profiles.activity_level),
    registration_source=coalesce(excluded.registration_source,profiles.registration_source), updated_at=now();
  if not exists(select 1 from public.user_roles where user_id=new.id) then
    insert into public.user_roles(user_id,role) values(new.id,'consumer'::public.app_role);
  end if;
  return new;
end; $$;
