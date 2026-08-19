import {
  describe,
  expect,
  it,
} from "vitest";

import type {
  Product,
} from "@/shared/types/product";

import {
  createCategoryCatalogComposition,
  createCustomCatalogComposition,
  isCatalogCompositionReady,
} from "./CatalogComposition";

function product(
  id: string,
  overrides:
  Partial<Product> = {},
): Product {
  return {
    id,
    title:
      `Auto ${id}`,

    description: "",

    category:
      "deportivos",

    categories: [
      "deportivos",
    ],

    price: 19.9,
    offer_price: null,

    stock: 4,

    img: "",
    images: [],

    priority: 0,

    status:
      "Publicado",

    badges: [],
    attributes: [],

    ...overrides,
  };
}

describe(
  "CatalogComposition",
  () => {
    it(
      "respeta el orden de una selección personalizada",
      () => {
        const products = [
          product("A"),
          product("B"),
          product("C"),
        ];

        const result =
          createCustomCatalogComposition(
            products,
            [
              "C",
              "A",
            ],
            "Ferrari y deportivos",
          );

        expect(
          result.composition
            .productIds,
        ).toEqual([
          "C",
          "A",
        ]);

        expect(
          result.composition.mode,
        ).toBe(
          "custom",
        );

        expect(
          result.composition.title,
        ).toBe(
          "Ferrari y deportivos",
        );

        expect(
          result.excludedProductIds,
        ).toEqual([]);
      },
    );

    it(
      "excluye Borrador, Oculto e ids inexistentes",
      () => {
        const products = [
          product("A"),

          product(
            "B",
            {
              status:
                "Borrador",
            },
          ),

          product(
            "C",
            {
              status:
                "Oculto",
            },
          ),
        ];

        const result =
          createCustomCatalogComposition(
            products,
            [
              "A",
              "B",
              "C",
              "NO-EXISTE",
            ],
          );

        expect(
          result.composition
            .productIds,
        ).toEqual([
          "A",
        ]);

        expect(
          result
            .excludedProductIds,
        ).toEqual([
          "B",
          "C",
          "NO-EXISTE",
        ]);
      },
    );

    it(
      "acepta Publicado, Preventa y Agotado",
      () => {
        const products = [
          product(
            "A",
            {
              status:
                "Publicado",
            },
          ),

          product(
            "B",
            {
              status:
                "Preventa",
            },
          ),

          product(
            "C",
            {
              status:
                "Agotado",
            },
          ),
        ];

        const result =
          createCustomCatalogComposition(
            products,
            [
              "A",
              "B",
              "C",
            ],
          );

        expect(
          result.composition
            .productIds,
        ).toEqual([
          "A",
          "B",
          "C",
        ]);
      },
    );

    it(
      "resuelve múltiples categorías",
      () => {
        const products = [
          product(
            "A",
            {
              category:
                "deportivos",
              categories: [
                "deportivos",
              ],
            },
          ),

          product(
            "B",
            {
              category:
                "premium",
              categories: [
                "premium",
              ],
            },
          ),

          product(
            "C",
            {
              category:
                "clasicos",
              categories: [
                "clasicos",
              ],
            },
          ),
        ];

        const result =
          createCategoryCatalogComposition(
            products,
            [
              "deportivos",
              "premium",
            ],
          );

        expect(
          result.composition
            .productIds,
        ).toEqual([
          "A",
          "B",
        ]);

        expect(
          result.composition
            .categoryIds,
        ).toEqual([
          "deportivos",
          "premium",
        ]);
      },
    );

    it(
      "todas incluye solo estados comerciales visibles",
      () => {
        const products = [
          product("A"),

          product(
            "B",
            {
              status:
                "Preventa",
            },
          ),

          product(
            "C",
            {
              status:
                "Agotado",
            },
          ),

          product(
            "D",
            {
              status:
                "Oculto",
            },
          ),

          product(
            "E",
            {
              status:
                "Borrador",
            },
          ),
        ];

        const result =
          createCategoryCatalogComposition(
            products,
            [
              "todas",
            ],
          );

        expect(
          result.composition
            .productIds,
        ).toEqual([
          "A",
          "B",
          "C",
        ]);

        expect(
          result
            .excludedProductIds,
        ).toEqual([
          "D",
          "E",
        ]);
      },
    );

    it(
      "elimina ids repetidos",
      () => {
        const products = [
          product("A"),
          product("B"),
        ];

        const result =
          createCustomCatalogComposition(
            products,
            [
              "A",
              "A",
              "B",
              "B",
            ],
          );

        expect(
          result.composition
            .productIds,
        ).toEqual([
          "A",
          "B",
        ]);
      },
    );

    it(
      "normaliza título y valida readiness",
      () => {
        const result =
          createCustomCatalogComposition(
            [
              product("A"),
            ],
            [
              "A",
            ],
            "   ",
          );

        expect(
          result.composition.title,
        ).toBe(
          "Catálogo personalizado",
        );

        expect(
          isCatalogCompositionReady(
            result.composition,
          ),
        ).toBe(true);

        expect(
          isCatalogCompositionReady({
            ...result.composition,
            productIds: [],
          }),
        ).toBe(false);
      },
    );
  },
);
