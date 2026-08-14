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
      label: "Stock por confirmar",
      className: "product-card-stock-muted",
    };
  }

  if (product.stock <= 3) {
    return {
      label:
        product.stock === 1
          ? "1 unidad disponible"
          : `${product.stock} unidades disponibles`,
      className: "product-card-stock-warning",
    };
  }

  return {
    label: `Stock: ${product.stock}`,
    className: "product-card-stock-available",
  };
}