-- 002_business_bootstrap_rpc.sql
-- StockFlow Tunisia — Business bootstrap RPC for onboarding flow
-- Apply after 001_foundation_auth_tenancy.sql

-- =============================================================================
-- 1. CREATE BUSINESS WITH OWNER (RPC)
-- =============================================================================
-- Atomic operation:
--   1. Insert into public.businesses
--   2. Insert into public.business_memberships (role = owner)
--   3. Insert into public.audit_logs (action = business.created)
--   4. Return business id
--
-- SECURITY DEFINER: bypasses RLS so that the onboarding RPC can insert the
--   owner membership before the owner has any business membership.
-- search_path = '': prevents schema-based privilege escalation.
-- =============================================================================

create or replace function public.create_business_with_owner(
  p_name          text,
  p_legal_name    text default null,
  p_tax_identifier text default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_business_id uuid;
  v_user_id     uuid;
begin
  -- Ensure the caller is authenticated
  v_user_id := auth.uid();
  if v_user_id is null then
    raise exception 'Authentification requise' using hint = 'Vous devez être connecté pour créer une entreprise.';
  end if;

  -- 1. Create business
  insert into public.businesses (name, legal_name, tax_identifier, created_by, country, currency)
  values (p_name, p_legal_name, p_tax_identifier, v_user_id, 'TN', 'TND')
  returning id into v_business_id;

  -- 2. Create owner membership
  insert into public.business_memberships (business_id, user_id, role)
  values (v_business_id, v_user_id, 'owner');

  -- 3. Audit log
  insert into public.audit_logs (business_id, actor_user_id, action, entity_type, entity_id, metadata)
  values (v_business_id, v_user_id, 'business.created', 'business', v_business_id,
    jsonb_build_object('source', 'onboarding', 'business_name', p_name));

  return v_business_id;
end;
$$;

-- Grant execute to authenticated users only
revoke execute on function public.create_business_with_owner(text, text, text) from public;
grant execute on function public.create_business_with_owner(text, text, text) to authenticated;
