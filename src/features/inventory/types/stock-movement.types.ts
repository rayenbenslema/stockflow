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

export interface StockMovement {
  id: string;
  businessId: string;
  productId: string;
  variantId?: string;
  movementType: StockMovementType;
  quantity: number;
  unitCost?: number;
  referenceType?: string;
  referenceId?: string;
  notes?: string;
  metadata?: Record<string, unknown>;
  createdBy?: string;
  createdAt: string;
}
