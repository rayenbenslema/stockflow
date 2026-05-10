# StockFlow Architecture

This document explains the implementation structure. It expands `CONSTITUTION.md` and does NOT override it.

> Before architecture changes, read `CONSTITUTION.md`.

---

## Frontend Architecture

Feature-based architecture with shared UI primitives:

```
src/
 ├── features/          feature modules (inventory, pos, invoices, etc.)
 ├── pages/             route-level page compositions
 ├── layouts/           app layouts (AppLayout, AuthLayout, POSLayout)
 ├── components/        shared reusable UI primitives (ui/, form/, common/)
 ├── hooks/             shared hooks
 ├── services/          API service layer (Supabase client, etc.)
 ├── lib/               utilities (cn(), constants, formatters)
 ├── store/             global state (auth, business)
 ├── types/             shared TypeScript types
 ├── utils/             pure utility functions (TVA calc, export helpers)
 └── styles/            global styles
```

### Feature Module Pattern

Each feature is self-contained:

```
features/inventory/
 ├── components/        feature-specific components
 ├── hooks/             feature-specific hooks
 ├── services/          feature-specific API calls
 ├── pages/             feature-specific pages
 ├── schemas/           Zod validation schemas
 ├── types/             feature-specific types
 └── utils/             feature-specific utilities
```

---

## Core Domains

| Module | Route | Description |
|---|---|---|
| Tableau de bord | `/` | Dashboard with KPIs, charts, recent activity |
| Produits / Stock | `/products` | Inventory management, barcodes, variants |
| POS / Caisse | `/pos` | Point of sale, barcode scanner, touch interface |
| Factures | `/invoices` | Invoicing lifecycle, compliance adapter |
| Clients | `/clients` | Client management, debt tracking |
| Fournisseurs | `/suppliers` | Supplier management, purchases |
| Paiements | `/payments` | Payment tracking, split/partial payments |
| Exports | `/exports` | Excel, CSV, PDF exports |
| Analytics | `/analytics` | Sales, inventory, margin analytics |
| Compliance | `/compliance` | TTN / El Fatoora compliance layer |
| Paramètres | `/settings` | Business settings, user roles |

---

## Backend Architecture

Supabase + PostgreSQL with mandatory principles:

- **RLS everywhere** — every table has Row Level Security
- **Business isolation** — cross-business access is forbidden
- **Audit logs** — all mutations logged immutably
- **Immutable invoices** — validated invoices cannot be edited or deleted
- **Stock movements** — no silent stock edits, every mutation tracked
- **Compliance adapter** — modular TTN / El Fatoora connector

### Main Backend Domains

- auth
- businesses
- inventory
- invoices
- POS
- clients
- suppliers
- payments
- taxes
- exports
- compliance
