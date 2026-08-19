import {
  describe,
  expect,
  it,
} from "vitest";

import type {
  CatalogComposition,
} from "@/application/catalog/CatalogComposition";

import {
  prepareCatalogDocumentRequest,
} from "./CatalogDocumentRequest";

import type {
  Product,
} from "@/shared/types/product";

function product(
  id: string,
  overrides:
  Partial<Product> = {},
): Product {
  return {
    id,

    title:
      `Auto ${id}`,

    description:
      `Descripción ${id}`,

    category:
      "deportivos",

    categories: [
      "deportivos",
    ],

    price:
      19.9,

    offer_price:
      null,

    stock:
      4,

    img:
      `https://example.com/${id}.jpg`,

    images: [],

    priority:
      0,

    status:
      "Publicado",

    badges: [],
    attributes: [],

    year:
      2026,

    case_code:
      "A",

    card_number:
      "1/5",

    mini_series:
      "HW Test",

    ...overrides,
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
      "Catálogo Agosto",

    categoryIds: [],

    productIds,
  };
}

describe(
  "CatalogDocumentRequest",
  () => {
    it(
      "crea un payload versionado y reproducible",
      () => {
        const requestedAt =
          "2026-08-19T08:00:00.000Z";

        const result =
          prepareCatalogDocumentRequest(
            composition([
              "B",
              "A",
            ]),
            [
              product("A"),
              product(
                "B",
                {
                  price:
                    29.9,

                  offer_price:
                    24.9,
                },
              ),
            ],
            requestedAt,
          );

        expect(
          result.missingProductIds,
        ).toEqual([]);

        expect(
          result.request,
        ).not.toBeNull();

        expect(
          result.request?.schemaVersion,
        ).toBe(1);

        expect(
          result.request?.tenantId,
        ).toBe(
          "hotwheels",
        );

        expect(
          result.request?.template,
        ).toEqual({
          id:
            "collectibles.catalog",

          version: 1,
        });

        expect(
          result.request?.requestedAt,
        ).toBe(
          requestedAt,
        );

        expect(
          result.request?.composition
            .productIds,
        ).toEqual([
          "B",
          "A",
        ]);

        expect(
          result.request?.content
            .pages[0]
            .products
            .map(
              (item) =>
                item.id,
            ),
        ).toEqual([
          "B",
          "A",
        ]);

        expect(
          result.request?.content
            .pages[0]
            .products[0]
            .offerPrice,
        ).toBe(
          24.9,
        );
      },
    );

    it(
      "pagina el snapshot por seis productos",
      () => {
        const ids = [
          "A",
          "B",
          "C",
          "D",
          "E",
          "F",
          "G",
        ];

        const result =
          prepareCatalogDocumentRequest(
            composition(ids),
            ids.map(product),
            "2026-08-19T08:00:00.000Z",
          );

        expect(
          result.request?.content
            .pages
            .map(
              (page) =>
                page.products.length,
            ),
        ).toEqual([
          6,
          1,
        ]);

        expect(
          result.request?.content
            .totalProducts,
        ).toBe(7);
      },
    );

    it(
      "no genera request si la composición quedó obsoleta",
      () => {
        const result =
          prepareCatalogDocumentRequest(
            composition([
              "A",
              "NO-EXISTE",
            ]),
            [
              product("A"),
            ],
            "2026-08-19T08:00:00.000Z",
          );

        expect(
          result.request,
        ).toBeNull();

        expect(
          result.missingProductIds,
        ).toEqual([
          "NO-EXISTE",
        ]);
      },
    );
  },
);
