import {
  useState,
} from "react";

import {
  AdminAppShell,
  type AdminSection,
} from "@/modules/admin/components/AdminAppShell/AdminAppShell";

import {
  AdminCatalogWorkspace,
} from "@/modules/admin/components/AdminCatalogWorkspace/AdminCatalogWorkspace";

import {
  AdminProductExplorer,
} from "@/modules/admin/components/AdminProductExplorer/AdminProductExplorer";

export default function AdminPage() {
  const [
    section,
    setSection,
  ] =
    useState<AdminSection>(
      "catalog",
    );

  return (
    <AdminAppShell
      activeSection={
        section
      }
      onSectionChange={
        setSection
      }
    >
      {
        section ===
        "catalog"
          ? (
              <AdminProductExplorer
                onPrepareCatalog={() =>
                  setSection(
                    "catalogs",
                  )
                }
              />
            )
          : (
              <AdminCatalogWorkspace
                onBackToCatalog={() =>
                  setSection(
                    "catalog",
                  )
                }
              />
            )
      }
    </AdminAppShell>
  );
}
