# Body Métrica FJ - Core Schema
-- Created: 2026-08-13
-- Author: Lovable Agent

-- 1. Enums
create type public.app_role as enum ('admin', 'moderator', 'user');
create type public.gender as enum ('male', 'female', 'other');
create type public.activity_level as enum ('sedentary', 'light', 'moderate', 'active', 'very_active');
create type public.goal_type as enum ('weight_loss', 'hypertrophy', 'endurance', 'fitness', 'maintenance', 'recomposition');

-- 2. Tables
create table public.user_roles (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade not null,
    role app_role not null default 'user',
    unique (user_id, role)
);

create table public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    cpf text unique not null,
    full_name text,
    avatar_url text,
    birth_date date,
    gender gender,
    height numeric(5,2), -- cm
    weight_goal numeric(5,2), -- kg
    activity_level activity_level default 'sedentary',
    goal_type goal_type,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table public.body_records (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade not null,
    date timestamptz default now(),
    weight numeric(5,2) not null,
    fat_percentage numeric(5,2),
    muscle_mass numeric(5,2),
    notes text,
    photo_url text,
    created_at timestamptz default now()
);

create table public.body_measurements (
    id uuid primary key default gen_random_uuid(),
    record_id uuid references public.body_records(id) on delete cascade not null,
    user_id uuid references auth.users(id) on delete cascade not null,
    waist numeric(5,2),
    abdomen numeric(5,2),
    hip numeric(5,2),
    chest numeric(5,2),
    arm_left numeric(5,2),
    arm_right numeric(5,2),
    forearm_left numeric(5,2),
    forearm_right numeric(5,2),
    thigh_left numeric(5,2),
    thigh_right numeric(5,2),
    calf_left numeric(5,2),
    calf_right numeric(5,2),
    neck numeric(5,2),
    created_at timestamptz default now()
);

create table public.water_logs (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade not null,
    amount_ml integer not null,
    date date default current_date,
    created_at timestamptz default now()
);

create table public.supplements (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    category text,
    brand text,
    created_at timestamptz default now()
);

create table public.user_supplements (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade not null,
    supplement_id uuid references public.supplements(id),
    name_custom text,
    dosage text,
    frequency text,
    schedule time[],
    stock_quantity numeric(10,2),
    stock_unit text,
    is_active boolean default true,
    created_at timestamptz default now()
);

create table public.foods (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    calories_100g numeric(10,2),
    protein_100g numeric(10,2),
    carbs_100g numeric(10,2),
    fat_100g numeric(10,2),
    serving_size numeric(10,2),
    serving_unit text,
    is_admin boolean default false,
    created_at timestamptz default now()
);

create table public.meals (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade not null,
    name text not null,
    scheduled_time time,
    created_at timestamptz default now()
);

create table public.meal_items (
    id uuid primary key default gen_random_uuid(),
    meal_id uuid references public.meals(id) on delete cascade not null,
    food_id uuid references public.foods(id),
    amount numeric(10,2),
    unit text,
    created_at timestamptz default now()
);

create table public.admin_audit_logs (
    id uuid primary key default gen_random_uuid(),
    admin_id uuid references auth.users(id),
    action text not null,
    entity_type text not null,
    entity_id uuid,
    details jsonb,
    created_at timestamptz default now()
);

-- 3. Security (Grants)
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;

grant select, update on public.profiles to authenticated;
grant all on public.profiles to service_role;

grant select, insert, update, delete on public.body_records to authenticated;
grant all on public.body_records to service_role;

grant select, insert, update, delete on public.body_measurements to authenticated;
grant all on public.body_measurements to service_role;

grant select, insert, update, delete on public.water_logs to authenticated;
grant all on public.water_logs to service_role;

grant select on public.supplements to authenticated;
grant all on public.supplements to service_role;

grant select, insert, update, delete on public.user_supplements to authenticated;
grant all on public.user_supplements to service_role;

grant select on public.foods to authenticated;
grant all on public.foods to service_role;

grant select, insert, update, delete on public.meals to authenticated;
grant all on public.meals to service_role;

grant select, insert, update, delete on public.meal_items to authenticated;
grant all on public.meal_items to service_role;

grant select on public.admin_audit_logs to authenticated;
grant all on public.admin_audit_logs to service_role;

-- 4. RLS & Functions
alter table public.user_roles enable row level security;
alter table public.profiles enable row level security;
alter table public.body_records enable row level security;
alter table public.body_measurements enable row level security;
alter table public.water_logs enable row level security;
alter table public.supplements enable row level security;
alter table public.user_supplements enable row level security;
alter table public.foods enable row level security;
alter table public.meals enable row level security;
alter table public.meal_items enable row level security;
alter table public.admin_audit_logs enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

-- Policies
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

create policy "Users can view own records" on public.body_records for select using (auth.uid() = user_id);
create policy "Users can insert own records" on public.body_records for insert with check (auth.uid() = user_id);

create policy "Admins can view audit logs" on public.admin_audit_logs for select using (public.has_role(auth.uid(), 'admin'));
