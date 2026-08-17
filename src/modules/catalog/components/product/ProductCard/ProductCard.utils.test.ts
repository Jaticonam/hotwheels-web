import {
  describe,
  expect,
  it,
} from "vitest";

import type { Product } from "@/shared/types/product";

import {
  getProductCardStockPresentation,
} from "./ProductCard.utils";

function buildProduct(
  overrides: Partial<Product> = {},
): Product {
  return {
    id: "HW-001",
    title: "Modelo de prueba",
    description: "",
    category: "deportivos",
    categories: ["deportivos"],
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
  "ProductCard stock presentation",
  () => {
    it(
      "muestra stock disponible",
      () => {
        expect(
          getProductCardStockPresentation(
            buildProduct({
              stock: 8,
            }),
          ).label,
        ).toBe("Disponible");
      },
    );

    it(
      "detecta últimas unidades",
      () => {
        expect(
          getProductCardStockPresentation(
            buildProduct({
              stock: 2,
            }),
          ),
        ).toEqual({
          label:
            "Quedan 2",
          className:
            "product-card-stock-warning",
        });
      },
    );

    it(
      "prioriza preventa",
      () => {
        expect(
          getProductCardStockPresentation(
            buildProduct({
              status: "Preventa",
              stock: 0,
            }),
          ).label,
        ).toBe("Preventa");
      },
    );

    it(
      "detecta agotado",
      () => {
        expect(
          getProductCardStockPresentation(
            buildProduct({
              status: "Agotado",
              stock: 5,
            }),
          ).label,
        ).toBe("Agotado");
      },
    );

    it(
      "maneja stock no informado",
      () => {
        expect(
          getProductCardStockPresentation(
            buildProduct({
              stock: null,
            }),
          ).label,
        ).toBe(
          "Por confirmar",
        );
      },
    );
  },
);