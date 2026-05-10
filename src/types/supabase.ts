export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type BusinessRole =
  | "owner"
  | "manager"
  | "cashier"
  | "analyst"
  | "accountant";

export type StockMovementType =
  | "initial"
  | "purchase"
  | "sale"
  | "adjustment"
  | "return_customer"
  | "return_supplier"
  | "transfer_in"
  | "transfer_out"
  | "damaged"
  | "expired";

export type ProductStatus =
  | "active"
  | "archived"
  | "draft";

export interface ProfileRow {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface BusinessRow {
  id: string;
  name: string;
  legal_name: string | null;
  tax_identifier: string | null;
  country: string;
  currency: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface BusinessMembershipRow {
  id: string;
  business_id: string;
  user_id: string;
  role: BusinessRole;
  created_at: string;
}

export interface AuditLogRow {
  id: string;
  business_id: string | null;
  actor_user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  metadata: Json;
  created_at: string;
}

export interface ProductCategoryRow {
  id: string;
  business_id: string;
  name: string;
  slug: string | null;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductBrandRow {
  id: string;
  business_id: string;
  name: string;
  created_at: string;
}

export interface ProductRow {
  id: string;
  business_id: string;
  category_id: string | null;
  brand_id: string | null;
  name: string;
  slug: string | null;
  sku: string | null;
  barcode: string | null;
  description: string | null;
  image_url: string | null;
  cost_price: number;
  sale_price: number;
  tax_rate: number;
  status: ProductStatus;
  track_inventory: boolean;
  low_stock_threshold: number | null;
  allow_negative_stock: boolean;
  has_variants: boolean;
  metadata: Json;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface ProductVariantRow {
  id: string;
  product_id: string;
  business_id: string;
  name: string;
  sku: string | null;
  barcode: string | null;
  sale_price_override: number | null;
  cost_price_override: number | null;
  attributes: Json;
  created_at: string;
}

export interface StockMovementRow {
  id: string;
  business_id: string;
  product_id: string;
  variant_id: string | null;
  movement_type: StockMovementType;
  quantity: number;
  unit_cost: number | null;
  reference_type: string | null;
  reference_id: string | null;
  notes: string | null;
  metadata: Json;
  created_by: string | null;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: Omit<ProfileRow, "created_at" | "updated_at">;
        Update: Partial<Omit<ProfileRow, "id">>;
      };
      businesses: {
        Row: BusinessRow;
        Insert: Omit<BusinessRow, "id" | "created_at" | "updated_at" | "deleted_at">;
        Update: Partial<Omit<BusinessRow, "id">>;
      };
      business_memberships: {
        Row: BusinessMembershipRow;
        Insert: Omit<BusinessMembershipRow, "id" | "created_at">;
        Update: Partial<Omit<BusinessMembershipRow, "id">>;
      };
      audit_logs: {
        Row: AuditLogRow;
        Insert: Omit<AuditLogRow, "id" | "created_at">;
        Update: never;
      };
      product_categories: {
        Row: ProductCategoryRow;
        Insert: Omit<ProductCategoryRow, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<ProductCategoryRow, "id">>;
      };
      product_brands: {
        Row: ProductBrandRow;
        Insert: Omit<ProductBrandRow, "id" | "created_at">;
        Update: Partial<Omit<ProductBrandRow, "id">>;
      };
      products: {
        Row: ProductRow;
        Insert: Omit<ProductRow, "id" | "created_at" | "updated_at" | "deleted_at">;
        Update: Partial<Omit<ProductRow, "id">>;
      };
      product_variants: {
        Row: ProductVariantRow;
        Insert: Omit<ProductVariantRow, "id" | "created_at">;
        Update: Partial<Omit<ProductVariantRow, "id">>;
      };
      stock_movements: {
        Row: StockMovementRow;
        Insert: Omit<StockMovementRow, "id" | "created_at">;
        Update: never;
      };
    };
    Views: {
      inventory_stock_levels: {
        Row: {
          business_id: string;
          product_id: string;
          variant_id: string | null;
          current_stock: number;
          low_stock_threshold: number | null;
          allow_negative_stock: boolean;
          track_inventory: boolean;
        };
      };
    };
    Functions: {
      create_business_with_owner: {
        Args: {
          p_name: string;
          p_legal_name?: string;
          p_tax_identifier?: string;
        };
        Returns: string;
      };
      is_business_member: {
        Args: { p_business_id: string };
        Returns: boolean;
      };
      has_business_role: {
        Args: { p_business_id: string; p_roles: BusinessRole[] };
        Returns: boolean;
      };
      get_product_stock: {
        Args: {
          p_business_id: string;
          p_product_id: string;
          p_variant_id?: string;
        };
        Returns: number;
      };
      create_stock_movement: {
        Args: {
          p_business_id: string;
          p_product_id: string;
          p_movement_type: StockMovementType;
          p_quantity: number;
          p_variant_id?: string;
          p_unit_cost?: number;
          p_reference_type?: string;
          p_reference_id?: string;
          p_notes?: string;
          p_metadata?: Json;
        };
        Returns: string;
      };
    };
    Enums: {
      business_role: BusinessRole;
      stock_movement_type: StockMovementType;
      product_status: ProductStatus;
    };
  };
}
