# Flux d'Authentification

Ce document décrit le cycle de vie de l'authentification Supabase dans StockFlow Tunisia.

---

## Architecture

```
main.tsx
  AuthProvider          ← écoute les événements Supabase Auth
    App.tsx
      Router
        PublicRoute     ← redirige les utilisateurs connectés hors des pages publiques
          /signin
          /signup
        ProtectedRoute ← redirige les utilisateurs non connectés vers /signin
          AppLayout
            / (dashboard)
            /profile
            /calendar
            /form-elements
            /basic-tables
            /line-chart
            /bar-chart
```

## Cycle de vie

### Initialisation

1. `AuthProvider` se monte et appelle `supabase.auth.getSession()`
2. Pendant l'initialisation, `isLoading = true`
3. `ProtectedRoute` et `PublicRoute` affichent `RouteLoader` pendant le chargement
4. Une fois la session récupérée, `isLoading = false`

### Connexion (SignIn)

1. L'utilisateur saisit email + mot de passe
2. `SignInForm` appelle `useAuth().signIn(email, password)`
3. `AuthProvider` appelle `supabase.auth.signInWithPassword()`
4. En cas d'erreur : message français affiché dans une alerte rouge
5. En cas de succès : `AuthProvider` met à jour `user` et `session` via le listener `onAuthStateChange`
6. L'utilisateur est redirigé vers `/`

### Inscription (SignUp)

1. L'utilisateur saisit email, mot de passe, confirmation
2. Validation côté client (email requis, mot de passe >= 6 caractères, confirmation identique)
3. `SignUpForm` appelle `useAuth().signUp(email, password)`
4. `AuthProvider` appelle `supabase.auth.signUp()`
5. En cas d'erreur : message français affiché
6. En cas de succès : message « Vérifiez votre email pour confirmer votre compte. »
7. **Aucune connexion automatique** — l'utilisateur doit confirmer son email

### Déconnexion (SignOut)

1. L'utilisateur clique sur « Se déconnecter » dans le menu utilisateur (header)
2. `UserDropdown` appelle `useAuth().signOut()`
3. `AuthProvider` appelle `supabase.auth.signOut()`
4. L'utilisateur est redirigé vers `/signin`

### Persistance de session

- Gérée nativement par Supabase via `@supabase/supabase-js`
- Le rafraîchissement du navigateur conserve la session
- `AuthProvider` restaure la session via `getSession()` au montage
- Les changements d'état sont propagés via `onAuthStateChange`
- Aucune persistence localStorage personnalisée

## Routes

### Routes publiques (non connecté)

| Route | Composant | Redirection si connecté |
|---|---|---|
| `/signin` | `SignIn` | → `/` |
| `/signup` | `SignUp` | → `/` |

### Routes protégées (connecté requis)

| Route | Composant | Redirection si non connecté |
|---|---|---|
| `/` | Dashboard | → `/signin` |
| `/profile` | UserProfiles | → `/signin` |
| `/calendar` | Calendar | → `/signin` |
| `/form-elements` | FormElements | → `/signin` |
| `/basic-tables` | BasicTables | → `/signin` |
| `/line-chart` | LineChart | → `/signin` |
| `/bar-chart` | BarChart | → `/signin` |

## Ce qui n'existe PAS encore

- Profil utilisateur (table `users`)
- Entreprise / business tenancy (table `businesses`)
- RBAC / gestion des rôles
- Multi-tenant RLS
- OAuth (Google, X)
- Lien « Mot de passe oublié » (non câblé)
- Validation Zod des formulaires
- Synchronisation du profil après connexion

## Prochaines étapes

1. Créer les tables Supabase : `users`, `businesses`, `roles`
2. Synchroniser le profil utilisateur après connexion / inscription
3. Appliquer les politiques RLS
4. Ajouter la sélection d'entreprise après connexion
5. Câbler la réinitialisation de mot de passe
6. Ajouter OAuth (Google) si nécessaire
