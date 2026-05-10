import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import PageShell from "../../components/common/PageShell";
import ResponsiveTable from "../../components/common/ResponsiveTable";
import TableToolbar from "../../components/common/TableToolbar";
import BasicTableOne from "../../components/tables/BasicTables/BasicTableOne";

export default function BasicTables() {
  const [search, setSearch] = useState("");

  return (
    <>
      <PageMeta
        title="Tableaux — StockFlow Tunisia"
        description="Tableaux de données — StockFlow Tunisia"
      />
      <PageBreadcrumb pageTitle="Tableaux" />
      <PageShell
        title="Tableaux"
        description="Structure de tableau réutilisable pour les futures données métier."
      >
        <div className="space-y-4">
          <TableToolbar
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Rechercher dans le tableau…"
          />
          <ResponsiveTable
            title="Aperçu tableau"
            description="Composant conservé comme base responsive."
          >
            <BasicTableOne />
          </ResponsiveTable>
        </div>
      </PageShell>
    </>
  );
}
