import type { ProductSource } from "@/application/catalog/ProductSource";

import {
  loadAllProducts as loadAllProductsFromSheets,
} from "./fetchSheets";

/**
 * Adaptador de la fuente vigente.
 *
 * Toda la lógica actual de Google Sheets permanece
 * encapsulada detrás del contrato ProductSource.
 */
export const sheetsProductSource: ProductSource = {
  loadAllProducts:
    loadAllProductsFromSheets,
};