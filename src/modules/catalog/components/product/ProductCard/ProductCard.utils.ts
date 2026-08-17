import type { Product } from "@/shared/types/product";

import {
  isPreorderStatus,
  isSoldOutStatus,
} from "@/tenant/config/product";

export interface ProductCardStockPresentation {
  label: string;
  className: string;
}

export function getProductCardStockPresentation(
  product: Product,
): ProductCardStockPresentation {
  if (isPreorderStatus(product.status)) {
    return {
      label: "Preventa",
      className: "product-card-stock-preorder",
    };
  }

  if (
    isSoldOutStatus(product.status) ||
    product.stock === 0
  ) {
    return {
      label: "Agotado",
      className: "product-card-stock-soldout",
    };
  }

  if (
    product.stock === null ||
    product.stock === undefined
  ) {
    return {
      label: "Por confirmar",
      className: "product-card-stock-muted",
    };
  }

  if (product.stock === 1) {
    return {
      label: "Última unidad",
      className: "product-card-stock-warning",
    };
  }

  if (product.stock === 2) {
    return {
      label: "Quedan 2",
      className: "product-card-stock-warning",
    };
  }

  if (product.stock === 3) {
    return {
      label: "Quedan 3",
      className: "product-card-stock-warning",
    };
  }

  return {
    label: "Disponible",
    className: "product-card-stock-available",
  };
}