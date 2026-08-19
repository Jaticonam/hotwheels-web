import type {
  AdminCatalogSource,
} from "@/application/admin/AdminCatalogSource";

import {
  loadAllProductsForAdmin,
} from "./fetchSheets";

/**
 * Adaptador administrativo vigente.
 *
 * Hoy:
 *   Google Sheets
 *
 * Futuro:
 *   JungCoreAdminCatalogSource
 */
export const sheetsAdminCatalogSource:
AdminCatalogSource = {
  loadAllProducts:
    loadAllProductsForAdmin,
};
