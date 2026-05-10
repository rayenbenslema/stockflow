-- 004_inventory_foundation.sql
-- StockFlow Tunisia — Inventory Foundation: immutable stock ledger architecture
--
-- Principles:
--   - Stock is DERIVED from movements (no current_stock column)
--   - Every mutation is a new row in stock_movements
--   - stock_movements is append-only: NO UPDATE, NO DELETE
--   - Multi-tenant via business_id on every table
--   - Variants supported from day one
--   - Barcode/SKU unique per business
--   - All prices use numeric(12,3) for precision
--
-- Apply after 003_fix_workspace_rls_recursion.sql

-- =============================================================================
-- 1. ENUMS
-- =============================================================================
create type public.stock_movement_type as enum (
  'initial',
  'purchase',
  'sale',
  'adjustment',
  'return_customer',
  'return_supplier',
  'transfer_in',
  'transfer_out',
  'damaged',
  'expired'
);

create type public.product_status as enum (
  'active',
  'archived',
  'draft'
);

-- =============================================================================
-- 2. TABLES
-- =============================================================================

-- 2.1 product_categories
create table if not exists public.product_categories (
  id          uuid        primary key default gen_random_uuid(),
  business_id uuid        not null references public.businesses(id) on delete cascade,
  name        text        not null,
  slug        text,
  parent_id   uuid        references public.product_categories(id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 2.2 product_brands
create table if not exists public.product_brands (
  id          uuid        primary key default gen_random_uuid(),
  business_id uuid        not null references public.businesses(id) on delete cascade,
  name        text        not null,
  created_at  timestamptz not null default now()
);

-- 2.3 products
create table if not exists public.products (
  id                  uuid              primary key default gen_random_uuid(),
  business_id         uuid              not null references public.businesses(id) on delete cascade,
  category_id         uuid              references public.product_categories(id) on delete set null,
  brand_id            uuid              references public.product_brands(id) on delete set null,
  name                text              not null,
  slug                text,
  sku                 text,
  barcode             text,
  description         text,
  image_url           text,
  cost_price          numeric(12,3)     not null default 0,
  sale_price          numeric(12,3)     not null default 0,
  tax_rate            numeric(5,2)      not null default 0,
  status              public.product_status not null default 'draft',
  track_inventory     boolean           not null default true,
  low_stock_threshold numeric(12,3)     default 0,
  allow_negative_stock boolean          not null default false,
  has_variants        boolean           not null default false,
  metadata            jsonb             not null default '{}',
  created_by          uuid              references auth.users(id),
  created_at          timestamptz       not null default now(),
  updated_at          timestamptz       not null default now(),
  deleted_at          timestamptz,
  constraint uq_products_sku unique(business_id, sku),
  constraint uq_products_barcode unique(business_id, barcode)
);

-- 2.4 product_variants
create table if not exists public.product_variants (
  id                  uuid          primary key default gen_random_uuid(),
  product_id          uuid          not null references public.products(id) on delete cascade,
  business_id         uuid          not null references public.businesses(id) on delete cascade,
  name                text          not null,
  sku                 text,
  barcode             text,
  sale_price_override numeric(12,3),
  cost_price_override numeric(12,3),
  attributes          jsonb         not null default '{}',
  created_at          timestamptz   not null default now(),
  constraint uq_product_variants_sku unique(business_id, sku),
  constraint uq_product_variants_barcode unique(business_id, barcode)
);

-- 2.5 stock_movements (immutable ledger — NO UPDATE, NO DELETE)
create table if not exists public.stock_movements (
  id              uuid                    primary key default gen_random_uuid(),
  business_id     uuid                    not null references public.businesses(id) on delete cascade,
  product_id      uuid                    not null references public.products(id) on delete cascade,
  variant_id      uuid                    references public.product_variants(id) on delete set null,
  movement_type   public.stock_movement_type not null,
  quantity        numeric(12,3)           not null,
  unit_cost       numeric(12,3),
  reference_type  text,
  reference_id    uuid,
  notes           text,
  metadata        jsonb                   not null default '{}',
  created_by      uuid                    references auth.users(id),
  created_at      timestamptz             not null default now()
);

-- =============================================================================
-- 3. UPDATED_AT TRIGGERS
-- =============================================================================
create trigger trg_product_categories_updated_at
  before update on public.product_categories
  for each row execute function public.set_updated_at();

create trigger trg_products_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- =============================================================================
-- 4. INVENTORY STOCK LEVELS VIEW
-- =============================================================================
-- Derives current stock from movement aggregation.
-- NO update/delete on this view — read-only.
create or replace view public.inventory_stock_levels as
select
  p.business_id,
  p.id as product_id,
  mv.variant_id,
  coalesce(sum(mv.quantity), 0) as current_stock,
  p.low_stock_threshold,
  p.allow_negative_stock,
  p.track_inventory
from public.products p
left join public.stock_movements mv on mv.product_id = p.id and mv.business_id = p.business_id
where p.deleted_at is null
group by p.business_id, p.id, mv.variant_id, p.low_stock_threshold, p.allow_negative_stock, p.track_inventory;

-- =============================================================================
-- 5. HELPER RPC: get_product_stock
-- =============================================================================
create or replace function public.get_product_stock(
  p_business_id uuid,
  p_product_id  uuid,
  p_variant_id  uuid default null
)
returns numeric
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_stock numeric;
begin
  select coalesce(sum(m.quantity), 0)
  into v_stock
  from public.stock_movements m
  where m.business_id = p_business_id
    and m.product_id = p_product_id
    and (p_variant_id is null or m.variant_id = p_variant_id);

  return v_stock;
end;
$$;

revoke execute on function public.get_product_stock(uuid, uuid, uuid) from public;
grant execute on function public.get_product_stock(uuid, uuid, uuid) to authenticated;

-- =============================================================================
-- 6. RPC: create_stock_movement
-- =============================================================================
-- SECURITY DEFINER: bypasses RLS so that the function can:
--   - validate business membership
--   - check negative stock rules
--   - insert the immutable movement row
--   - write the audit log
create or replace function public.create_stock_movement(
  p_business_id    uuid,
  p_product_id     uuid,
  p_movement_type  public.stock_movement_type,
  p_quantity       numeric,
  p_variant_id     uuid default null,
  p_unit_cost      numeric default null,
  p_reference_type text default null,
  p_reference_id   uuid default null,
  p_notes          text default null,
  p_metadata       jsonb default '{}'
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_movement_id uuid;
  v_user_id     uuid;
  v_current_stock numeric;
  v_allow_negative boolean;
begin
  -- Authenticate
  v_user_id := auth.uid();
  if v_user_id is null then
    raise exception 'Authentification requise';
  end if;

  -- Validate business membership
  if not public.is_business_member(p_business_id) then
    raise exception 'Vous n''êtes pas membre de cette entreprise';
  end if;

  -- Validate product belongs to business
  if not exists (
    select 1 from public.products
    where id = p_product_id and business_id = p_business_id and deleted_at is null
  ) then
    raise exception 'Produit introuvable dans cette entreprise';
  end if;

  -- Check negative stock rules for outgoing movements
  if p_quantity < 0 then
    select allow_negative_stock into v_allow_negative
    from public.products
    where id = p_product_id and business_id = p_business_id;

    if not v_allow_negative then
      v_current_stock := public.get_product_stock(p_business_id, p_product_id, p_variant_id);
      if (v_current_stock + p_quantity) < 0 then
        raise exception 'Stock insuffisant. Stock actuel : %, quantité demandée : %',
          v_current_stock, abs(p_quantity);
      end if;
    end if;
  end if;

  -- Insert movement
  insert into public.stock_movements (
    business_id, product_id, variant_id, movement_type, quantity,
    unit_cost, reference_type, reference_id, notes, metadata, created_by
  ) values (
    p_business_id, p_product_id, p_variant_id, p_movement_type, p_quantity,
    p_unit_cost, p_reference_type, p_reference_id, p_notes, p_metadata, v_user_id
  ) returning id into v_movement_id;

  -- Audit log
  insert into public.audit_logs (
    business_id, actor_user_id, action, entity_type, entity_id, metadata
  ) values (
    p_business_id, v_user_id, 'inventory.stock_movement.created',
    'stock_movement', v_movement_id,
    jsonb_build_object(
      'product_id', p_product_id,
      'variant_id', p_variant_id,
      'movement_type', p_movement_type,
      'quantity', p_quantity
    )
  );

  return v_movement_id;
end;
$$;

revoke execute on function public.create_stock_movement(
  uuid, uuid, public.stock_movement_type, numeric,
  uuid, numeric, text, uuid, text, jsonb
) from public;
grant execute on function public.create_stock_movement(
  uuid, uuid, public.stock_movement_type, numeric,
  uuid, numeric, text, uuid, text, jsonb
) to authenticated;

-- =============================================================================
-- 7. ROW LEVEL SECURITY
-- =============================================================================

-- 7.1 product_categories
alter table public.product_categories enable row level security;

create policy "Membres lisent les catégories"
  on public.product_categories for select
  using (public.is_business_member(business_id));

create policy "Propriétaire et manager gèrent les catégories"
  on public.product_categories for insert
  with check (public.has_business_role(business_id, array['owner', 'manager']::public.business_role[]));

create policy "Propriétaire et manager modifient les catégories"
  on public.product_categories for update
  using (public.has_business_role(business_id, array['owner', 'manager']::public.business_role[]));

create policy "Propriétaire et manager suppriment les catégories"
  on public.product_categories for delete
  using (public.has_business_role(business_id, array['owner', 'manager']::public.business_role[]));

-- 7.2 product_brands
alter table public.product_brands enable row level security;

create policy "Membres lisent les marques"
  on public.product_brands for select
  using (public.is_business_member(business_id));

create policy "Propriétaire et manager gèrent les marques"
  on public.product_brands for insert
  with check (public.has_business_role(business_id, array['owner', 'manager']::public.business_role[]));

create policy "Propriétaire et manager modifient les marques"
  on public.product_brands for update
  using (public.has_business_role(business_id, array['owner', 'manager']::public.business_role[]));

create policy "Propriétaire et manager suppriment les marques"
  on public.product_brands for delete
  using (public.has_business_role(business_id, array['owner', 'manager']::public.business_role[]));

-- 7.3 products
alter table public.products enable row level security;

create policy "Membres lisent les produits"
  on public.products for select
  using (public.is_business_member(business_id));

create policy "Propriétaire, manager, accountant, cashier créent des produits"
  on public.products for insert
  with check (public.has_business_role(business_id, array['owner', 'manager', 'cashier', 'accountant']::public.business_role[]));

create policy "Propriétaire et manager modifient les produits"
  on public.products for update
  using (public.has_business_role(business_id, array['owner', 'manager']::public.business_role[]));

create policy "Propriétaire et manager suppriment (soft delete) les produits"
  on public.products for update
  using (public.has_business_role(business_id, array['owner', 'manager']::public.business_role[]));

-- 7.4 product_variants
alter table public.product_variants enable row level security;

create policy "Membres lisent les variantes"
  on public.product_variants for select
  using (public.is_business_member(business_id));

create policy "Propriétaire, manager, accountant, cashier gèrent les variantes"
  on public.product_variants for insert
  with check (public.has_business_role(business_id, array['owner', 'manager', 'cashier', 'accountant']::public.business_role[]));

create policy "Propriétaire et manager modifient les variantes"
  on public.product_variants for update
  using (public.has_business_role(business_id, array['owner', 'manager']::public.business_role[]));

create policy "Propriétaire et manager suppriment les variantes"
  on public.product_variants for delete
  using (public.has_business_role(business_id, array['owner', 'manager']::public.business_role[]));

-- 7.5 stock_movements (immutable: SELECT only for normal operations)
alter table public.stock_movements enable row level security;

create policy "Membres lisent les mouvements de stock"
  on public.stock_movements for select
  using (public.is_business_member(business_id));

-- NO INSERT/UPDATE/DELETE policies for stock_movements
-- All mutations go through the SECURITY DEFINER RPC create_stock_movement()

-- =============================================================================
-- 8. INDEXES
-- =============================================================================

-- product_categories
create index if not exists idx_product_categories_business_id on public.product_categories(business_id);
create index if not exists idx_product_categories_parent_id on public.product_categories(parent_id);

-- product_brands
create index if not exists idx_product_brands_business_id on public.product_brands(business_id);

-- products
create index if not exists idx_products_business_id on public.products(business_id);
create index if not exists idx_products_category_id on public.products(category_id);
create index if not exists idx_products_brand_id on public.products(brand_id);
create index if not exists idx_products_sku on public.products(sku);
create index if not exists idx_products_barcode on public.products(barcode);
create index if not exists idx_products_status on public.products(status);
create index if not exists idx_products_created_by on public.products(created_by);

-- product_variants
create index if not exists idx_product_variants_product_id on public.product_variants(product_id);
create index if not exists idx_product_variants_business_id on public.product_variants(business_id);
create index if not exists idx_product_variants_sku on public.product_variants(sku);
create index if not exists idx_product_variants_barcode on public.product_variants(barcode);

-- stock_movements
create index if not exists idx_stock_movements_business_id on public.stock_movements(business_id);
create index if not exists idx_stock_movements_product_id on public.stock_movements(product_id);
create index if not exists idx_stock_movements_variant_id on public.stock_movements(variant_id);
create index if not exists idx_stock_movements_movement_type on public.stock_movements(movement_type);
create index if not exists idx_stock_movements_created_at on public.stock_movements(created_at desc);
create index if not exists idx_stock_movements_reference on public.stock_movements(reference_type, reference_id);
