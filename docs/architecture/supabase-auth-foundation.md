# Fondation Supabase / Auth

Ce document décrit l'architecture d'authentification et de connexion Supabase mise en place lors du Pass 8.

---

## Variables d'environnement

Fichier : `.env.example`

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

**Règles strictes :**

- Seule la clé **anonyme (publishable)** est utilisée côté frontend
- La clé `service_role` ne doit **jamais** apparaître dans le bundle frontend
- Les variables sont lues via `import.meta.env` (Vite)
- Une erreur explicite est levée si les variables sont manquantes :
  > « Configuration Supabase manquante. Vérifiez VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans .env.local »

---

## Client Supabase

Fichier : `src/services/supabase/supabaseClient.ts`

- Utilise `createClient` de `@supabase/supabase-js`
- Clé anon uniquement
- Aucune requête métier
- Exporté via `src/services/supabase/index.ts`

---

## Types base de données

Fichier : `src/types/supabase.ts`

- Exporte `Json` et une interface `Database` vide
- Sera remplacé par les types générés via `supabase gen types` après la création du schéma

---

## Provider d'authentification

Fichier : `src/features/auth/AuthProvider.tsx`

Placement dans l'arbre React (`main.tsx`) :

```
StrictMode
  ThemeProvider
    AppWrapper
      AuthProvider    ← ici
        App
          Router
            ...
```

**Responsabilités :**

- Appelle `supabase.auth.getSession()` au montage
- S'abonne à `supabase.auth.onAuthStateChange()` pour les mutations en temps réel
- Expose via contexte React : `user`, `session`, `isLoading`, `signIn`, `signUp`, `signOut`
- Ne fait **aucune** requête aux tables métier (profils, entreprises, etc.)

---

## Services Auth

Fichier : `src/features/auth/services/auth.service.ts`

- `signInWithEmail` — `supabase.auth.signInWithPassword`
- `signUpWithEmail` — `supabase.auth.signUp`
- `signOutUser` — `supabase.auth.signOut`
- `getCurrentSession` — `supabase.auth.getSession`

---

## Hook useAuth

Fichier : `src/features/auth/hooks/useAuth.ts`

- Accède au contexte `AuthContext`
- Lance une erreur si utilisé hors d'un `AuthProvider`

---

## ProtectedRoute

Fichier : `src/features/auth/components/ProtectedRoute.tsx`

- Redirige vers `/signin` si l'utilisateur n'est pas authentifié
- Affiche `RouteLoader` pendant le chargement de la session
- **N'est pas encore appliqué** aux routes de l'application (prêt à l'emploi, pas encore activé)

---

## Ce qui n'est PAS encore fait (intentionnellement)

- Requêtes aux tables métier (profils, entreprises)
- Création de schéma Supabase / migrations
- Synchronisation du profil utilisateur après connexion
- Politiques RLS
- Gestion multi-entreprise (business tenancy)
- OAuth providers (Google, X) — les boutons existent dans le template mais ne sont pas câblés
- Validation Zod des formulaires de connexion
- Branchement du `ProtectedRoute` sur les routes privées

---

## Prochaines étapes recommandées

1. Créer le schéma Supabase (auth users + tables métier)
2. Générer les types TypeScript depuis Supabase
3. Synchroniser le profil utilisateur après connexion (table `users`)
4. Implémenter la création d'entreprise (table `businesses`)
5. Appliquer `ProtectedRoute` sur les routes privées
6. Câbler les formulaires SignIn/SignUp à `useAuth`
7. Configurer OAuth (Google, X) si nécessaire
