import {
  describe,
  expect,
  it,
} from "vitest";

import type {
  Product,
} from "@/shared/types/product";

import {
  productBelongsToCategory,
} from "./categories";

function createProduct(
  overrides:
    Partial<Product> = {},
): Product {
  return {
    id: "HW-NAV-001",
    title: "Nissan Skyline",
    description: "",

    category: "mainline",
    categories: [
      "mainline",
    ],

    price: 20,
    offer_price: null,
    stock: 1,

    img: "",
    images: [],

    priority: 0,
    status: "Publicado",

    badges: [],
    attributes: [],

    explore_tags: [
      "jdm",
    ],

    ...overrides,
  };
}

describe(
  "productBelongsToCategory",
  () => {
    it("resuelve la categoría canónica desde categories", () => {
      const product =
        createProduct();

      expect(
        productBelongsToCategory(
          product,
          "mainline",
        ),
      ).toBe(true);
    });

    it("mantiene navegación legacy desde explore_tags", () => {
      const product =
        createProduct({
          explore_tags: [
            "deportivos",
          ],
        });

      expect(
        productBelongsToCategory(
          product,
          "deportivos",
        ),
      ).toBe(true);

      expect(
        productBelongsToCategory(
          product,
          "clasicos",
        ),
      ).toBe(false);
    });

    it("mantiene compatibilidad con productos legacy aún no migrados", () => {
      const product =
        createProduct({
          category:
            "clasicos",

          categories: [
            "clasicos",
          ],

          explore_tags: [],
        });

      expect(
        productBelongsToCategory(
          product,
          "clasicos",
        ),
      ).toBe(true);
    });

    it("no trata x-caja u ofertas como explore tags", () => {
      const product =
        createProduct({
          explore_tags: [
            "jdm",
          ],
        });

      expect(
        productBelongsToCategory(
          product,
          "x-caja",
        ),
      ).toBe(false);

      expect(
        productBelongsToCategory(
          product,
          "ofertas",
        ),
      ).toBe(false);
    });

    it("mantiene todas como selector global", () => {
      expect(
        productBelongsToCategory(
          createProduct(),
          "todas",
        ),
      ).toBe(true);
    });
  },
);
