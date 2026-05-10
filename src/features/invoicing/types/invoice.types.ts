export type InvoiceDocumentType =
  | "facture"
  | "avoir"
  | "devis"
  | "proforma"
  | "bon_livraison"
  | "facture_fournisseur"
  | "recu_paiement";

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPriceHt: number;
  tvaRate: number;
  discountPercent: number;
  discountAmount: number;
  totalHt: number;
  totalTtc: number;
}

export interface Invoice {
  id: string;
  businessId: string;
  documentType: InvoiceDocumentType;
  number: string;
  clientId: string;
  supplierId?: string;
  issueDate: string;
  dueDate: string;
  status: string;
  items: InvoiceItem[];
  subtotalHt: number;
  totalTva: number;
  totalTtc: number;
  discountGlobal: number;
  rounding: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
