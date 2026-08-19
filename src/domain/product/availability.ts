import type { Product } from "@/shared/types/product";

import {
  isPublishedStatus,
} from "@/tenant/config/product";

import {
  getProductPrice,
} from "@/domain/product/pricing";

/**
 * Determina si el producto puede venderse.
 *
 * Regla comercial:
 * solo un producto Publicado puede agregarse a Mi Box.
 *
 * Preventa, Agotado, Oculto, Borrador y cualquier
 * estado desconocido no son vendibles.
 */
export function isProductAvailable(
  product: Product,
): boolean {
  const price =
    getProductPrice(product);

  if (
    !isPublishedStatus(
      product.status,
    )
  ) {
    return false;
  }

  if (
    !price ||
    price <= 0
  ) {
    return false;
  }

  if (
    product.stock === null ||
    product.stock === undefined
  ) {
    return false;
  }

  if (product.stock <= 0) {
    return false;
  }

  return true;
}
