import {
  describe,
  expect,
  it,
} from "vitest";

import type {
  CatalogComposition,
} from "./CatalogComposition";

import {
  resolveCatalogPreview,
} from "./CatalogPreview";

import type {
  Product,
} from "@/shared/types/product";

function product(
  id: string,
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

    stock: 3,

    img: "",
    images: [],

    priority: 0,

    status:
      "Publicado",

    badges: [],
    attributes: [],
  };
}

function composition(
  productIds:
    string[],
): CatalogComposition {
  return {
    schemaVersion: 1,

    mode:
      "custom",

    title:
      "Catálogo prueba",

    productIds,

    categoryIds: [],
  };
}

describe(
  "CatalogPreview",
  () => {
    it(
      "respeta el orden exacto de CatalogComposition",
      () => {
        const result =
          resolveCatalogPreview(
            composition([
              "C",
              "A",
              "B",
            ]),
            [
              product("A"),
              product("B"),
              product("C"),
            ],
          );

        expect(
          result.products.map(
            (item) =>
              item.id,
          ),
        ).toEqual([
          "C",
          "A",
          "B",
        ]);
      },
    );

    it(
      "reporta productos faltantes sin romper la vista previa",
      () => {
        const result =
          resolveCatalogPreview(
            composition([
              "A",
              "NO-EXISTE",
              "B",
            ]),
            [
              product("A"),
              product("B"),
            ],
          );

        expect(
          result.products.map(
            (item) =>
              item.id,
          ),
        ).toEqual([
          "A",
          "B",
        ]);

        expect(
          result.missingProductIds,
        ).toEqual([
          "NO-EXISTE",
        ]);
      },
    );

    it(
      "pagina por bloques de seis productos",
      () => {
        const ids = [
          "A",
          "B",
          "C",
          "D",
          "E",
          "F",
          "G",
          "H",
          "I",
          "J",
          "K",
          "L",
          "M",
        ];

        const result =
          resolveCatalogPreview(
            composition(ids),
            ids.map(product),
          );

        expect(
          result.pages.map(
            (page) =>
              page.length,
          ),
        ).toEqual([
          6,
          6,
          1,
        ]);
      },
    );
  },
);
