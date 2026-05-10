# Infrastructure Frontend — Shell de Base

Ce document liste les composants d'infrastructure mis en place lors des passes de stabilisation. Il ne remplace pas `CONSTITUTION.md` ni `ARCHITECTURE.md`.

---

## Route Splitting

- `src/App.tsx` — `React.lazy` + `Suspense` pour 9 routes
- Routes chargées à la demande : SignIn, SignUp, NotFound, UserProfiles, LineChart, BarChart, Calendar, BasicTables, FormElements
- Dashboard (`Home`) conservé en import statique pour stabilité
- Fallback : `RouteLoader` avec message « Chargement… »

## Vendor Chunks

- `vite.config.ts` — `manualChunks` divisé en 4 groupes :
  - `react-vendor` : react, react-dom, react-router
  - `chart-vendor` : apexcharts, react-apexcharts
  - `calendar-vendor` : @fullcalendar/*
  - `ui-vendor` : flatpickr, react-dropzone
- Chunk principal réduit de 963 kB → 281 kB (−71 %)

## Error Boundary

- `src/components/common/AppErrorBoundary.tsx`
- Capture les erreurs de rendu dans tout l'arbre React
- Affichage français : « Une erreur est survenue », bouton « Recharger la page »
- Wrappé autour des `<Routes>` dans `App.tsx`

## Route Loader

- `src/components/common/RouteLoader.tsx`
- Spinner CSS pur (Tailwind animate-spin)
- Message « Chargement… » en français
- Mobile-safe, min-height 60vh

## PageShell

- `src/components/common/PageShell.tsx`
- Structure de page réutilisable : titre, description optionnelle, actions slot, children
- Design consistent avec le système Stripe-inspired
- Mobile-first avec breakpoints sm/lg

## ResponsiveTable

- `src/components/common/ResponsiveTable.tsx`
- Wrapper de tableau avec titre, description, état vide et état chargement
- Débordement horizontal (`overflow-x-auto`) pour mobile
- Comportement sticky-ready
- Utilise `Skeleton` en mode chargement et `EmptyState` en mode vide

## TableToolbar

- `src/components/common/TableToolbar.tsx`
- Barre de recherche avec placeholder français (« Rechercher… »)
- Slot pour filtres et actions
- Cible tactile minimale 44px
- Disposition responsive (colonne sur mobile, ligne sur desktop)

## EmptyState

- `src/components/common/EmptyState.tsx`
- État vide réutilisable avec titre, description et action optionnelle
- Props en français, rôle `status` pour accessibilité

## Skeleton

- `src/components/common/Skeleton.tsx`
- Variantes : `line`, `card`, `circle`
- Animation `animate-pulse` Tailwind
- Aucune dépendance externe

## Domain Map / App Modules

- `src/lib/domainMap.ts` — 9 domaines métier avec clé, label français, description, futurePath
- `src/lib/appModules.ts` — domaine enrichi d'une clé d'icône (`iconKey`)
- `src/lib/moduleIcons.tsx` — correspondance iconKey → composant SVG existant
- `src/lib/designTokens.ts` — constantes de design (espacement, couleurs, tactile)
- Aucun page/route créé — donnée metadata seulement

## Sidebar

- `src/layout/AppSidebar.tsx` — refactorisé pour utiliser `appModules`
- 3 sections : Plateforme, Outils, Accès
- Étiquettes 100 % françaises
- Modules futurs affichés comme désactivés (opacité réduite, pas de navigation)
- Routes existantes conservées et fonctionnelles

## Intégration Test

- `src/pages/Tables/BasicTables.tsx` — intégration réelle de PageShell + ResponsiveTable + TableToolbar
- Recherche locale (state uniquement, pas de logique métier)
- Titres et descriptions en français

---

## Prochaines étapes recommandées

1. Créer le dossier `src/features/` avec la structure modulaire
2. Implémenter les pages métier réelles (Inventaire, Caisse, Facturation…)
3. Brancher Supabase et le système d'authentification
4. Remplacer les données factices de `BasicTableOne` par des données réelles
5. Ajouter le routeur pour les nouveaux modules
