import type { Product } from "@/shared/types/product";
import { isPreorderStatus, isSoldOutStatus } from "@/tenant/config/product";
import { isProductAvailable } from "@/domain/product/availability";

export type ProductStateType =
  | "available"
  | "preorder"
  | "sold-out"
  | "last-units"
  | "limited"
  | "unavailable";

/**
 * Estado comercial visual del producto.
 *
 * Regla de stock:
 * - 0: agotado.
 * - 1: última unidad.
 * - 2-3: pocas unidades.
 * - 4+: disponible.
 *
 * Centraliza etiquetas para cards, detail,
 * filtros y futuras campañas.
 */
export function getProductState(product: Product): {
  type: ProductStateType;
  label: string;
  available: boolean;
} {
  if (isPreorderStatus(product.status)) {
    return {
      type: "preorder",
      label: "Preventa",
      available: false,
    };
  }

  if (isSoldOutStatus(product.status) || product.stock === 0) {
    return {
      type: "sold-out",
      label: "Agotado",
      available: false,
    };
  }

  if (!isProductAvailable(product)) {
    return {
      type: "unavailable",
      label: "No disponible",
      available: false,
    };
  }

  if (product.stock === 1) {
    return {
      type: "last-units",
      label: "Última unidad",
      available: true,
    };
  }

  if (
    product.stock !== null &&
    product.stock <= 3
  ) {
    return {
      type: "limited",
      label: "Pocas unidades",
      available: true,
    };
  }

  return {
    type: "available",
    label: "Disponible",
    available: true,
  };
}
