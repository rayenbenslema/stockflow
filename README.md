# StockFlow Tunisia

French-first production-grade SaaS for inventory management, POS/caisse, facturation, client management, supplier management, analytics, exports, and Tunisian compliance-ready invoicing.

> This document expands `CONSTITUTION.md`. It does NOT override it.

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Tailwind CSS v4 |
| UI Primitives | Custom (shadcn/ui-compatible) |
| Charts | ApexCharts |
| Calendar | FullCalendar |
| Backend | Supabase, PostgreSQL, Row Level Security |
| Mobile | PWA-first, responsive |

## Canonical Source of Truth

**`CONSTITUTION.md`** is the single source of truth. Every AI agent and developer MUST read it before modifying the project.

### Required Reading (in order)

1. `CONSTITUTION.md` — master rules
2. `ARCHITECTURE.md` — implementation structure
3. `ROADMAP.md` — current phase and priorities
4. `docs/compliance/tunisian-facturation.md` — TTN / El Fatoora readiness
5. `docs/db/erd.md` — database schema reference
6. `docs/diagrams/flows.md` — core business flows
7. `docs/exports/export-rules.md` — export format requirements
8. `docs/ux/design-system.md` — design token reference
9. `docs/api/api-contracts.md` — future API contracts

## Run Locally

```bash
npm install
npm run dev
```

## Key Principles

- **French-first UX** — all UI labels in French
- **Mobile-first** — POS works on tablets, phones, touch laptops
- **Compliance-ready** — TTN / El Fatoora adapter architecture
- **Performance** — dashboard <2s, invoice <1s, POS instant
- **Feature-based architecture** — `src/features/<module>/`
