import {
  describe,
  expect,
  it,
} from "vitest";

import {
  createQuotationDraft,
  isQuotationDraftReady,
  updateQuotationDraft,
} from "./QuotationDraft";

import type {
  QuotationComposition,
} from "./QuotationComposition";

import type {
  QuotationCommercialContext,
} from "./QuotationCommercialContext";

function composition():
QuotationComposition {
  return {
    schemaVersion: 1,

    title:
      "Cotización prueba",

    currency:
      "PEN",

    lines: [
      {
        productId:
          "HWC001",

        title:
          "Auto prueba",

        imageUrl:
          "https://example.com/a.jpg",

        status:
          "Publicado",

        stockSnapshot:
          5,

        quantity:
          2,

        unitPrice:
          20,

        originalUnitPrice:
          25,

        subtotal:
          40,
      },
    ],
  };
}

function context():
QuotationCommercialContext {
  return {
    schemaVersion: 1,

    customer: {
      name:
        "Cliente prueba",

      whatsapp:
        "",

      document:
        "",
    },

    terms: {
      issuedOn:
        "2026-08-19",

      validUntil:
        "",

      notes:
        "",
    },
  };
}

describe(
  "QuotationDraft",
  () => {
    it(
      "crea snapshot de composición y contexto",
      () => {
        const sourceComposition =
          composition();

        const sourceContext =
          context();

        const draft =
          createQuotationDraft({
            id:
              "Q-001",

            now:
              "2026-08-19T22:00:00-05:00",

            composition:
              sourceComposition,

            commercialContext:
              sourceContext,
          });

        expect(
          draft.id,
        ).toBe(
          "Q-001",
        );

        expect(
          draft.status,
        ).toBe(
          "draft",
        );

        expect(
          draft.createdAt,
        ).toBe(
          draft.updatedAt,
        );

        expect(
          draft.composition,
        ).not.toBe(
          sourceComposition,
        );

        expect(
          draft.commercialContext,
        ).not.toBe(
          sourceContext,
        );
      },
    );

    it(
      "preserva id y createdAt al actualizar",
      () => {
        const draft =
          createQuotationDraft({
            id:
              "Q-001",

            now:
              "2026-08-19T22:00:00-05:00",

            composition:
              composition(),

            commercialContext:
              context(),
          });

        const next =
          updateQuotationDraft(
            draft,
            {
              now:
                "2026-08-19T22:30:00-05:00",

              composition:
                {
                  ...composition(),

                  title:
                    "Cotización actualizada",
                },

              commercialContext:
                context(),
            },
          );

        expect(
          next.id,
        ).toBe(
          draft.id,
        );

        expect(
          next.createdAt,
        ).toBe(
          draft.createdAt,
        );

        expect(
          next.updatedAt,
        ).toBe(
          "2026-08-19T22:30:00-05:00",
        );

        expect(
          next.composition.title,
        ).toBe(
          "Cotización actualizada",
        );
      },
    );

    it(
      "indica cuando el borrador está comercialmente listo",
      () => {
        const readyDraft =
          createQuotationDraft({
            id:
              "Q-READY",

            now:
              "2026-08-19T22:00:00-05:00",

            composition:
              composition(),

            commercialContext:
              context(),
          });

        expect(
          isQuotationDraftReady(
            readyDraft,
          ),
        ).toBe(true);

        const incomplete =
          createQuotationDraft({
            id:
              "Q-INCOMPLETE",

            now:
              "2026-08-19T22:00:00-05:00",

            composition:
              composition(),

            commercialContext: {
              ...context(),

              customer: {
                ...context()
                  .customer,

                name:
                  "",
              },
            },
          });

        expect(
          isQuotationDraftReady(
            incomplete,
          ),
        ).toBe(false);
      },
    );

    it(
      "rechaza identificadores vacíos",
      () => {
        expect(
          () =>
            createQuotationDraft({
              id:
                "   ",

              now:
                "2026-08-19T22:00:00-05:00",

              composition:
                composition(),

              commercialContext:
                context(),
            }),
        ).toThrow();
      },
    );
  },
);