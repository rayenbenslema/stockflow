-- 003_fix_workspace_rls_recursion.sql
-- StockFlow Tunisia — Fix RLS recursion in business workspace queries
--
-- Problem: Policies on businesses and business_memberships queried each
-- other recursively (businesses SELECT -> business_memberships -> owner
-- policy -> business_memberships again). PostgreSQL detects this and
-- either throws an error or silently returns empty results.
--
-- Fix: Drop all recursive policies and recreate them using SECURITY DEFINER
-- helper functions (is_business_member / has_business_role). These helpers
-- bypass RLS internally, breaking the recursion chain.
--
-- Apply after 001_foundation_auth_tenancy.sql, 002_business_bootstrap_rpc.sql

-- =============================================================================
-- 1. DROP RECURSIVE POLICIES
-- =============================================================================

-- businesses
drop policy if exists "Les membres voient les entreprises auxquelles ils appartiennent" on public.businesses;
drop policy if exists "Le créateur peut insérer une entreprise" on public.businesses;
drop policy if exists "Propriétaire et manager peuvent modifier l'entreprise" on public.businesses;
drop policy if exists "Seul le propriétaire peut supprimer (soft delete) l'entreprise" on public.businesses;

-- business_memberships
drop policy if exists "Les utilisateurs voient leurs propres adhésions" on public.business_memberships;
drop policy if exists "Le propriétaire voit toutes les adhésions de son entreprise" on public.business_memberships;
drop policy if exists "Le propriétaire peut ajouter des membres" on public.business_memberships;
drop policy if exists "Le propriétaire peut modifier les rôles des membres" on public.business_memberships;
drop policy if exists "Le propriétaire peut supprimer des membres" on public.business_memberships;

-- audit_logs
drop policy if exists "Les membres peuvent consulter les logs de leur entreprise" on public.audit_logs;

-- =============================================================================
-- 2. RECREATE POLICIES USING SECURITY DEFINER HELPERS
-- =============================================================================
--
-- The helper functions (is_business_member, has_business_role) are defined
-- with SECURITY DEFINER and search_path = '' in migration 001. Their internal
-- subqueries on business_memberships do NOT trigger RLS, so no recursion.

-- 2.1 businesses
create policy "Les membres peuvent voir leurs entreprises"
  on public.businesses for select
  using (public.is_business_member(id));

create policy "Le créateur peut insérer une entreprise"
  on public.businesses for insert
  with check (created_by = auth.uid());

create policy "Propriétaire et manager peuvent modifier"
  on public.businesses for update
  using (public.has_business_role(id, array['owner', 'manager']::public.business_role[]));

create policy "Propriétaire peut supprimer (soft delete)"
  on public.businesses for update
  using (public.has_business_role(id, array['owner']::public.business_role[]));

-- 2.2 business_memberships
create policy "Adhésions visibles par le membre ou le propriétaire"
  on public.business_memberships for select
  using (
    user_id = auth.uid()
    or public.has_business_role(business_id, array['owner']::public.business_role[])
  );

create policy "Propriétaire peut ajouter des membres"
  on public.business_memberships for insert
  with check (public.has_business_role(business_id, array['owner']::public.business_role[]));

create policy "Propriétaire peut modifier les rôles"
  on public.business_memberships for update
  using (public.has_business_role(business_id, array['owner']::public.business_role[]));

create policy "Propriétaire peut supprimer des membres"
  on public.business_memberships for delete
  using (public.has_business_role(business_id, array['owner']::public.business_role[]));

-- 2.3 audit_logs
create policy "Membres peuvent consulter les logs"
  on public.audit_logs for select
  using (public.is_business_member(business_id));
