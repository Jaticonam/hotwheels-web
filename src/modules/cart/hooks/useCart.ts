import {
  useCallback,
  useEffect,
  useSyncExternalStore,
} from "react";

import type {
  Product,
} from "@/shared/types/product";

import {
  CART_STORAGE_KEY,
  LEGACY_CART_STORAGE_KEY,
  addProductToCart,
  changeProductQty,
  clearCartItems,
  getCartSnapshot,
  getCartTotals,
  getServerCartSnapshot,
  removeProductFromCart,
  setProductQty,
  subscribeCart,
  syncCartFromStorage,
} from "@/modules/cart/store/cartStore";

export function useCart() {
  const cart =
    useSyncExternalStore(
      subscribeCart,
      getCartSnapshot,
      getServerCartSnapshot,
    );

  useEffect(() => {
    const handleStorage =
      (
        event: StorageEvent,
      ) => {
        const isCartEvent =
          event.key ===
            CART_STORAGE_KEY ||
          event.key ===
            LEGACY_CART_STORAGE_KEY;

        if (!isCartEvent) {
          return;
        }

        syncCartFromStorage();
      };

    window.addEventListener(
      "storage",
      handleStorage,
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorage,
      );
    };
  }, []);

  const addToCart =
    useCallback(
      (
        product: Product,
        qty = 1,
      ) => {
        return addProductToCart(
          product,
          qty,
        );
      },
      [],
    );

  const removeFromCart =
    useCallback(
      (id: string) => {
        removeProductFromCart(
          id,
        );
      },
      [],
    );

  const changeQty =
    useCallback(
      (
        id: string,
        delta: number,
      ) => {
        changeProductQty(
          id,
          delta,
        );
      },
      [],
    );

  const setExactQty =
    useCallback(
      (
        id: string,
        qty: number | null,
      ) => {
        setProductQty(
          id,
          qty,
        );
      },
      [],
    );

  const clearCart =
    useCallback(() => {
      clearCartItems();
    }, []);

  const {
    totalItems,
    totalPrice,
    savings,
  } =
    getCartTotals(cart);

  return {
    cart,

    addToCart,
    removeFromCart,
    changeQty,
    setExactQty,
    clearCart,

    totalItems,
    totalPrice,
    savings,
  };
}