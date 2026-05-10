# Fondation Base de Données — SaaS Tenancy + Auth Sync + RLS

Ce document décrit la fondation Supabase/PostgreSQL mise en place lors du **Pass 10**.

---

## Tables créées

| Table | Objectif |
|---|---|
| `public.profiles` | Synchronisation du profil utilisateur depuis `auth.users` |
| `public.businesses` | Entités multi-tenant (entreprises isolées) |
| `public.business_memberships` | Liaison utilisateur ↔ entreprise avec rôle |
| `public.audit_logs` | Journal d'audit immuable pour toutes les mutations |

### profiles

- `id` UUID PK → `auth.users(id)` ON DELETE CASCADE
- `email` TEXT NOT NULL
- `full_name` TEXT
- `avatar_url` TEXT
- `created_at`, `updated_at` TIMESTAMPTZ

### businesses

- `id` UUID PK DEFAULT `gen_random_uuid()`
- `name` TEXT NOT NULL
- `legal_name`, `tax_identifier` TEXT
- `country` TEXT DEFAULT `'TN'`
- `currency` TEXT DEFAULT `'TND'`
- `created_by` UUID → `auth.users(id)`
- `created_at`, `updated_at` TIMESTAMPTZ
- `deleted_at` TIMESTAMPTZ (soft delete)

### business_memberships

- `id` UUID PK
- `business_id` UUID → `public.businesses(id)` ON DELETE CASCADE
- `user_id` UUID → `auth.users(id)` ON DELETE CASCADE
- `role` `public.business_role` (owner | manager | cashier | analyst | accountant)
- `UNIQUE(business_id, user_id)`

### audit_logs

- `id` UUID PK
- `business_id` UUID → `public.businesses(id)` ON DELETE SET NULL
- `actor_user_id` UUID → `auth.users(id)` ON DELETE SET NULL
- `action` TEXT NOT NULL
- `entity_type` TEXT NOT NULL
- `entity_id` UUID
- `metadata` JSONB DEFAULT `{}`
- `created_at` TIMESTAMPTZ

---

## Modèle RLS

### profiles

- **SELECT** : l'utilisateur voit son propre profil (`id = auth.uid()`)
- **UPDATE** : l'utilisateur modifie son propre profil

### businesses

- **SELECT** : les membres voient les entreprises auxquelles ils appartiennent (via `business_memberships`)
- **INSERT** : le créateur peut insérer (`created_by = auth.uid()`)
- **UPDATE** : seul le propriétaire et le manager peuvent modifier
- **DELETE** : pas de suppression physique — soft delete via `deleted_at` réservé au propriétaire

### business_memberships

- **SELECT** : l'utilisateur voit ses propres adhésions ; le propriétaire voit toutes les adhésions de son entreprise
- **INSERT** : le propriétaire peut ajouter des membres
- **UPDATE** : le propriétaire peut modifier les rôles
- **DELETE** : le propriétaire peut supprimer des membres
- **Évitement de récursion** : les politiques utilisent des sous-requêtes directes plutôt que des fonctions récursives

### audit_logs

- **SELECT** : les membres peuvent consulter les logs de leur entreprise
- **INSERT/UPDATE/DELETE** : pas d'accès direct — géré via des fonctions `security definer` ou Edge Functions

---

## Fonctions helper

```sql
public.is_business_member(p_business_id uuid) → boolean
public.has_business_role(p_business_id uuid, p_roles business_role[]) → boolean
```

- `STABLE`, `SECURITY DEFINER`
- `search_path = ''` (protection contre les attaques de schéma)

---

## Synchronisation du profil

Un trigger `on_auth_user_created` sur `auth.users` (AFTER INSERT) insère automatiquement une ligne dans `public.profiles` :

- `id` = `new.id`
- `email` = `new.email`
- `full_name` = `new.raw_user_meta_data ->> 'full_name'`
- `avatar_url` = `new.raw_user_meta_data ->> 'avatar_url'`

---

## Frontend — profile.service.ts

Fichier : `src/features/auth/services/profile.service.ts`

### Fonctions

- `getCurrentProfile()` → récupère le profil de l'utilisateur connecté (retourne `null` si pas de profil)
- `updateOwnProfile(input)` → met à jour `full_name` et/ou `avatar_url`

### Intégration AuthProvider

- Après chaque changement de session, `AuthProvider` appelle `refreshProfile()`
- Le profil est exposé via `AuthContext.profile`
- Les erreurs de chargement sont exposées via `AuthContext.profileError`
- Le chargement du profil **ne bloque pas** l'authentification — l'utilisateur peut se connecter même si le profil échoue
- `refreshProfile()` est exposée pour les rafraîchissements manuels

---

## Ce qui n'est PAS implémenté (intentionnellement)

- Tables d'inventaire (`products`, `product_variants`, `categories`, `stock_movements`, etc.)
- Tables de facturation (`invoices`, `invoice_items`, `quotes`, `credit_notes`, etc.)
- CRUD produit
- Interface UI de création d'entreprise
- Interface UI de gestion des membres
- Numérotation des factures
- Adaptateur de conformité TTN
- Calcul de TVA / facturation
- Données fictives / seeds
- Clé `service_role` côté frontend
