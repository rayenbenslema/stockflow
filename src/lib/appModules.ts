import type { DomainKey, Domain } from "./domainMap";

export interface AppModule extends Domain {
  iconKey: string;
}

export const appModules: AppModule[] = [
  {
    key: "tableau-de-bord",
    label: "Tableau de bord",
    description: "Vue d'ensemble de l'activité, KPI et graphiques",
    futurePath: "/",
    iconKey: "dashboard",
  },
  {
    key: "inventaire",
    label: "Inventaire",
    description: "Gestion des produits, stocks, codes-barres et variantes",
    futurePath: "/products",
    iconKey: "inventory",
  },
  {
    key: "caisse",
    label: "Caisse",
    description: "Point de vente, scan de codes-barres et paiements",
    futurePath: "/pos",
    iconKey: "pos",
  },
  {
    key: "facturation",
    label: "Facturation",
    description: "Création et gestion des factures, avoirs et devis",
    futurePath: "/invoices",
    iconKey: "invoice",
  },
  {
    key: "clients",
    label: "Clients",
    description: "Gestion des clients, suivi des dettes et historique",
    futurePath: "/clients",
    iconKey: "clients",
  },
  {
    key: "fournisseurs",
    label: "Fournisseurs",
    description: "Gestion des fournisseurs et achats",
    futurePath: "/suppliers",
    iconKey: "suppliers",
  },
  {
    key: "analytics",
    label: "Analytique",
    description: "Rapports de ventes, stocks et marges",
    futurePath: "/analytics",
    iconKey: "analytics",
  },
  {
    key: "exports",
    label: "Exportations",
    description: "Export Excel, CSV et PDF des données",
    futurePath: "/exports",
    iconKey: "exports",
  },
  {
    key: "parametres",
    label: "Paramètres",
    description: "Configuration de l'entreprise et des utilisateurs",
    futurePath: "/settings",
    iconKey: "settings",
  },
];

export const appModuleKeys = appModules.map((m) => m.key);
export const appModuleMap = Object.fromEntries(
  appModules.map((m) => [m.key, m]),
) as Record<DomainKey, AppModule>;
