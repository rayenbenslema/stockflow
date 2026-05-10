-- 001_foundation_auth_tenancy.sql
-- StockFlow Tunisia — Foundation: auth profile sync, business tenancy, RLS
-- Apply via Supabase CLI: supabase db push
-- Or manually: paste into Supabase Dashboard SQL editor

-- =============================================================================
-- 1. EXTENSIONS
-- =============================================================================
create extension if not exists "pgcrypto" with schema "extensions";

-- =============================================================================
-- 2. ENUMS
-- =============================================================================
create type public.business_role as enum (
  'owner',
  'manager',
  'cashier',
  'analyst',
  'accountant'
);

-- =============================================================================
-- 3. TABLES
-- =============================================================================

-- 3.1 profiles
create table if not exists public.profiles (
  id          uuid        primary key references auth.users(id) on delete cascade,
  email       text        not null,
  full_name   text,
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 3.2 businesses
create table if not exists public.businesses (
  id            uuid        primary key default gen_random_uuid(),
  name          text        not null,
  legal_name    text,
  tax_identifier text,
  country       text        not null default 'TN',
  currency      text        not null default 'TND',
  created_by    uuid        references auth.users(id),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  deleted_at    timestamptz
);

-- 3.3 business_memberships
create table if not exists public.business_memberships (
  id          uuid                primary key default gen_random_uuid(),
  business_id uuid                not null references public.businesses(id) on delete cascade,
  user_id     uuid                not null references auth.users(id) on delete cascade,
  role        public.business_role not null default 'owner',
  created_at  timestamptz         not null default now(),
  unique(business_id, user_id)
);

-- 3.4 audit_logs
create table if not exists public.audit_logs (
  id            uuid        primary key default gen_random_uuid(),
  business_id   uuid        references public.businesses(id) on delete set null,
  actor_user_id uuid        references auth.users(id) on delete set null,
  action        text        not null,
  entity_type   text        not null,
  entity_id     uuid,
  metadata      jsonb       not null default '{}',
  created_at    timestamptz not null default now()
);

-- =============================================================================
-- 4. UPDATED_AT TRIGGER
-- =============================================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger trg_businesses_updated_at
  before update on public.businesses
  for each row execute function public.set_updated_at();

-- =============================================================================
-- 5. AUTH PROFILE SYNC TRIGGER
-- =============================================================================
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

-- =============================================================================
-- 6. ROW LEVEL SECURITY
-- =============================================================================

-- 6.1 profiles
alter table public.profiles enable row level security;

create policy "Les utilisateurs voient leur propre profil"
  on public.profiles for select
  using (id = auth.uid());

create policy "Les utilisateurs modifient leur propre profil"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- 6.2 businesses
alter table public.businesses enable row level security;

create policy "Les membres voient les entreprises auxquelles ils appartiennent"
  on public.businesses for select
  using (
    id in (
      select business_id
      from public.business_memberships
      where user_id = auth.uid()
    )
  );

create policy "Le créateur peut insérer une entreprise"
  on public.businesses for insert
  with check (created_by = auth.uid());

create policy "Propriétaire et manager peuvent modifier l'entreprise"
  on public.businesses for update
  using (
    id in (
      select business_id
      from public.business_memberships
      where user_id = auth.uid()
        and role in ('owner', 'manager')
    )
  );

create policy "Seul le propriétaire peut supprimer (soft delete) l'entreprise"
  on public.businesses for update
  using (
    id in (
      select business_id
      from public.business_memberships
      where user_id = auth.uid()
        and role = 'owner'
    )
  );

-- 6.3 business_memberships
alter table public.business_memberships enable row level security;

create policy "Les utilisateurs voient leurs propres adhésions"
  on public.business_memberships for select
  using (user_id = auth.uid());

create policy "Le propriétaire voit toutes les adhésions de son entreprise"
  on public.business_memberships for select
  using (
    business_id in (
      select business_id
      from public.business_memberships
      where user_id = auth.uid()
        and role = 'owner'
    )
  );

create policy "Le propriétaire peut ajouter des membres"
  on public.business_memberships for insert
  with check (
    business_id in (
      select business_id
      from public.business_memberships
      where user_id = auth.uid()
        and role = 'owner'
    )
  );

create policy "Le propriétaire peut modifier les rôles des membres"
  on public.business_memberships for update
  using (
    business_id in (
      select business_id
      from public.business_memberships
      where user_id = auth.uid()
        and role = 'owner'
    )
  );

create policy "Le propriétaire peut supprimer des membres"
  on public.business_memberships for delete
  using (
    business_id in (
      select business_id
      from public.business_memberships
      where user_id = auth.uid()
        and role = 'owner'
    )
  );

-- 6.4 audit_logs
alter table public.audit_logs enable row level security;

create policy "Les membres peuvent consulter les logs de leur entreprise"
  on public.audit_logs for select
  using (
    business_id in (
      select business_id
      from public.business_memberships
      where user_id = auth.uid()
    )
  );

-- Pas d'insert/update/delete pour les utilisateurs normaux
-- L'insertion est gérée via des fonctions security definer ou des Edge Functions

-- =============================================================================
-- 7. HELPER FUNCTIONS
-- =============================================================================

create or replace function public.is_business_member(p_business_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.business_memberships
    where business_id = p_business_id
      and user_id = auth.uid()
  );
$$;

create or replace function public.has_business_role(
  p_business_id uuid,
  p_roles       public.business_role[]
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.business_memberships
    where business_id = p_business_id
      and user_id = auth.uid()
      and role = any(p_roles)
  );
$$;

-- =============================================================================
-- 8. INDEXES
-- =============================================================================
create index if not exists idx_business_memberships_user_id    on public.business_memberships(user_id);
create index if not exists idx_business_memberships_business_id on public.business_memberships(business_id);
create index if not exists idx_audit_logs_business_id          on public.audit_logs(business_id);
create index if not exists idx_audit_logs_created_at           on public.audit_logs(created_at desc);
create index if not exists idx_profiles_email                  on public.profiles(email);
