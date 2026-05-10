export type ComplianceStatus =
  | "not_required"
  | "pending"
  | "queued"
  | "submitted"
  | "registered"
  | "rejected";

export interface ComplianceRecord {
  invoiceId: string;
  status: ComplianceStatus;
  ttnReference?: string;
  governmentReference?: string;
  qrPayload?: string;
  xmlPayload?: string;
  signatureHash?: string;
  submittedToTtnAt?: string;
  validationResponse?: string;
  rejectionReason?: string;
}
