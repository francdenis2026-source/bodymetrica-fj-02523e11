alter table public.profiles
  add column if not exists biological_sex text,
  add column if not exists registration_source text not null default 'self',
  add column if not exists account_status text not null default 'active',
  add column if not exists admin_notes text,
  add column if not exists last_seen_at timestamptz;

alter table public.profiles drop constraint if exists profiles_biological_sex_check;
alter table public.profiles add constraint profiles_biological_sex_check check (biological_sex is null or biological_sex in ('female','male','not_informed'));
alter table public.profiles drop constraint if exists profiles_registration_source_check;
alter table public.profiles add constraint profiles_registration_source_check check (registration_source in ('self','admin'));
alter table public.profiles drop constraint if exists profiles_account_status_check;
alter table public.profiles add constraint profiles_account_status_check check (account_status in ('active','suspended','disabled','deleted'));

create index if not exists profiles_cpf_digits_idx on public.profiles ((regexp_replace(coalesce(cpf, ''), '\D', '', 'g')));

create or replace function public.enforce_unique_normalized_cpf()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare normalized text;
begin
  if new.cpf is null or btrim(new.cpf) = '' then return new; end if;
  normalized := regexp_replace(new.cpf, '\D', '', 'g');
  if length(normalized) <> 11 then raise exception 'CPF deve conter 11 dígitos'; end if;
  if exists (select 1 from public.profiles p where p.id <> new.id and regexp_replace(coalesce(p.cpf, ''), '\D', '', 'g') = normalized) then
    raise exception 'CPF já cadastrado';
  end if;
  new.cpf := normalized;
  return new;
end;
$$;

drop trigger if exists trg_profiles_unique_cpf on public.profiles;
create trigger trg_profiles_unique_cpf before insert or update of cpf on public.profiles for each row execute function public.enforce_unique_normalized_cpf();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id,email,name,cpf,birth_date,biological_sex,goal,weight,height,activity_level,account_status,registration_source)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    nullif(regexp_replace(coalesce(new.raw_user_meta_data->>'cpf', ''), '\D', '', 'g'), ''),
    nullif(new.raw_user_meta_data->>'birth_date', '')::date,
    coalesce(nullif(new.raw_user_meta_data->>'biological_sex', ''), 'not_informed'),
    nullif(new.raw_user_meta_data->>'goal', ''),
    nullif(new.raw_user_meta_data->>'weight', '')::numeric,
    nullif(new.raw_user_meta_data->>'height', '')::numeric,
    nullif(new.raw_user_meta_data->>'activity_level', ''),
    'active',
    coalesce(nullif(new.raw_user_meta_data->>'registration_source', ''), 'self')
  )
  on conflict (id) do update set
    email=excluded.email,
    name=coalesce(excluded.name, public.profiles.name),
    cpf=coalesce(excluded.cpf, public.profiles.cpf),
    birth_date=coalesce(excluded.birth_date, public.profiles.birth_date),
    biological_sex=coalesce(excluded.biological_sex, public.profiles.biological_sex),
    goal=coalesce(excluded.goal, public.profiles.goal),
    weight=coalesce(excluded.weight, public.profiles.weight),
    height=coalesce(excluded.height, public.profiles.height),
    activity_level=coalesce(excluded.activity_level, public.profiles.activity_level),
    registration_source=coalesce(excluded.registration_source, public.profiles.registration_source),
    updated_at=now();

  insert into public.user_roles (user_id, role) values (new.id, 'user') on conflict do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create or replace function public.resolve_login_email(_identifier text)
returns text
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  normalized text := regexp_replace(coalesce(_identifier, ''), '\D', '', 'g');
  resolved text;
begin
  if position('@' in coalesce(_identifier, '')) > 0 then return lower(btrim(_identifier)); end if;
  if length(normalized) <> 11 then return null; end if;
  select u.email into resolved
  from public.profiles p join auth.users u on u.id=p.id
  where regexp_replace(coalesce(p.cpf, ''), '\D', '', 'g')=normalized
    and coalesce(p.account_status,'active')='active'
  limit 1;
  return resolved;
end;
$$;

grant execute on function public.resolve_login_email(text) to anon, authenticated;
