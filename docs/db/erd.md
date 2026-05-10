# Database Schema (ERD)

This document expands the database rules defined in `../../CONSTITUTION.md` (§21-24). It does NOT override the constitution.

> **Status:** Draft. Schema must be implemented as Supabase PostgreSQL with RLS.

---

## Core Tables

### Businesses & Users

| Table | Purpose |
|---|---|
| `businesses` | Tenant businesses (isolated workspaces) |
| `users` | Platform users (belong to a business) |
| `roles` | Role definitions (owner, manager, cashier, analyst, accountant) |
| `permissions` | Role-permission mappings |

### Products & Inventory

| Table | Purpose |
|---|---|
| `products` | Core product catalog (barcode, SKU, name, prices, taxes, thresholds) |
| `product_variants` | Variant support (size, color, etc.) |
| `categories` | Product categories |
| `subcategories` | Product subcategories |
| `brands` | Product brands |
| `warehouses` | Warehouse/location support |
| `stock_movements` | Immutable stock change log (every mutation tracked) |
| `inventory_snapshots` | Periodic inventory counts |

### Clients & Suppliers

| Table | Purpose |
|---|---|
| `clients` | Customer records (debt tracking, tags, notes) |
| `client_addresses` | Multiple addresses per client |
| `suppliers` | Supplier records (purchase history, debt) |

### Invoicing & Financial

| Table | Purpose |
|---|---|
| `invoices` | Core invoice record (type: facture, avoir, devis, proforma, bon_livraison) |
| `invoice_items` | Line items per invoice |
| `quotes` | Devis (quotes) |
| `delivery_notes` | Bons de livraison |
| `credit_notes` | Avoirs |
| `purchases` | Supplier purchases |
| `payments` | Payment records (cash, bank, cheque, card) |
| `payment_allocations` | Split/partial payment allocations |
| `tax_profiles` | Configurable TVA rates and exemptions |

### Compliance

TTN-ready fields on invoices:

- `ttn_reference`
- `government_reference`
- `qr_payload`
- `xml_payload`
- `compliance_status` (not_required, pending, queued, submitted, registered, rejected)
- `signature_hash`
- `submitted_to_ttn_at`
- `validation_response`
- `rejection_reason`

### System

| Table | Purpose |
|---|---|
| `audit_logs` | Immutable audit trail for all mutations |
| `attachments` | File storage references (images, PDFs, exports) |
| `exports` | Export job tracking |
| `notifications` | In-app notifications (alerts, reminders) |

---

## Mandatory Principles

- **Normalization** — avoid data redundancy
- **Foreign keys** — enforce referential integrity
- **Indexes** — on all FK columns, search columns (barcode, SKU), and date ranges
- **Auditability** — all mutations logged via audit_logs
- **Soft deletion** — where required (products, clients, suppliers)
- **Immutable financial records** — validated invoices cannot be edited or deleted
