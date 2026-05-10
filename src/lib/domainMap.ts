export type DomainKey =
  | "tableau-de-bord"
  | "inventaire"
  | "caisse"
  | "facturation"
  | "clients"
  | "fournisseurs"
  | "analytics"
  | "exports"
  | "parametres";

export interface Domain {
  key: DomainKey;
  label: string;
  description: string;
  futurePath: string;
}

export const domainMap: Record<DomainKey, Domain> = {
  "tableau-de-bord": {
    key: "tableau-de-bord",
    label: "Tableau de bord",
    description: "Vue d'ensemble de l'activité, KPI et graphiques",
    futurePath: "/",
  },
  inventaire: {
    key: "inventaire",
    label: "Inventaire",
    description: "Gestion des produits, stocks, codes-barres et variantes",
    futurePath: "/products",
  },
  caisse: {
    key: "caisse",
    label: "Caisse",
    description: "Point de vente, scan de codes-barres et paiements",
    futurePath: "/pos",
  },
  facturation: {
    key: "facturation",
    label: "Facturation",
    description: "Création et gestion des factures, avoirs et devis",
    futurePath: "/invoices",
  },
  clients: {
    key: "clients",
    label: "Clients",
    description: "Gestion des clients, suivi des dettes et historique",
    futurePath: "/clients",
  },
  fournisseurs: {
    key: "fournisseurs",
    label: "Fournisseurs",
    description: "Gestion des fournisseurs et achats",
    futurePath: "/suppliers",
  },
  analytics: {
    key: "analytics",
    label: "Analytique",
    description: "Rapports de ventes, stocks et marges",
    futurePath: "/analytics",
  },
  exports: {
    key: "exports",
    label: "Exportations",
    description: "Export Excel, CSV et PDF des données",
    futurePath: "/exports",
  },
  parametres: {
    key: "parametres",
    label: "Paramètres",
    description: "Configuration de l'entreprise et des utilisateurs",
    futurePath: "/settings",
  },
};

export const domainKeys = Object.keys(domainMap) as DomainKey[];
export const domainList = Object.values(domainMap);
