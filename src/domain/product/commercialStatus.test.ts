import {
  describe,
  expect,
  it,
} from "vitest";

import type {
  Product,
} from "@/shared/types/product";

import {
  getProductState,
  isProductAvailable,
} from "@/domain/product";

import {
  isVisibleProductStatus,
} from "@/tenant/config/product/statuses";

function makeProduct(
  overrides: Partial<Product> = {},
): Product {
  return {
    id: "HW-STATUS-001",
    title: "Status Contract Car",
    description: "",
    category: "deportivos",
    categories: ["deportivos"],

    price: 29.9,
    offer_price: null,
    stock: 4,

    img: "",
    images: [],

    priority: 0,
    status: "Publicado",

    badges: [],
    attributes: [],

    year: 2026,
    case_code: "C",
    card_number: "1/250",
    mini_series: "Test 1/10",

    ...overrides,
  };
}

describe(
  "contrato comercial de estados",
  () => {
    it(
      "Publicado es visible y vendible con stock",
      () => {
        const product =
          makeProduct();

        expect(
          isVisibleProductStatus(
            product.status,
          ),
        ).toBe(true);

        expect(
          isProductAvailable(
            product,
          ),
        ).toBe(true);
      },
    );

    it(
      "Preventa es visible pero no vendible",
      () => {
        const product =
          makeProduct({
            status: "Preventa",
            stock: 10,
          });

        expect(
          isVisibleProductStatus(
            product.status,
          ),
        ).toBe(true);

        expect(
          isProductAvailable(
            product,
          ),
        ).toBe(false);

        expect(
          getProductState(
            product,
          ),
        ).toMatchObject({
          type: "preorder",
          label: "Preventa",
          available: false,
        });
      },
    );

    it(
      "Agotado es visible pero no vendible incluso con stock",
      () => {
        const product =
          makeProduct({
            status: "Agotado",
            stock: 4,
          });

        expect(
          isVisibleProductStatus(
            product.status,
          ),
        ).toBe(true);

        expect(
          isProductAvailable(
            product,
          ),
        ).toBe(false);
      },
    );

    it(
      "stock cero impide venta de un Publicado",
      () => {
        const product =
          makeProduct({
            stock: 0,
          });

        expect(
          isProductAvailable(
            product,
          ),
        ).toBe(false);

        expect(
          getProductState(
            product,
          ).type,
        ).toBe("sold-out");
      },
    );

    it(
      "Oculto no es visible ni vendible",
      () => {
        const product =
          makeProduct({
            status: "Oculto",
          });

        expect(
          isVisibleProductStatus(
            product.status,
          ),
        ).toBe(false);

        expect(
          isProductAvailable(
            product,
          ),
        ).toBe(false);
      },
    );

    it(
      "Borrador no es visible ni vendible",
      () => {
        const product =
          makeProduct({
            status: "Borrador",
          });

        expect(
          isVisibleProductStatus(
            product.status,
          ),
        ).toBe(false);

        expect(
          isProductAvailable(
            product,
          ),
        ).toBe(false);
      },
    );
  },
);
