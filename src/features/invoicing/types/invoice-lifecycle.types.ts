export type InvoiceLifecycleStatus =
  | "draft"
  | "validated"
  | "signed"
  | "queued_for_submission"
  | "submitted"
  | "registered"
  | "rejected"
  | "cancelled"
  | "credited";

export interface InvoiceLifecycle {
  status: InvoiceLifecycleStatus;
  validatedAt?: string;
  signedAt?: string;
  submittedAt?: string;
  registeredAt?: string;
  rejectedAt?: string;
  rejectedReason?: string;
  cancelledAt?: string;
  creditedAt?: string;
  creditNoteId?: string;
}
