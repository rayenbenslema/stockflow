import { supabase } from "../../../services/supabase";
import type {
  ProductRow,
  ProductCategoryRow,
  ProductBrandRow,
  StockMovementType,
  Json,
} from "../../../types/supabase";

export interface CreateStockMovementInput {
  businessId: string;
  productId: string;
  movementType: StockMovementType;
  quantity: number;
  variantId?: string;
  unitCost?: number;
  referenceType?: string;
  referenceId?: string;
  notes?: string;
  metadata?: Json;
}

export async function getProducts(businessId: string): Promise<ProductRow[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("business_id", businessId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getProductStock(
  businessId: string,
  productId: string,
  variantId?: string
): Promise<number> {
  const { data, error } = await supabase.rpc("get_product_stock", {
    p_business_id: businessId,
    p_product_id: productId,
    p_variant_id: variantId ?? null,
  });

  if (error) throw error;
  return (data as number) ?? 0;
}

export async function createStockMovement(
  input: CreateStockMovementInput
): Promise<string> {
  const { data, error } = await supabase.rpc("create_stock_movement", {
    p_business_id: input.businessId,
    p_product_id: input.productId,
    p_movement_type: input.movementType,
    p_quantity: input.quantity,
    p_variant_id: input.variantId ?? null,
    p_unit_cost: input.unitCost ?? null,
    p_reference_type: input.referenceType ?? null,
    p_reference_id: input.referenceId ?? null,
    p_notes: input.notes ?? null,
    p_metadata: input.metadata ?? {},
  });

  if (error) throw error;
  return data as string;
}

export async function getCategories(businessId: string): Promise<ProductCategoryRow[]> {
  const { data, error } = await supabase
    .from("product_categories")
    .select("*")
    .eq("business_id", businessId)
    .order("name");

  if (error) throw error;
  return data ?? [];
}

export async function getBrands(businessId: string): Promise<ProductBrandRow[]> {
  const { data, error } = await supabase
    .from("product_brands")
    .select("*")
    .eq("business_id", businessId)
    .order("name");

  if (error) throw error;
  return data ?? [];
}
