import type { ProductSource } from "@/application/catalog/ProductSource";

import { sheetsProductSource } from "@/integrations/sheets/SheetsProductSource";

/**
 * Punto único de selección de la fuente de productos.
 *
 * Actualmente:
 *   SheetsProductSource
 *
 * Futuro:
 *   JungCoreProductSource
 *
 * El cambio de backend debe realizarse aquí sin que
 * modules/catalog conozca la implementación concreta.
 */
export const productSource: ProductSource =
  sheetsProductSource;