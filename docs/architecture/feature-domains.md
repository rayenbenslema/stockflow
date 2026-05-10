# Domaines Métier — Architecture Feature

Ce document décrit l'architecture des modules métier de StockFlow Tunisia. Il ne remplace pas `CONSTITUTION.md`, `ARCHITECTURE.md`, ni la documentation fonctionnelle.

---

## Convention des dossiers

Chaque module métier suit la structure suivante :

```
src/features/<module>/
  components/    composants UI propres au module
  hooks/         hooks React spécifiques au module
  services/      appels API et logique métier
  pages/         pages du module (utilisées par le routeur)
  schemas/       schémas de validation (Zod)
  types/         types et interfaces TypeScript
  utils/         utilitaires métier
  index.ts       barrel d'export
```

---

## Modules actuels

| Dossier | Clé | Description |
|---|---|---|
| `inventory/` | `inventaire` | Produits, stocks, codes-barres, variantes |
| `pos/` | `caisse` | Point de vente, scan tactile |
| `invoicing/` | `facturation` | Cycle de vie des documents financiers |
| `clients/` | `clients` | Gestion des clients et dettes |
| `suppliers/` | `fournisseurs` | Gestion des fournisseurs et achats |
| `analytics/` | `analytics` | Rapports et indicateurs |
| `exports/` | `exports` | Export Excel, CSV, PDF |
| `settings/` | `parametres` | Configuration entreprise et utilisateurs |
| `compliance/` | `conformite` | Conformité TTN / El Fatoora |

---

## Statut actuel (Pass 7)

Seuls les squelettes de dossiers et les contrats de types sont créés.

### Ce qui existe

- Structure de dossiers vide (`.gitkeep`)
- Barrels d'export (`index.ts`)
- Contrats TypeScript pour `inventory/` et `invoicing/`
- Aucune logique métier, aucun composant UI, aucun service API

### Ce qui n'existe PAS encore (intentionnellement)

- Pages UI
- Routes
- Schémas Zod
- Services Supabase
- Données fictives
- Logique de numérotation de factures
- Connecteur de conformité
- Logique de calcul de TVA

---

## Pourquoi la facturation est « mission-critical »

Conformément à `CONSTITUTION.md` (§25), le système de facturation est **mission-critical**. Cela implique :

- **Cycle de vie immuable** — une fois validée, une facture ne peut plus être modifiée ni supprimée
- **Traçabilité complète** — toutes les mutations sont enregistrées dans `audit_logs`
- **Conformité légale** — l'adaptateur TTN / El Fatoora est obligatoire avant le lancement public
- **Corrections par avoir** — les erreurs sont corrigées via des avoirs, jamais par édition destructive
- **Snapshots fiscaux** — les taux de TVA sont figés au moment de la création

Cette architecture impose que la facturation soit développée en dernier, après que tous les prérequis (auth, base de données, RLS, services) sont en place.

---

## Ordre d'implémentation futur

1. **Contrats de domaines** (ce passe) — types TypeScript, interfaces, énumérations ← nous sommes ici
2. **Schéma de base de données** — tables Supabase PostgreSQL, index, contraintes, RLS
3. **Modèle de sécurité** — politiques RLS, isolation multi-entreprise, rôles utilisateur
4. **Services** — couche API Supabase : queries, mutations, validation Zod
5. **Pages UI** — composants, pages, routage, sidebar active
6. **Adaptateur de conformité** — connecteur TTN / El Fatoora modulaire
7. **Exportations** — Excel, CSV, PDF avec formats comptables

Aucune étape ne sera sautée. Aucune UI métier ne sera créée avant que les fondations (DB, auth, services) ne soient prêtes.
