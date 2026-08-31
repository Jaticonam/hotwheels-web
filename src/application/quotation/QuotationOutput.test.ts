import {
  describe,
  expect,
  it,
} from "vitest";

import type {
  QuotationComposition,
} from "./QuotationComposition";

import type {
  QuotationCommercialContext,
} from "./QuotationCommercialContext";

import {
  createQuotationOutputPlan,
  createQuotationOutputRequest,
} from "./QuotationOutput";

function buildComposition():
QuotationComposition {
  return {
    schemaVersion: 1,

    title:
      "Cotización Hot Wheels",

    currency:
      "PEN",

    lines: [
      {
        productId:
          "HW-Q5-001",

        title:
          "Collector Car",

        imageUrl:
          "https://example.test/car.jpg",

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
    ],
  };
}

function buildCommercialContext(
  whatsapp = "51999999999",
):
QuotationCommercialContext {
  return {
    schemaVersion: 1,

    customer: {
      name:
        "Cliente Hot Wheels",

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
        "Precio válido durante la vigencia.",
    },
  };
}

describe(
  "QuotationOutput",
  () => {
    it(
      "crea un snapshot independiente y conserva los valores cotizados",
      () => {
        const composition =
          buildComposition();

        const commercialContext =
          buildCommercialContext();

        const plan =
          createQuotationOutputPlan({
            quotationId:
              " Q-001 ",

            composition,

            commercialContext,
          });

        expect(
          plan.snapshot.quotationId,
        ).toBe(
          "Q-001",
        );

        expect(
          plan.snapshot.summary,
        ).toEqual({
          products:
            1,

          units:
            2,

          originalTotal:
            70,

          total:
            59.8,

          savings:
            10.200000000000003,
        });

        expect(
          plan.snapshot.composition,
        ).not.toBe(
          composition,
        );

        expect(
          plan.snapshot.composition.lines[0],
        ).not.toBe(
          composition.lines[0],
        );

        composition.lines[0].unitPrice =
          999;

        composition.lines[0].subtotal =
          1998;

        commercialContext.customer.name =
          "Cliente alterado";

        expect(
          plan.snapshot.composition.lines[0]
            .unitPrice,
        ).toBe(
          29.9,
        );

        expect(
          plan.snapshot.composition.lines[0]
            .subtotal,
        ).toBe(
          59.8,
        );

        expect(
          plan.snapshot.commercialContext
            .customer.name,
        ).toBe(
          "Cliente Hot Wheels",
        );
      },
    );

    it(
      "habilita WhatsApp, PDF y carrito cuando la cotización está completa",
      () => {
        const plan =
          createQuotationOutputPlan({
            composition:
              buildComposition(),

            commercialContext:
              buildCommercialContext(),
          });

        expect(
          plan.capabilities.whatsapp,
        ).toEqual({
          kind:
            "whatsapp",

          state:
            "ready",

          reasons:
            [],
        });

        expect(
          plan.capabilities.pdf.state,
        ).toBe(
          "ready",
        );

        expect(
          plan.capabilities.cart.state,
        ).toBe(
          "ready",
        );

        expect(
          plan.capabilities["share-link"],
        ).toEqual({
          kind:
            "share-link",

          state:
            "unavailable",

          reasons: [
            "requires-core",
          ],
        });
      },
    );

    it(
      "bloquea WhatsApp sin número pero mantiene PDF disponible",
      () => {
        const plan =
          createQuotationOutputPlan({
            composition:
              buildComposition(),

            commercialContext:
              buildCommercialContext(
                "   ",
              ),
          });

        expect(
          plan.capabilities.whatsapp.state,
        ).toBe(
          "blocked",
        );

        expect(
          plan.capabilities.whatsapp.reasons,
        ).toContain(
          "customer-whatsapp-missing",
        );

        expect(
          plan.capabilities.pdf.state,
        ).toBe(
          "ready",
        );
      },
    );

    it(
      "permite carrito aunque el contexto comercial esté incompleto",
      () => {
        const commercialContext =
          buildCommercialContext();

        commercialContext.customer.name =
          "";

        commercialContext.terms.validUntil =
          "";

        const plan =
          createQuotationOutputPlan({
            composition:
              buildComposition(),

            commercialContext,
          });

        expect(
          plan.capabilities.cart,
        ).toEqual({
          kind:
            "cart",

          state:
            "ready",

          reasons:
            [],
        });

        expect(
          plan.capabilities.pdf.state,
        ).toBe(
          "blocked",
        );

        expect(
          plan.capabilities.whatsapp.state,
        ).toBe(
          "blocked",
        );
      },
    );

    it(
      "bloquea las salidas operativas cuando la composición no está lista",
      () => {
        const composition =
          buildComposition();

        composition.lines =
          [];

        const plan =
          createQuotationOutputPlan({
            composition,

            commercialContext:
              buildCommercialContext(),
          });

        expect(
          plan.capabilities.whatsapp.reasons,
        ).toContain(
          "composition-not-ready",
        );

        expect(
          plan.capabilities.pdf.reasons,
        ).toContain(
          "composition-not-ready",
        );

        expect(
          plan.capabilities.cart,
        ).toEqual({
          kind:
            "cart",

          state:
            "blocked",

          reasons: [
            "composition-not-ready",
          ],
        });
      },
    );

    it(
      "crea requests tipados y congela el carrito al precio del snapshot",
      () => {
        const plan =
          createQuotationOutputPlan({
            composition:
              buildComposition(),

            commercialContext:
              buildCommercialContext(),
          });

        const whatsapp =
          createQuotationOutputRequest(
            plan,
            "whatsapp",
          );

        const pdf =
          createQuotationOutputRequest(
            plan,
            "pdf",
          );

        const cart =
          createQuotationOutputRequest(
            plan,
            "cart",
          );

        const shareLink =
          createQuotationOutputRequest(
            plan,
            "share-link",
          );

        expect(
          whatsapp?.kind,
        ).toBe(
          "whatsapp",
        );

        expect(
          pdf?.kind,
        ).toBe(
          "pdf",
        );

        expect(
          cart,
        ).toMatchObject({
          kind:
            "cart",

          pricingPolicy:
            "quotation-snapshot",
        });

        expect(
          shareLink,
        ).toBeNull();
      },
    );

    it(
      "no crea un request cuando la salida está bloqueada",
      () => {
        const commercialContext =
          buildCommercialContext(
            "",
          );

        const plan =
          createQuotationOutputPlan({
            composition:
              buildComposition(),

            commercialContext,
          });

        expect(
          createQuotationOutputRequest(
            plan,
            "whatsapp",
          ),
        ).toBeNull();

        expect(
          createQuotationOutputRequest(
            plan,
            "pdf",
          ),
        ).not.toBeNull();

        expect(
          createQuotationOutputRequest(
            plan,
            "cart",
          ),
        ).not.toBeNull();
      },
    );
  },
);