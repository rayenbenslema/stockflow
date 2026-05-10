export interface ProductCategory {
  id: string;
  businessId: string;
  name: string;
  slug?: string;
  parentId?: string;
}

export interface ProductBrand {
  id: string;
  businessId: string;
  name: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  businessId: string;
  name: string;
  sku?: string;
  barcode?: string;
  salePriceOverride?: number;
  costPriceOverride?: number;
  attributes?: Record<string, unknown>;
}

export interface Product {
  id: string;
  businessId: string;
  categoryId?: string;
  brandId?: string;
  name: string;
  slug?: string;
  sku?: string;
  barcode?: string;
  description?: string;
  imageUrl?: string;
  costPrice: number;
  salePrice: number;
  taxRate: number;
  status: "active" | "archived" | "draft";
  trackInventory: boolean;
  lowStockThreshold?: number;
  allowNegativeStock: boolean;
  hasVariants: boolean;
  metadata?: Record<string, unknown>;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}
