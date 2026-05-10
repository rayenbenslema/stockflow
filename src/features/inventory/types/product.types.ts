export interface ProductCategory {
  id: string;
  businessId: string;
  name: string;
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
  sku: string;
  barcode?: string;
  label: string;
  costPrice: number;
  salePrice: number;
  stock: number;
  thresholdAlert: number;
  imageUrl?: string;
}

export interface Product {
  id: string;
  businessId: string;
  name: string;
  sku: string;
  barcode?: string;
  categoryId?: string;
  subcategoryId?: string;
  brandId?: string;
  costPrice: number;
  salePrice: number;
  marginPercent: number;
  tvaRate: number;
  thresholdAlert: number;
  imageUrls: string[];
  variants: ProductVariant[];
  supplierId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
