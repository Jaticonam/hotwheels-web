import type { Product } from "@/shared/types/product";

import {
  PRODUCT_CARD_CONFIG,
  isPreorderStatus,
  isPublishedStatus,
  isSoldOutStatus,
} from "@/tenant/config/product";

export interface ProductCardStockPresentation {
  label: string;
  className: string;
}

export type ProductCardPrimaryActionType =
  | "cart"
  | "whatsapp"
  | "disabled";

export interface ProductCardPrimaryAction {
  type: ProductCardPrimaryActionType;
  label: string;
}

export function getProductCardStockPresentation(
  product: Product,
): ProductCardStockPresentation {
  if (isPreorderStatus(product.status)) {
    return {
      label: "Preventa",
      className:
        "product-card-stock-preorder",
    };
  }

  if (
    isSoldOutStatus(product.status) ||
    product.stock === 0
  ) {
    return {
      label: "Agotado",
      className:
        "product-card-stock-soldout",
    };
  }

  if (
    product.stock === null ||
    product.stock === undefined
  ) {
    return {
      label: "Por confirmar",
      className:
        "product-card-stock-muted",
    };
  }

  if (product.stock === 1) {
    return {
      label: "Última unidad",
      className:
        "product-card-stock-warning",
    };
  }

  if (product.stock === 2) {
    return {
      label: "Quedan 2",
      className:
        "product-card-stock-warning",
    };
  }

  if (product.stock === 3) {
    return {
      label: "Quedan 3",
      className:
        "product-card-stock-warning",
    };
  }

  return {
    label: "Disponible",
    className:
      "product-card-stock-available",
  };
}

/**
 * Resuelve la única acción primaria de ProductCard.
 *
 * Mantiene una sola ranura de CTA:
 * - compra directa cuando el producto es vendible;
 * - WhatsApp cuando requiere consulta;
 * - disabled únicamente como fallback defensivo.
 */
export function getProductCardPrimaryAction(
  product: Product,
  canAddToCart: boolean,
): ProductCardPrimaryAction {
  if (isPreorderStatus(product.status)) {
    return {
      type: "whatsapp",
      label:
        PRODUCT_CARD_CONFIG
          .actions
          .whatsappPreorder,
    };
  }

  if (
    isSoldOutStatus(product.status) ||
    product.stock === 0
  ) {
    return {
      type: "whatsapp",
      label:
        PRODUCT_CARD_CONFIG
          .actions
          .whatsappSoldOut,
    };
  }

  if (
    isPublishedStatus(product.status) &&
    (
      product.stock === null ||
      product.stock === undefined
    )
  ) {
    return {
      type: "whatsapp",
      label:
        PRODUCT_CARD_CONFIG
          .actions
          .whatsappSoldOut,
    };
  }

  if (
    isPublishedStatus(product.status) &&
    canAddToCart
  ) {
    return {
      type: "cart",
      label:
        PRODUCT_CARD_CONFIG
          .actions
          .addToCart,
    };
  }

  if (isPublishedStatus(product.status)) {
    return {
      type: "whatsapp",
      label:
        PRODUCT_CARD_CONFIG
          .actions
          .whatsapp,
    };
  }

  return {
    type: "disabled",
    label: "No disponible",
  };
}
