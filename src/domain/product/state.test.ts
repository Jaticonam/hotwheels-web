import { describe, expect, it } from "vitest";

import type { Product } from "@/shared/types/product";

import { getProductState } from "./state";

const baseProduct: Product = {
  id: "HWC26060",
  title: "Ferrari SF90 Stradale Ferrari 1/5 2026",
  description: "",
  category: "deportivos",
  categories: ["deportivos"],
  price: 24.9,
  offer_price: null,
  stock: 7,
  img: "",
  images: [],
  priority: 0,
  status: "Publicado",
  badges: [],
  attributes: [],
};

describe("getProductState stock semantics", () => {
  it("marca stock 0 como agotado", () => {
    expect(
      getProductState({
        ...baseProduct,
        stock: 0,
      }),
    ).toMatchObject({
      type: "sold-out",
      label: "Agotado",
      available: false,
    });
  });

  it("marca stock 1 como última unidad", () => {
    expect(
      getProductState({
        ...baseProduct,
        stock: 1,
      }),
    ).toMatchObject({
      type: "last-units",
      label: "Última unidad",
      available: true,
    });
  });

  it("marca stock 2 y 3 como pocas unidades", () => {
    for (const stock of [2, 3]) {
      expect(
        getProductState({
          ...baseProduct,
          stock,
        }),
      ).toMatchObject({
        type: "limited",
        label: "Pocas unidades",
        available: true,
      });
    }
  });

  it("marca stock 4 o mayor como disponible", () => {
    for (const stock of [4, 7, 10, 25]) {
      expect(
        getProductState({
          ...baseProduct,
          stock,
        }),
      ).toMatchObject({
        type: "available",
        label: "Disponible",
        available: true,
      });
    }
  });
});