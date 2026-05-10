# Workspace Onboarding — Création d'Entreprise

Ce document décrit le flux d'onboarding multi-entreprise mis en place lors du **Pass 11**.

---

## Flux utilisateur

```
Connexion (SignIn)
    ↓
ProtectedRoute vérifie l'authentification
    ↓
WorkspaceProvider charge les entreprises (businesses)
    ↓
┌──────────────────────────────────────────────┐
│  Aucune entreprise ? → /onboarding/business   │
│  Une ou plusieurs entreprises ? → /           │
└──────────────────────────────────────────────┘
    ↓
Page d'onboarding :
  - Nom commercial (requis)
  - Nom légal (optionnel)
  - Matricule fiscal (optionnel)
    ↓
Appel RPC create_business_with_owner()
    ↓
Redirection vers / (dashboard)
```

---

## Migration 002 — `create_business_with_owner` RPC

Fichier : `supabase/migrations/002_business_bootstrap_rpc.sql`

### Comportement

1. Vérifie que `auth.uid()` n'est pas null
2. Insère dans `public.businesses` (name, legal_name, tax_identifier, created_by, country='TN', currency='TND')
3. Insère dans `public.business_memberships` (business_id, user_id, role='owner')
4. Insère dans `public.audit_logs` (action='business.created', source='onboarding')
5. Retourne l'UUID de la nouvelle entreprise

### Sécurité

- `SECURITY DEFINER` — contourne RLS pour permettre l'insertion de la première adhésion
- `search_path = ''` — protège contre les attaques de schéma
- Exécution réservée aux utilisateurs authentifiés (`GRANT EXECUTE TO authenticated`)

---

## Frontend — WorkspaceProvider

Fichier : `src/features/settings/WorkspaceProvider.tsx`

### Responsabilités

- Charge les entreprises et adhésions après authentification
- Maintient `businesses`, `currentBusiness`, `memberships` dans son état
- Expose `refreshWorkspace()` pour les rafraîchissements manuels
- Expose `createBusiness(input)` pour la création via RPC
- **Ne bloque pas** l'authentification — fonctionne indépendamment
- Messages d'erreur en français

### Placement dans l'arbre React

```
AuthProvider
  WorkspaceProvider    ← ici
    App
      Router
        ...
```

---

## WorkspaceGuard

Fichier : `src/features/settings/components/WorkspaceGuard.tsx`

- Utilise `useWorkspace()` pour vérifier la présence d'entreprises
- Si `isLoading` → affiche `RouteLoader`
- Si `businesses.length === 0` → redirige vers `/onboarding/business`
- Si des entreprises existent → affiche les enfants (AppLayout)

---

## BusinessOnboardingPage

Fichier : `src/features/settings/pages/BusinessOnboardingPage.tsx`

### UI

- Design centré, premium Stripe-inspired, mobile-first
- Carte blanche avec ombre subtile
- 3 champs : Nom commercial (requis), Nom légal (opt.), Matricule fiscal (opt.)
- État de chargement pendant la soumission
- Messages d'erreur français
- Redirection vers `/` après succès

---

## RLS assumptions

- Le RPC `create_business_with_owner` est `SECURITY DEFINER`, donc RLS n'est pas appliqué
- Les requêtes de lecture (`getMyBusinesses`) utilisent les politiques SELECT RLS standards (membre de l'entreprise)
- Les requêtes ultérieures (mutation) utilisent les politiques INSERT/UPDATE basées sur le rôle

---

## Ce qui n'est PAS implémenté (intentionnellement)

- Invitation de membres
- Sélecteur multi-entreprise UI
- Page de gestion des rôles
- Inventaire / produits
- Facturation
- Modification des informations entreprise
- Suppression d'entreprise
