export type StockMovementType =
  | "purchase_in"
  | "sale_out"
  | "adjustment_in"
  | "adjustment_out"
  | "transfer_in"
  | "transfer_out"
  | "return_in"
  | "return_out"
  | "initial";

export interface StockMovement {
  id: string;
  productId: string;
  variantId?: string;
  warehouseId?: string;
  movementType: StockMovementType;
  quantity: number;
  unitCost: number;
  totalCost: number;
  referenceId?: string;
  referenceType?: string;
  notes?: string;
  performedBy: string;
  businessId: string;
  createdAt: string;
}
