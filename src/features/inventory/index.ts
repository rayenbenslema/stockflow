export type { Product, ProductVariant, ProductCategory, ProductBrand } from "./types/product.types";
export type { StockMovement, StockMovementType } from "./types/stock-movement.types";
export {
  getProducts,
  getProductStock,
  createStockMovement,
  getCategories,
  getBrands,
} from "./services/inventory.service";
export type { CreateStockMovementInput } from "./services/inventory.service";
