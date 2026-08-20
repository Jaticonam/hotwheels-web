import {
  describe,
  expect,
  it,
} from "vitest";

import {
  createQuotationCommercialContext,
  isQuotationCommercialContextReady,
  normalizeQuotationCommercialContext,
  updateQuotationCommercialTerms,
  updateQuotationCustomer,
} from "./QuotationCommercialContext";

describe(
  "QuotationCommercialContext",
  () => {
    it(
      "requiere cliente y fecha de emisión válida",
      () => {
        const initial =
          createQuotationCommercialContext(
            "2026-08-19",
          );

        expect(
          isQuotationCommercialContextReady(
            initial,
          ),
        ).toBe(false);

        const next =
          updateQuotationCustomer(
            initial,
            {
              name:
                "Colecciones Tacna",
            },
          );

        expect(
          isQuotationCommercialContextReady(
            next,
          ),
        ).toBe(true);
      },
    );

    it(
      "WhatsApp y documento son opcionales",
      () => {
        let context =
          createQuotationCommercialContext(
            "2026-08-19",
          );

        context =
          updateQuotationCustomer(
            context,
            {
              name:
                "Cliente",

              whatsapp:
                "+51 999 999 999",

              document:
                "20600000001",
            },
          );

        expect(
          isQuotationCommercialContextReady(
            context,
          ),
        ).toBe(true);
      },
    );

    it(
      "rechaza vigencia anterior a emisión",
      () => {
        let context =
          createQuotationCommercialContext(
            "2026-08-19",
          );

        context =
          updateQuotationCustomer(
            context,
            {
              name:
                "Cliente",
            },
          );

        context =
          updateQuotationCommercialTerms(
            context,
            {
              validUntil:
                "2026-08-18",
            },
          );

        expect(
          isQuotationCommercialContextReady(
            context,
          ),
        ).toBe(false);
      },
    );

    it(
      "acepta vigencia posterior",
      () => {
        let context =
          createQuotationCommercialContext(
            "2026-08-19",
          );

        context =
          updateQuotationCustomer(
            context,
            {
              name:
                "Cliente",
            },
          );

        context =
          updateQuotationCommercialTerms(
            context,
            {
              validUntil:
                "2026-08-26",
            },
          );

        expect(
          isQuotationCommercialContextReady(
            context,
          ),
        ).toBe(true);
      },
    );

    it(
      "normaliza textos sin mutar el contexto original",
      () => {
        let context =
          createQuotationCommercialContext(
            " 2026-08-19 ",
          );

        context =
          updateQuotationCustomer(
            context,
            {
              name:
                "  Cliente VIP  ",
            },
          );

        const normalized =
          normalizeQuotationCommercialContext(
            context,
          );

        expect(
          normalized.customer.name,
        ).toBe(
          "Cliente VIP",
        );

        expect(
          normalized.terms.issuedOn,
        ).toBe(
          "2026-08-19",
        );

        expect(
          context.customer.name,
        ).toBe(
          "  Cliente VIP  ",
        );
      },
    );
  },
);