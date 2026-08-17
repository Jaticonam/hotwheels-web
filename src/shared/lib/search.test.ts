import {
  describe,
  expect,
  it,
} from "vitest";

import type {
  Product,
} from "@/shared/types/product";

import {
  searchProducts,
} from "./search";

function makeProduct(
  overrides: Partial<Product>,
): Product {
  return {
    id: "HWC26047",
    title: "High-Tail Chaser",
    description: "",
    category: "coleccionables",
    categories: [
      "coleccionables",
    ],
    badges: [
      "Nuevo",
    ],
    attributes: [],
    year: 2026,
    case_code: "C",
    card_number: "47/250",
    mini_series: "HW Mods 1/5",
    ...overrides,
  } as Product;
}

const products: Product[] = [
  makeProduct({}),
  makeProduct({
    id: "HWC26050",
    title: "Bugatti Bolide",
    category: "deportivos",
    categories: [
      "deportivos",
    ],
    badges: [
      "Premium",
    ],
    card_number: "50/250",
    mini_series:
      "HW Starting Grid 4/10",
  }),
  makeProduct({
    id: "HWC26027",
    title: "Optimus Prime",
    category: "tematicos",
    categories: [
      "tematicos",
    ],
    badges: [
      "Transformers",
    ],
    year: 2025,
    case_code: "D",
    card_number: "27/250",
    mini_series:
      "HW Screen Time 2/10",
  }),
];

describe(
  "searchProducts",
  () => {
    it(
      "prioriza un ID exacto",
      () => {
        const result =
          searchProducts(
            products,
            "HWC26050",
          );

        expect(
          result[0]?.id,
        ).toBe(
          "HWC26050",
        );
      },
    );

    it(
      "busca por mini serie",
      () => {
        const result =
          searchProducts(
            products,
            "HW Mods",
          );

        expect(
          result.map(
            (product) =>
              product.id,
          ),
        ).toContain(
          "HWC26047",
        );
      },
    );

    it(
      "busca por número de tarjeta",
      () => {
        const result =
          searchProducts(
            products,
            "47/250",
          );

        expect(
          result[0]?.id,
        ).toBe(
          "HWC26047",
        );
      },
    );

    it(
      "entiende etiquetas case/caja",
      () => {
        const result =
          searchProducts(
            products,
            "case d",
          );

        expect(
          result[0]?.id,
        ).toBe(
          "HWC26027",
        );
      },
    );

    it(
      "busca por año",
      () => {
        const result =
          searchProducts(
            products,
            "2025",
          );

        expect(
          result[0]?.id,
        ).toBe(
          "HWC26027",
        );
      },
    );

    it(
      "mantiene sinónimos de categoría",
      () => {
        const result =
          searchProducts(
            products,
            "sports",
          );

        expect(
          result.map(
            (product) =>
              product.id,
          ),
        ).toContain(
          "HWC26050",
        );
      },
    );
  },
);