import {
  describe,
  expect,
  it,
} from "vitest";

import type {
  Product,
} from "@/shared/types/product";

import {
  getProductCardPrimaryAction,
  getProductCardStockPresentation,
} from "./ProductCard.utils";

function buildProduct(
  overrides: Partial<Product> = {},
): Product {
  return {
    id: "HW-001",
    title: "Modelo de prueba",
    description: "",
    category: "deportivos",
    categories: ["deportivos"],

    price: 29.9,
    offer_price: null,
    stock: 10,

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
  "ProductCard stock presentation",
  () => {
    it(
      "muestra stock disponible",
      () => {
        expect(
          getProductCardStockPresentation(
            buildProduct({
              stock: 8,
            }),
          ).label,
        ).toBe(
          "Disponible",
        );
      },
    );

    it(
      "detecta últimas unidades",
      () => {
        expect(
          getProductCardStockPresentation(
            buildProduct({
              stock: 2,
            }),
          ),
        ).toEqual({
          label:
            "Quedan 2",
          className:
            "product-card-stock-warning",
        });
      },
    );

    it(
      "prioriza preventa",
      () => {
        expect(
          getProductCardStockPresentation(
            buildProduct({
              status: "Preventa",
              stock: 0,
            }),
          ).label,
        ).toBe(
          "Preventa",
        );
      },
    );

    it(
      "detecta agotado",
      () => {
        expect(
          getProductCardStockPresentation(
            buildProduct({
              status: "Agotado",
              stock: 5,
            }),
          ).label,
        ).toBe(
          "Agotado",
        );
      },
    );

    it(
      "maneja stock no informado",
      () => {
        expect(
          getProductCardStockPresentation(
            buildProduct({
              stock: null,
            }),
          ).label,
        ).toBe(
          "Por confirmar",
        );
      },
    );
  },
);

describe(
  "ProductCard primary action",
  () => {
    it(
      "Publicado vendible usa Mi Box",
      () => {
        expect(
          getProductCardPrimaryAction(
            buildProduct(),
            true,
          ),
        ).toEqual({
          type: "cart",
          label: "Agregar a Mi Box",
        });
      },
    );

    it(
      "Preventa usa consulta por WhatsApp",
      () => {
        expect(
          getProductCardPrimaryAction(
            buildProduct({
              status: "Preventa",
              stock: 10,
            }),
            false,
          ),
        ).toEqual({
          type: "whatsapp",
          label: "Consultar",
        });
      },
    );

    it(
      "Agotado usa consulta de disponibilidad",
      () => {
        expect(
          getProductCardPrimaryAction(
            buildProduct({
              status: "Agotado",
              stock: 0,
            }),
            false,
          ),
        ).toEqual({
          type: "whatsapp",
          label: "Consultar disponibilidad",
        });
      },
    );

    it(
      "Publicado sin stock informado consulta disponibilidad",
      () => {
        expect(
          getProductCardPrimaryAction(
            buildProduct({
              stock: null,
            }),
            false,
          ),
        ).toEqual({
          type: "whatsapp",
          label: "Consultar disponibilidad",
        });
      },
    );

    it(
      "Publicado sin handler de carrito conserva salida por WhatsApp",
      () => {
        expect(
          getProductCardPrimaryAction(
            buildProduct({
              stock: 8,
            }),
            false,
          ),
        ).toEqual({
          type: "whatsapp",
          label: "Consulta WhatsApp",
        });
      },
    );

    it(
      "Borrador queda defensivamente deshabilitado",
      () => {
        expect(
          getProductCardPrimaryAction(
            buildProduct({
              status: "Borrador",
            }),
            false,
          ),
        ).toEqual({
          type: "disabled",
          label: "No disponible",
        });
      },
    );
  },
);
