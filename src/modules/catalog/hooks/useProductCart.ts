import {
  useCallback,
  useState,
} from "react";

import { showNotification } from "@/shared/components/feedback/NotificationStack";
import type { Product } from "@/shared/types/product";
import { PRODUCT_DETAIL_CONFIG } from "@/tenant/config/product";

interface UseProductCartOptions {
  product?: Product;
  available: boolean;
  isQtyInputValid: boolean;
  parsedQtyInput: number | null;

  addToCart: (
    product: Product,
    qty: number,
  ) => boolean | void;
}

export function useProductCart({
  product,
  available,
  isQtyInputValid,
  parsedQtyInput,
  addToCart,
}: UseProductCartOptions) {
  const [
    cartOpen,
    setCartOpen,
  ] =
    useState(false);

  const handleAddToCart =
    useCallback((): boolean => {
      if (
        !product ||
        !available ||
        !isQtyInputValid ||
        parsedQtyInput ===
          null
      ) {
        return false;
      }

      const added =
        addToCart(
          product,
          parsedQtyInput,
        );

      if (
        added === false
      ) {
        showNotification(
          PRODUCT_DETAIL_CONFIG
            .notifications
            .stockLimitTitle,
          PRODUCT_DETAIL_CONFIG
            .notifications
            .stockLimitDescription,
        );

        return false;
      }

      showNotification(
        PRODUCT_DETAIL_CONFIG
          .notifications
          .addedToCartTitle,
        `${parsedQtyInput} ${
          parsedQtyInput === 1
            ? "unidad"
            : "unidades"
        } de ${product.title} ${
          parsedQtyInput === 1
            ? "se agregó"
            : "se agregaron"
        } a Mi Box.`,
        "cart",
      );

      return true;
    }, [
      product,
      available,
      isQtyInputValid,
      parsedQtyInput,
      addToCart,
    ]);

  return {
    cartOpen,
    setCartOpen,
    handleAddToCart,
  };
}
