import type { Product } from "@/shared/types/product";

/**
 * Puerto de lectura del catálogo.
 *
 * Los consumidores no conocen si los datos provienen
 * de Google Sheets, JUNG CORE u otra fuente futura.
 */
export interface ProductSource {
  loadAllProducts(): Promise<Product[]>;
}