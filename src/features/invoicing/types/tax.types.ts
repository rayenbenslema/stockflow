export interface TaxRate {
  id: string;
  label: string;
  rate: number;
  isDefault: boolean;
}

export interface TaxProfile {
  id: string;
  businessId: string;
  name: string;
  rates: TaxRate[];
  isActive: boolean;
  validFrom: string;
  validTo?: string;
}

export interface TaxSummary {
  totalHt: number;
  tvaBreakdown: Array<{ rate: number; base: number; amount: number }>;
  totalTva: number;
  totalTtc: number;
  discountAmount: number;
  rounding: number;
}
