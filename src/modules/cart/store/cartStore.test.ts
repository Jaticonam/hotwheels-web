import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import type {
  Product,
} from "@/shared/types/product";

import {
  addProductToCart,
  changeProductQty,
  clearCartItems,
  getCartSnapshot,
  getCartTotals,
  removeProductFromCart,
  setProductQty,
  subscribeCart,
} from "./cartStore";

function buildProduct(
  overrides: Partial<Product> = {},
): Product {
  return {
    id: "HW-001",
    title: "Modelo de prueba",
    description: "",
    category: "deportivos",
    categories: [
      "deportivos",
    ],
    price: 29.9,
    offer_price: null,
    stock: 10,
    img: "",
    images: [],
    priority: 0,
    status: "Publicado",
    badges: [],
    attributes: [],
    ...overrides,
  };
}

describe(
  "cartStore",
  () => {
    beforeEach(() => {
      localStorage.clear();
      clearCartItems();
    });

    it(
      "comparte un único snapshot",
      () => {
        const product =
          buildProduct();

        addProductToCart(
          product,
          1,
        );

        expect(
          getCartSnapshot(),
        ).toHaveLength(1);

        addProductToCart(
          product,
          2,
        );

        expect(
          getCartSnapshot()[0]
            .qty,
        ).toBe(3);
      },
    );

    it(
      "notifica cambios en la misma pestaña",
      () => {
        const listener =
          vi.fn();

        const unsubscribe =
          subscribeCart(
            listener,
          );

        addProductToCart(
          buildProduct(),
        );

        expect(
          listener,
        ).toHaveBeenCalledTimes(
          1,
        );

        unsubscribe();

        addProductToCart(
          buildProduct({
            id: "HW-002",
          }),
        );

        expect(
          listener,
        ).toHaveBeenCalledTimes(
          1,
        );
      },
    );

    it(
      "permite modificar y eliminar cantidades",
      () => {
        const product =
          buildProduct();

        addProductToCart(
          product,
          2,
        );

        changeProductQty(
          product.id,
          1,
        );

        expect(
          getCartSnapshot()[0]
            .qty,
        ).toBe(3);

        setProductQty(
          product.id,
          5,
        );

        expect(
          getCartSnapshot()[0]
            .qty,
        ).toBe(5);

        removeProductFromCart(
          product.id,
        );

        expect(
          getCartSnapshot(),
        ).toEqual([]);
      },
    );

    it(
      "calcula oferta, total y ahorro",
      () => {
        addProductToCart(
          buildProduct({
            price: 30,
            offer_price: 20,
          }),
          2,
        );

        expect(
          getCartTotals(
            getCartSnapshot(),
          ),
        ).toEqual({
          totalItems: 2,
          totalPrice: 40,
          savings: 20,
        });
      },
    );

    it(
      "no permite superar el stock al agregar",
      () => {
        const product =
          buildProduct({
            stock: 3,
          });

        expect(
          addProductToCart(
            product,
            2,
          ),
        ).toBe(true);

        expect(
          addProductToCart(
            product,
            5,
          ),
        ).toBe(true);

        expect(
          getCartSnapshot()[0]
            .qty,
        ).toBe(3);

        expect(
          addProductToCart(
            product,
            1,
          ),
        ).toBe(false);

        expect(
          getCartSnapshot()[0]
            .qty,
        ).toBe(3);
      },
    );

    it(
      "limita cambios manuales al stock",
      () => {
        const product =
          buildProduct({
            stock: 4,
          });

        addProductToCart(
          product,
          1,
        );

        setProductQty(
          product.id,
          99,
        );

        expect(
          getCartSnapshot()[0]
            .qty,
        ).toBe(4);

        changeProductQty(
          product.id,
          1,
        );

        expect(
          getCartSnapshot()[0]
            .qty,
        ).toBe(4);
      },
    );

    it(
      "rechaza productos sin stock",
      () => {
        const added =
          addProductToCart(
            buildProduct({
              stock: 0,
            }),
          );

        expect(added).toBe(
          false,
        );

        expect(
          getCartSnapshot(),
        ).toEqual([]);
      },
    );
  },
);