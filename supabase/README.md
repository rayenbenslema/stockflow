# StockFlow Tunisia — Supabase

## Structure

```
supabase/
  migrations/     SQL migrations (sequential, apply in order)
  README.md       This file
```

## Apply Migrations

Use the Supabase CLI:

```bash
supabase link --project-ref <ref>
supabase db push
```

Or apply manually via the Supabase Dashboard SQL editor — run files in order.

## Rules

- Never skip migrations.
- Never edit applied migrations — create a new one.
- Every migration must be idempotent (use `IF NOT EXISTS`, `CREATE OR REPLACE`).
- Every table must have RLS enabled.
- Never use `service_role` key from frontend.
