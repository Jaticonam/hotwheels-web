import {
  describe,
  expect,
  it,
} from "vitest";

import type {
  Product,
} from "@/shared/types/product";

import {
  buildProductWhatsAppMessage,
} from "./whatsapp";

function buildProduct(
  overrides: Partial<Product> = {},
): Product {
  return {
    id: "HW-WA-001",
    title: "Modelo WhatsApp",
    description: "",
    category: "deportivos",
    categories: ["deportivos"],

    price: 29.9,
    offer_price: null,
    stock: 5,

    img: "",
    images: [],

    priority: 0,
    status: "Publicado",

    badges: [],
    attributes: [],

    ...overrides,
  };
}

describe(
  "WhatsApp comercial por estado",
  () => {
    it(
      "Preventa usa copy de preventa",
      () => {
        const message =
          buildProductWhatsAppMessage({
            product:
              buildProduct({
                status: "Preventa",
              }),
          });

        expect(
          message,
        ).toContain(
          "consultar la preventa",
        );
      },
    );

    it(
      "Agotado usa copy de reposición",
      () => {
        const message =
          buildProductWhatsAppMessage({
            product:
              buildProduct({
                status: "Agotado",
                stock: 0,
              }),
          });

        expect(
          message,
        ).toContain(
          "volverá a estar disponible",
        );
      },
    );

    it(
      "stock sin informar usa copy de confirmación",
      () => {
        const message =
          buildProductWhatsAppMessage({
            product:
              buildProduct({
                stock: null,
              }),
          });

        expect(
          message,
        ).toContain(
          "confirmar la disponibilidad",
        );
      },
    );
  },
);
describe(
  "WhatsApp no contiene copy heredado de florería",
  () => {
    it(
      "usa un cierre propio de coleccionables",
      () => {
        const message =
          buildProductWhatsAppMessage({
            product:
              buildProduct(),
          });

        expect(
          message,
        ).toContain(
          "confirmar disponibilidad",
        );

        expect(
          message,
        ).toContain(
          "coordinar el pago y la entrega",
        );

        expect(
          message.toLowerCase(),
        ).not.toContain(
          "dedicatoria",
        );

        expect(
          message.toLowerCase(),
        ).not.toContain(
          "detalle",
        );

        expect(
          message,
        ).not.toContain(
          "💐",
        );
      },
    );
  },
);
