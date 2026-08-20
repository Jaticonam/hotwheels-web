/**
 * Compatibilidad del módulo Catálogo.
 *
 * La regla comercial vive ahora en domain/product
 * para poder ser utilizada por Catálogo, Carrito,
 * Cotizaciones y futuras aplicaciones sin duplicación.
 */
export {
  clampProductQuantity,
  getProductQuantityLimit,
  isProductQuantityValid,
} from "@/domain/product/quantity";
