import type {
  Product,
} from "@/shared/types/product";

/**
 * Puerto de lectura administrativa.
 *
 * A diferencia de ProductSource, esta fuente debe
 * incluir también estados internos como:
 * - Oculto
 * - Borrador
 *
 * La UI administrativa no conoce si la fuente
 * actual es Google Sheets o JUNG CORE.
 */
export interface AdminCatalogSource {
  loadAllProducts(): Promise<Product[]>;
}
