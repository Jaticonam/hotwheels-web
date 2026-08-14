import type {
  CartItem,
  Product,
} from "@/shared/types/product";

import { getEffectivePrice } from "@/domain/product/pricing";

export const CART_STORAGE_KEY =
  "hotwheels_cart_v1";

export const LEGACY_CART_STORAGE_KEY =
  "jung_cart";

type CartListener = () => void;

let cartState:
  | CartItem[]
  | null = null;

const listeners =
  new Set<CartListener>();

function parseStoredCart(
  rawValue: string | null,
): CartItem[] | null {
  if (!rawValue) {
    return null;
  }

  try {
    const parsed: unknown =
      JSON.parse(rawValue);

    return Array.isArray(parsed)
      ? (parsed as CartItem[])
      : null;
  }
  catch {
    return null;
  }
}

function loadCartFromStorage():
CartItem[] {
  if (
    typeof window ===
    "undefined"
  ) {
    return [];
  }

  const currentCart =
    parseStoredCart(
      window.localStorage.getItem(
        CART_STORAGE_KEY,
      ),
    );

  if (
    currentCart !== null
  ) {
    return currentCart;
  }

  const legacyCart =
    parseStoredCart(
      window.localStorage.getItem(
        LEGACY_CART_STORAGE_KEY,
      ),
    );

  if (
    legacyCart === null
  ) {
    return [];
  }

  try {
    window.localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify(
        legacyCart,
      ),
    );

    window.localStorage.removeItem(
      LEGACY_CART_STORAGE_KEY,
    );
  }
  catch {
    return legacyCart;
  }

  return legacyCart;
}

function saveCart(
  cart: CartItem[],
): void {
  if (
    typeof window ===
    "undefined"
  ) {
    return;
  }

  try {
    window.localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify(cart),
    );
  }
  catch {
    return;
  }
}

function ensureCartState():
CartItem[] {
  if (
    cartState === null
  ) {
    cartState =
      loadCartFromStorage();
  }

  return cartState;
}

function notifyCartListeners():
void {
  listeners.forEach(
    (listener) => {
      listener();
    },
  );
}

function commitCart(
  nextCart: CartItem[],
): void {
  cartState = nextCart;

  saveCart(nextCart);
  notifyCartListeners();
}

function getStockLimit(
  item: Pick<
    Product,
    "stock"
  >,
): number | null {
  if (
    item.stock === null ||
    item.stock === undefined ||
    !Number.isFinite(
      item.stock,
    )
  ) {
    return null;
  }

  return Math.max(
    0,
    Math.floor(item.stock),
  );
}

function clampQtyToStock(
  item: Pick<
    Product,
    "stock"
  >,
  qty: number,
): number {
  const safeQty =
    Math.max(
      0,
      Math.floor(qty),
    );

  const stockLimit =
    getStockLimit(item);

  if (
    stockLimit === null
  ) {
    return safeQty;
  }

  return Math.min(
    safeQty,
    stockLimit,
  );
}

export function getCartSnapshot():
CartItem[] {
  return ensureCartState();
}

export function getServerCartSnapshot():
CartItem[] {
  return [];
}

export function subscribeCart(
  listener: CartListener,
): () => void {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function syncCartFromStorage():
void {
  cartState =
    loadCartFromStorage();

  notifyCartListeners();
}

export function addProductToCart(
  product: Product,
  qty = 1,
): boolean {
  const requestedQty =
    Math.max(
      1,
      Math.floor(qty),
    );

  const currentCart =
    ensureCartState();

  const existingItem =
    currentCart.find(
      (item) =>
        item.id ===
        product.id,
    );

  if (existingItem) {
    const nextQty =
      clampQtyToStock(
        product,
        existingItem.qty +
          requestedQty,
      );

    if (
      nextQty <=
      existingItem.qty
    ) {
      return false;
    }

    commitCart(
      currentCart.map(
        (item) =>
          item.id ===
          product.id
            ? {
                ...item,
                ...product,
                qty: nextQty,
              }
            : item,
      ),
    );

    return true;
  }

  const initialQty =
    clampQtyToStock(
      product,
      requestedQty,
    );

  if (
    initialQty <= 0
  ) {
    return false;
  }

  commitCart([
    ...currentCart,
    {
      ...product,
      qty: initialQty,
    },
  ]);

  return true;
}

export function removeProductFromCart(
  id: string,
): void {
  commitCart(
    ensureCartState().filter(
      (item) =>
        item.id !== id,
    ),
  );
}

export function changeProductQty(
  id: string,
  delta: number,
): void {
  const currentCart =
    ensureCartState();

  const nextCart =
    currentCart
      .map((item) => {
        if (
          item.id !== id
        ) {
          return item;
        }

        const requestedQty =
          item.qty +
          delta;

        if (
          requestedQty <= 0
        ) {
          return null;
        }

        const nextQty =
          clampQtyToStock(
            item,
            requestedQty,
          );

        if (
          nextQty <= 0
        ) {
          return null;
        }

        return {
          ...item,
          qty: nextQty,
        };
      })
      .filter(
        (
          item,
        ): item is CartItem =>
          item !== null,
      );

  commitCart(nextCart);
}

export function setProductQty(
  id: string,
  qty: number | null,
): void {
  if (
    qty === null
  ) {
    return;
  }

  const requestedQty =
    Math.floor(qty);

  const nextCart =
    ensureCartState()
      .map((item) => {
        if (
          item.id !== id
        ) {
          return item;
        }

        if (
          requestedQty <= 0
        ) {
          return null;
        }

        const nextQty =
          clampQtyToStock(
            item,
            requestedQty,
          );

        if (
          nextQty <= 0
        ) {
          return null;
        }

        return {
          ...item,
          qty: nextQty,
        };
      })
      .filter(
        (
          item,
        ): item is CartItem =>
          item !== null,
      );

  commitCart(nextCart);
}

export function clearCartItems():
void {
  commitCart([]);
}

export function getCartTotals(
  cart: CartItem[],
) {
  const totalItems =
    cart.reduce(
      (
        total,
        item,
      ) =>
        total +
        item.qty,
      0,
    );

  const totalPrice =
    cart.reduce(
      (
        total,
        item,
      ) =>
        total +
        getEffectivePrice(
          item,
        ) *
          item.qty,
      0,
    );

  const totalOriginal =
    cart.reduce(
      (
        total,
        item,
      ) =>
        total +
        item.price *
          item.qty,
      0,
    );

  const savings =
    Math.max(
      0,
      totalOriginal -
        totalPrice,
    );

  return {
    totalItems,
    totalPrice,
    savings,
  };
}