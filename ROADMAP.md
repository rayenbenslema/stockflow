# StockFlow Roadmap

This document outlines the current phase, immediate priorities, and long-term product goals. It expands `CONSTITUTION.md` and does NOT override it.

---

## Current Phase

Foundation imported from admin template. Project constitution created. Source code is in audit-and-cleanup stage.

---

## Immediate Priorities

- [ ] Audit existing template structure (components, pages, routes)
- [ ] Identify reusable components to keep vs. demo pages to remove
- [ ] Create StockFlow feature folder structure (`src/features/`)
- [ ] Align design tokens with constitution (colors, fonts, spacing)
- [ ] Adapt navigation and sidebar to StockFlow modules
- [ ] Clean up demo pages, images, and unused dependencies
- [ ] Prepare Supabase client architecture
- [ ] Design production database schema
- [ ] Implement auth (Sign In / Sign Up) with Supabase
- [ ] Implement business tenancy and RLS foundations

---

## Core Product Priorities

1. **Inventory** — products, categories, barcodes, stock movements, thresholds
2. **POS** — instant touch-friendly cashier with barcode support
3. **Facturation** — full invoice lifecycle (devis, facture, avoir, bon de livraison)
4. **Clients** — client management with debt and payment history
5. **Fournisseurs** — supplier management with purchase tracking
6. **Paiements** — cash, bank, cheque, card, split and partial payments
7. **Exports** — Excel, CSV, PDF with grouped headers and formatting
8. **Analytics** — sales, inventory, margins, top products
9. **Compliance** — TTN / El Fatoora ready invoice lifecycle

---

## Compliance Priorities

- TVA engine (multiple rates, exemptions, configurable profiles)
- Invoice immutability (no editing/deleting validated invoices)
- Audit logs for all financial and stock mutations
- TTN-ready fields on invoices (ttn_reference, xml_payload, signature_hash, etc.)
- Future TEIF/XML compliance adapter
- Accountant and TTN validation before public launch
