Core Domains
Tableau de bord
Produits / Stock
POS / Caisse
Factures
Clients
Fournisseurs
Paiements
Exports
Analytics
Compliance
Settings

---

## 4. `ARCHITECTURE.md`

```md
# StockFlow Architecture

This file explains implementation structure. It does NOT override `CONSTITUTION.md`.

## Rule

Before architecture changes, read `CONSTITUTION.md`.

## Frontend

Feature-based architecture:

```txt
src/
 ├── features/
 ├── pages/
 ├── layouts/
 ├── components/
 ├── hooks/
 ├── services/
 ├── lib/
 ├── store/
 ├── types/
 ├── utils/
 └── styles/
Feature Pattern
features/inventory/
 ├── components/
 ├── hooks/
 ├── services/
 ├── pages/
 ├── schemas/
 ├── types/
 └── utils/
Backend

Supabase + PostgreSQL.

Mandatory principles:

RLS everywhere
business isolation
audit logs
immutable invoices
stock movements instead of silent stock edits
compliance adapter for TTN / El Fatoora readiness
Main Domains
auth
businesses
inventory
invoices
POS
clients
suppliers
payments
taxes
exports
compliance