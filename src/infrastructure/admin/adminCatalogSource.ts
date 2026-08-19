import type {
  AdminCatalogSource,
} from "@/application/admin/AdminCatalogSource";

import {
  sheetsAdminCatalogSource,
} from "@/integrations/sheets/SheetsAdminCatalogSource";

/**
 * Punto único de selección de la fuente
 * administrativa.
 *
 * El reemplazo Sheets -> JUNG CORE debe ocurrir
 * aquí sin afectar modules/admin.
 */
export const adminCatalogSource:
AdminCatalogSource =
  sheetsAdminCatalogSource;
