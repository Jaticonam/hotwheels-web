import {
  describe,
  expect,
  it,
} from "vitest";

import {
  calculateQuotationSummary,
  createQuotationComposition,
  isQuotationCompositionReady,
  removeQuotationLine,
  updateQuotationLineQuantity,
} from "./QuotationComposition";

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
      "clasicos",

    categories: [
      "clasicos",
    ],

    price:
      20,

    offer_price:
      null,

    stock:
      5,

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

describe(
  "QuotationComposition",
  () => {
    it(
      "crea líneas respetando el orden de selección",
      () => {
        const result =
          createQuotationComposition(
            [
              product("A"),
              product("B"),
            ],
            [
              "B",
              "A",
            ],
            "Cliente Agosto",
          );

        expect(
          result.excludedProductIds,
        ).toEqual([]);

        expect(
          result.composition.lines.map(
            (line) =>
              line.productId,
          ),
        ).toEqual([
          "B",
          "A",
        ]);

        expect(
          result.composition.title,
        ).toBe(
          "Cliente Agosto",
        );

        expect(
          result.composition.currency,
        ).toBe(
          "PEN",
        );
      },
    );

    it(
      "usa offer_price como precio unitario efectivo",
      () => {
        const result =
          createQuotationComposition(
            [
              product(
                "A",
                {
                  price:
                    30,

                  offer_price:
                    24,
                },
              ),
            ],
            [
              "A",
            ],
          );

        const line =
          result.composition
            .lines[0];

        expect(
          line.unitPrice,
        ).toBe(24);

        expect(
          line.originalUnitPrice,
        ).toBe(30);

        expect(
          line.subtotal,
        ).toBe(24);
      },
    );

    it(
      "excluye productos no cotizables",
      () => {
        const result =
          createQuotationComposition(
            [
              product(
                "OK",
              ),

              product(
                "PRE",
                {
                  status:
                    "Preventa",

                  stock:
                    null,
                },
              ),

              product(
                "OUT",
                {
                  status:
                    "Agotado",

                  stock:
                    0,
                },
              ),

              product(
                "HIDDEN",
                {
                  status:
                    "Oculto",
                },
              ),

              product(
                "ZERO",
                {
                  price:
                    0,
                },
              ),
            ],
            [
              "OK",
              "PRE",
              "OUT",
              "HIDDEN",
              "ZERO",
              "MISSING",
            ],
          );

        expect(
          result.composition.lines.map(
            (line) =>
              line.productId,
          ),
        ).toEqual([
          "OK",
          "PRE",
        ]);

        expect(
          result.excludedProductIds,
        ).toEqual([
          "OUT",
          "HIDDEN",
          "ZERO",
          "MISSING",
        ]);
      },
    );

    it(
      "limita cantidad al stock disponible",
      () => {
        const initial =
          createQuotationComposition(
            [
              product(
                "A",
                {
                  stock:
                    3,
                },
              ),
            ],
            [
              "A",
            ],
          ).composition;

        const updated =
          updateQuotationLineQuantity(
            initial,
            "A",
            10,
          );

        expect(
          updated.lines[0]
            .quantity,
        ).toBe(3);

        expect(
          updated.lines[0]
            .subtotal,
        ).toBe(60);
      },
    );

    it(
      "mantiene mínimo uno y permite cantidad abierta sin stock conocido",
      () => {
        const initial =
          createQuotationComposition(
            [
              product(
                "A",
                {
                  stock:
                    null,
                },
              ),
            ],
            [
              "A",
            ],
          ).composition;

        const minimum =
          updateQuotationLineQuantity(
            initial,
            "A",
            0,
          );

        expect(
          minimum.lines[0]
            .quantity,
        ).toBe(1);

        const open =
          updateQuotationLineQuantity(
            initial,
            "A",
            25,
          );

        expect(
          open.lines[0]
            .quantity,
        ).toBe(25);
      },
    );

    it(
      "calcula unidades, total y ahorro",
      () => {
        let composition =
          createQuotationComposition(
            [
              product(
                "A",
                {
                  price:
                    30,

                  offer_price:
                    24,
                },
              ),

              product(
                "B",
                {
                  price:
                    10,
                },
              ),
            ],
            [
              "A",
              "B",
            ],
          ).composition;

        composition =
          updateQuotationLineQuantity(
            composition,
            "A",
            2,
          );

        composition =
          updateQuotationLineQuantity(
            composition,
            "B",
            3,
          );

        expect(
          calculateQuotationSummary(
            composition,
          ),
        ).toEqual({
          products:
            2,

          units:
            5,

          originalTotal:
            90,

          total:
            78,

          savings:
            12,
        });
      },
    );

    it(
      "permite retirar líneas sin mutar la composición anterior",
      () => {
        const initial =
          createQuotationComposition(
            [
              product("A"),
              product("B"),
            ],
            [
              "A",
              "B",
            ],
          ).composition;

        const next =
          removeQuotationLine(
            initial,
            "A",
          );

        expect(
          initial.lines.length,
        ).toBe(2);

        expect(
          next.lines.map(
            (line) =>
              line.productId,
          ),
        ).toEqual([
          "B",
        ]);

        expect(
          isQuotationCompositionReady(
            next,
          ),
        ).toBe(true);
      },
    );
  },
);
