Required Concepts
Facture
Avoir
Devis
Proforma
Bon de livraison
Facture fournisseur
Reçu de paiement
TVA
HT
TTC
Timbre fiscal if applicable
Audit logs
Immutable invoice numbers

---

## 7. `docs/db/erd.md`

```md
# Database ERD

This document expands the database rules defined in `../../CONSTITUTION.md`.

## Status

Draft.

## Core Tables

- businesses
- users
- roles
- permissions
- products
- product_variants
- categories
- subcategories
- brands
- warehouses
- stock_movements
- inventory_snapshots
- clients
- client_addresses
- suppliers
- invoices
- invoice_items
- quotes
- delivery_notes
- credit_notes
- purchases
- payments
- payment_allocations
- tax_profiles
- audit_logs
- attachments
- exports
- notifications

## Mandatory Rule

No silent stock mutation. Every stock change must create a stock movement.

No destructive invoice edit after validation. Corrections must use avoirs or correction flows.