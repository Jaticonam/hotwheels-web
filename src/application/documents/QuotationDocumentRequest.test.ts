import {
  describe,
  expect,
  it,
} from "vitest";

import type {
  QuotationPdfOutputRequest,
} from "@/application/quotation/QuotationOutput";

import {
  prepareQuotationDocumentRequest,
} from "./QuotationDocumentRequest";

function pdfOutput():
QuotationPdfOutputRequest {
  return {
    kind:
      "pdf",

    snapshot: {
      schemaVersion: 1,

      quotationId:
        "quote-001",

      composition: {
        schemaVersion: 1,

        title:
          "Cotización Agosto",

        currency:
          "PEN",

        lines: [
          {
            productId:
              "HW-001",

            title:
              "Porsche 911",

            imageUrl:
              "https://example.com/hw-001.jpg",

            status:
              "Publicado",

            stockSnapshot:
              4,

            quantity:
              2,

            unitPrice:
              19.9,

            originalUnitPrice:
              24.9,

            subtotal:
              39.8,
          },
        ],
      },

      commercialContext: {
        schemaVersion: 1,

        customer: {
          name:
            "Cliente Test",

          whatsapp:
            "",

          document:
            "12345678",
        },

        terms: {
          issuedOn:
            "2026-08-31",

          validUntil:
            "2026-09-07",

          notes:
            "Entrega coordinada.",
        },
      },

      summary: {
        products:
          1,

        units:
          2,

        total:
          39.8,

        originalTotal:
          49.8,

        savings:
          10,
      },
    },
  };
}

describe(
  "QuotationDocumentRequest",
  () => {
    it(
      "crea un envelope versionado específico de cotización",
      () => {
        const result =
          prepareQuotationDocumentRequest(
            pdfOutput(),
            "2026-08-31T15:00:00.000Z",
          );

        expect(
          result,
        ).toMatchObject({
          schemaVersion: 1,

          tenantId:
            "hotwheels",

          documentType:
            "quotation",

          template: {
            id:
              "collectibles.quotation",

            version: 1,
          },

          locale:
            "es-PE",

          currency:
            "PEN",

          requestedAt:
            "2026-08-31T15:00:00.000Z",
        });
      },
    );

    it(
      "preserva precios y totales exclusivamente desde el snapshot",
      () => {
        const result =
          prepareQuotationDocumentRequest(
            pdfOutput(),
          );

        expect(
          result.snapshot
            .composition
            .lines[0]
            .unitPrice,
        ).toBe(
          19.9,
        );

        expect(
          result.snapshot
            .composition
            .lines[0]
            .subtotal,
        ).toBe(
          39.8,
        );

        expect(
          result.snapshot
            .summary
            .total,
        ).toBe(
          39.8,
        );
      },
    );

    it(
      "crea una copia independiente del snapshot recibido",
      () => {
        const source =
          pdfOutput();

        const result =
          prepareQuotationDocumentRequest(
            source,
          );

        source
          .snapshot
          .composition
          .lines[0]
          .unitPrice =
          999;

        expect(
          result.snapshot
            .composition
            .lines[0]
            .unitPrice,
        ).toBe(
          19.9,
        );
      },
    );
  },
);