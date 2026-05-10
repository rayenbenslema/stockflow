# Moteur d'Inventaire — Architecture Immutable

Ce document décrit le moteur d'inventaire mis en place lors du **Pass 12**.

---

## Philosophie : Stock dérivé, pas stock stocké

**Principe fondamental :** Il n'existe pas de colonne `current_stock` dans la base de données. Le stock est **toujours calculé** par agrégation des mouvements (`stock_movements`).

### Pourquoi ?

- **Immuabilité** : chaque mouvement est une ligne immuable. Pas de mise à jour destructive.
- **Traçabilité** : historique complet de chaque variation de stock.
- **Audit** : chaque mouvement a un `created_by`, un `movement_type`, et une référence.
- **Conformité** : les mouvements financiers (ventes, achats) sont liés aux factures via `reference_id`.
- **Correction** : on n'édite jamais un mouvement — on crée un mouvement compensatoire.

### Contre-exemples (interdits)

- `UPDATE produits SET stock = stock - 1` — interdit
- `UPDATE stock_movements SET quantity = 5` — interdit
- Colonne `current_stock` dans `products` — n'existe pas

---

## Tables créées

| Table | Rôle |
|---|---|
| `product_categories` | Catégories hiérarchiques (auto-référence `parent_id`) |
| `product_brands` | Marques / fournisseurs |
| `products` | Catalogue produits (SKU, code-barres, prix, TVA, seuils) |
| `product_variants` | Variantes (taille, couleur, etc.) avec prix spécifiques |
| `stock_movements` | Grand livre des mouvements — **immuable** |

### stock_movements (le cœur du système)

- `movement_type` enum : `initial`, `purchase`, `sale`, `adjustment`, `return_customer`, `return_supplier`, `transfer_in`, `transfer_out`, `damaged`, `expired`
- `quantity` : positif = entrée, négatif = sortie
- `reference_type` / `reference_id` : lien vers facture, commande, etc.
- `metadata` JSONB : données contextuelles (ex: POS session, invoice line)

**Politiques RLS :** SELECT uniquement. Pas d'INSERT/UPDATE/DELETE direct. Toute mutation passe par le RPC `create_stock_movement()`.

---

## Vue : inventory_stock_levels

```sql
create or replace view public.inventory_stock_levels as
select
  p.business_id,
  p.id as product_id,
  mv.variant_id,
  coalesce(sum(mv.quantity), 0) as current_stock,
  p.low_stock_threshold,
  p.allow_negative_stock,
  p.track_inventory
from public.products p
left join public.stock_movements mv on mv.product_id = p.id
where p.deleted_at is null
group by p.business_id, p.id, mv.variant_id, ...;
```

Lecture seule. Utilisée par le tableau de bord et les alertes de stock.

---

## RPC : create_stock_movement()

**RPC de mutation unique** pour toute opération de stock.

Comportement :
1. Vérifie `auth.uid()` — appelant doit être connecté
2. Vérifie l'appartenance à l'entreprise (`is_business_member`)
3. Vérifie que le produit existe dans l'entreprise
4. Pour les sorties (quantity < 0) : vérifie `allow_negative_stock`
   - Si désactivé et stock insuffisant → erreur explicite
5. Insère la ligne immuable dans `stock_movements`
6. Insère une entrée dans `audit_logs` (action : `inventory.stock_movement.created`)
7. Retourne l'UUID du mouvement

```sql
select create_stock_movement(
  p_business_id := '...',
  p_product_id  := '...',
  p_movement_type := 'purchase',
  p_quantity    := 50,
  p_unit_cost   := 12.500
);
```

---

## RPC : get_product_stock()

Fonction de lecture rapide pour obtenir le stock actuel d'un produit/variante.

```sql
select get_product_stock('business_id', 'product_id', 'variant_id[optionnel]');
```

---

## Architecture des variantes

- `has_variants` sur `products` : true si le produit a des variantes
- Les variantes ont leurs propres SKU, code-barres, et prix (override)
- Les attributs sont stockés en JSONB (ex: `{"couleur": "rouge", "taille": "M"}`)
- Les mouvements de stock peuvent cibler une variante spécifique (`variant_id`)
- Le stock d'un produit sans variante = somme des mouvements où `variant_id IS NULL`
- Le stock d'un produit avec variantes = somme par variante

---

## Modèle RLS

Toutes les tables d'inventaire utilisent les helpers `is_business_member()` et `has_business_role()` (SECURITY DEFINER) pour éviter la récursion RLS.

| Table | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|
| `product_categories` | Membres | Owner/Manager | Owner/Manager | Owner/Manager |
| `product_brands` | Membres | Owner/Manager | Owner/Manager | Owner/Manager |
| `products` | Membres | Owner/Manager/Cashier/Accountant | Owner/Manager | Soft delete (Owner/Manager) |
| `product_variants` | Membres | Owner/Manager/Cashier/Accountant | Owner/Manager | Owner/Manager |
| `stock_movements` | Membres | ❌ (via RPC) | ❌ immuable | ❌ immuable |

---

## Compatibilité POS

- `allow_negative_stock` : permet les ventes même si stock insuffisant (dépannage)
- `low_stock_threshold` : seuil d'alerte pour le réapprovisionnement
- `track_inventory` : permet de désactiver le suivi pour certains produits
- SKU/code-barres indexés : recherche rapide au scan
- `create_stock_movement` RPC : appelable depuis le POS pour enregistrer les ventes

---

## Intégration future avec la facturation

- Les lignes de facture référenceront `product_id` et `variant_id`
- Les mouvements de type `sale` seront liés à la facture via `reference_id`
- `unit_cost` permet de calculer le coût des marchandises vendues (CMV)
- TVA figée au niveau du produit (`tax_rate`) pour les snapshots fiscaux

---

## Support entrepôt futur

- Le champ `warehouse_id` n'est pas encore dans `stock_movements`
- Il sera ajouté via une migration ultérieure quand le module entrepôt sera implémenté
- La vue `inventory_stock_levels` devra être mise à jour pour grouper par entrepôt

---

## Considérations offline

- Chaque mouvement a un UUID côté client (peut être généré avant la sync)
- `created_at` peut être défini par le client pour préserver la chronologie
- Le RPC `create_stock_movement` pourrait être appelé en mode différé (queue de sync)
- `metadata` peut contenir un `client_id` pour déduplication

---

## Ce qui n'est PAS implémenté (intentionnellement)

- Pages UI / CRUD produits
- Interface de création de catégories / marques
- POS / caisse
- Facturation / lignes de facture
- Mouvements liés aux factures
- Alertes de stock bas
- Import/export CSV
- Gestion des entrepôts
- Snapshots d'inventaire (comptages physiques)
- Prix d'achat moyen pondéré (PAMP)
- Valorisation de stock
- Code-barres scanning UI
