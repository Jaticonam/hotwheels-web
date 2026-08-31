import {
  describe,
  expect,
  it,
} from "vitest";

import type {
  Product,
} from "@/shared/types/product";

import {
  hasCompleteHotWheelsTaxonomy,
  resolveHotWheelsTaxonomy,
} from "./TaxonomyResolver";

function createProduct(
  overrides:
    Partial<Product> = {},
): Product {
  return {
    id: "HW-001",
    title: "Hot Wheels Test",
    description: "",

    category: "premium",
    categories: ["premium"],

    price: 59.9,
    offer_price: null,

    stock: 1,

    img: "/hw-001.jpg",
    images: [],

    priority: 0,
    status: "Publicado",

    badges: [],
    attributes: [],

    format: "single",

    ...overrides,
  };
}

describe(
  "Hot Wheels Taxonomy Resolver 1.0",
  () => {
    it("certifica una taxonomía canónica completa", () => {
      const result =
        resolveHotWheelsTaxonomy(
          createProduct({
            category:
              "premium",

            format:
              "single",

            series:
              "Car Culture",

            collection:
              "Modern Classics",

            set_number:
              "3/5",

            rarity:
              "chase",

            manufacturer:
              "Porsche",

            style:
              "euro",

            exclusivity:
              "retailer-exclusive",
          }),
        );

      expect(result.status)
        .toBe("complete");

      expect(result.issues)
        .toEqual([]);

      expect(result.taxonomy)
        .toEqual({
          category:
            "premium",

          format:
            "single",

          rarity:
            "chase",

          series:
            "Car Culture",

          collection:
            "Modern Classics",

          set_number:
            "3/5",

          manufacturer:
            "Porsche",

          style:
            "euro",

          exclusivity:
            "retailer-exclusive",
        });
    });

    it("marca categoría legacy como incompleta sin inventar migración", () => {
      const result =
        resolveHotWheelsTaxonomy(
          createProduct({
            category:
              "clasicos",

            categories: [
              "clasicos",
            ],
          }),
        );

      expect(result.status)
        .toBe("incomplete");

      expect(result.taxonomy)
        .toBeNull();

      expect(result.issues)
        .toEqual([
          {
            code:
              "non-canonical-category",

            field:
              "category",

            value:
              "clasicos",
          },
        ]);
    });

    it("rechaza todas como categoría canónica", () => {
      const result =
        resolveHotWheelsTaxonomy(
          createProduct({
            category:
              "todas",

            categories: [],
          }),
        );

      expect(result.status)
        .toBe("incomplete");

      expect(
        result.issues[0],
      ).toEqual({
        code:
          "non-canonical-category",

        field:
          "category",

        value:
          "todas",
      });
    });

    it("marca formato faltante como incompleto", () => {
      const result =
        resolveHotWheelsTaxonomy(
          createProduct({
            format: "",
          }),
        );

      expect(result.status)
        .toBe("incomplete");

      expect(result.taxonomy)
        .toBeNull();

      expect(result.issues)
        .toContainEqual({
          code:
            "missing-format",

          field:
            "format",
        });
    });

    it("marca formato explícitamente inválido como invalid", () => {
      const result =
        resolveHotWheelsTaxonomy(
          createProduct({
            format:
              "rocket-pack",
          }),
        );

      expect(result.status)
        .toBe("invalid");

      expect(result.taxonomy)
        .toBeNull();

      expect(result.issues)
        .toContainEqual({
          code:
            "invalid-format",

          field:
            "format",

          value:
            "rocket-pack",
        });
    });

    it("marca rareza explícitamente inválida como invalid", () => {
      const result =
        resolveHotWheelsTaxonomy(
          createProduct({
            rarity:
              "ultra-mega-raro",
          }),
        );

      expect(result.status)
        .toBe("invalid");

      expect(result.taxonomy)
        .toBeNull();

      expect(result.issues)
        .toContainEqual({
          code:
            "invalid-rarity",

          field:
            "rarity",

          value:
            "ultra-mega-raro",
        });
    });

    it("no obliga a informar rareza", () => {
      const result =
        resolveHotWheelsTaxonomy(
          createProduct({
            category:
              "mainline",

            format:
              "single",

            rarity: "",
          }),
        );

      expect(result.status)
        .toBe("complete");

      expect(
        result.taxonomy,
      ).toEqual({
        category:
          "mainline",

        format:
          "single",
      });
    });

    it("expone helper para consumidores futuros", () => {
      expect(
        hasCompleteHotWheelsTaxonomy(
          createProduct({
            category:
              "silver-series",

            format:
              "5-pack",
          }),
        ),
      ).toBe(true);

      expect(
        hasCompleteHotWheelsTaxonomy(
          createProduct({
            category:
              "deportivos",
          }),
        ),
      ).toBe(false);
    });
  },
);
