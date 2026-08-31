import {
  describe,
  expect,
  it,
} from "vitest";

import type {
  QuotationWhatsAppOutputRequest,
} from "@/application/quotation/QuotationOutput";

import {
  buildQuotationWhatsAppMessage,
  buildQuotationWhatsAppUrl,
  normalizeQuotationWhatsAppPhone,
} from "./quotationWhatsApp";

function buildRequest(
  whatsapp = "999 999 999",
): QuotationWhatsAppOutputRequest {
  return {
    kind:
      "whatsapp",

    snapshot: {
      schemaVersion:
        1,

      quotationId:
        "Q-2026-001",

      composition: {
        schemaVersion:
          1,

        title:
          "Cotización Coleccionables",

        currency:
          "PEN",

        lines: [
          {
            productId:
              "HW-001",

            title:
              "Collector Car",

            imageUrl:
              "",

            status:
              "Publicado",

            stockSnapshot:
              10,

            quantity:
              2,

            unitPrice:
              29.9,

            originalUnitPrice:
              35,

            subtotal:
              59.8,
          },
          {
            productId:
              "HW-002",

            title:
              "Premium Car",

            imageUrl:
              "",

            status:
              "Publicado",

            stockSnapshot:
              5,

            quantity:
              1,

            unitPrice:
              49.9,

            originalUnitPrice:
              49.9,

            subtotal:
              49.9,
          },
        ],
      },

      commercialContext: {
        schemaVersion:
          1,

        customer: {
          name:
            "Julio Cliente",

          whatsapp,

          document:
            "12345678",
        },

        terms: {
          issuedOn:
            "2026-08-31",

          validUntil:
            "2026-09-05",

          notes:
            "Stock sujeto a confirmación.",
        },
      },

      summary: {
        products:
          2,

        units:
          3,

        originalTotal:
          119.9,

        total:
          109.7,

        savings:
          10.2,
      },
    },
  };
}

describe(
  "Quotation WhatsApp",
  () => {
    it(
      "normaliza celular peruano local",
      () => {
        expect(
          normalizeQuotationWhatsAppPhone(
            "999 999 999",
          ),
        ).toBe(
          "51999999999",
        );
      },
    );

    it(
      "preserva prefijo internacional ya informado",
      () => {
        expect(
          normalizeQuotationWhatsAppPhone(
            "+51 999 999 999",
          ),
        ).toBe(
          "51999999999",
        );
      },
    );

    it(
      "construye mensaje exclusivamente con el snapshot cotizado",
      () => {
        const message =
          buildQuotationWhatsAppMessage(
            buildRequest(),
          );

        expect(
          message,
        ).toContain(
          "*Cotización Hot Wheels*",
        );

        expect(
          message,
        ).toContain(
          "Referencia: Q-2026-001",
        );

        expect(
          message,
        ).toContain(
          "Collector Car",
        );

        expect(
          message,
        ).toContain(
          "Precio unitario: S/ 29.90",
        );

        expect(
          message,
        ).toContain(
          "Subtotal: S/ 59.80",
        );

        expect(
          message,
        ).toContain(
          "*TOTAL: S/ 109.70*",
        );

        expect(
          message,
        ).toContain(
          "Válida hasta: 2026-09-05",
        );

        expect(
          message,
        ).toContain(
          "Stock sujeto a confirmación.",
        );
      },
    );

    it(
      "dirige la URL al WhatsApp del cliente",
      () => {
        const url =
          buildQuotationWhatsAppUrl(
            buildRequest(
              "999999999",
            ),
          );

        expect(
          url.startsWith(
            "https://wa.me/51999999999?text=",
          ),
        ).toBe(
          true,
        );

        expect(
          decodeURIComponent(
            url.split(
              "?text=",
            )[1],
          ),
        ).toContain(
          "*TOTAL: S/ 109.70*",
        );
      },
    );

    it(
      "no utiliza el número comercial fijo de la marca",
      () => {
        const url =
          buildQuotationWhatsAppUrl(
            buildRequest(
              "+51 988 777 666",
            ),
          );

        expect(
          url,
        ).toContain(
          "https://wa.me/51988777666",
        );
      },
    );

    it(
      "rechaza destinatario sin dígitos",
      () => {
        expect(
          () =>
            buildQuotationWhatsAppUrl(
              buildRequest(
                "sin numero",
              ),
            ),
        ).toThrow(
          "WhatsApp de cliente válido",
        );
      },
    );
  },
);