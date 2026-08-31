import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import type {
  SheetProduct,
} from "./normalizeProduct";

import {
  validateProducts,
} from "./validateProducts";

function createProduct(
  overrides: Partial<SheetProduct> = {},
): SheetProduct {
  return {
    id: "HW-001",
    title: "Hot Wheels Test",
    description: "",
    category: "premium",
    categories: ["premium"],
    price: 10,
    offer_price: null,
    stock: 1,
    img: "/test.jpg",
    images: [],
    priority: 0,
    status: "Publicado",
    badges: [],
    attributes: [],
    ...overrides,
  };
}

describe("validateProducts categories", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("nunca convierte una categoría inválida en todas", () => {
    vi.spyOn(
      console,
      "warn",
    ).mockImplementation(
      () => undefined,
    );

    const [product] =
      validateProducts([
        createProduct({
          category: "todas",
          categories: ["todas"],
        }),
      ]);

    expect(product.category)
      .toBe("");

    expect(product.categories)
      .toEqual([]);
  });

  it("promueve una categoría secundaria válida", () => {
    vi.spyOn(
      console,
      "warn",
    ).mockImplementation(
      () => undefined,
    );

    const [product] =
      validateProducts([
        createProduct({
          category:
            "categoria-invalida",
          categories: [
            "categoria-invalida",
            "premium",
          ],
        }),
      ]);

    expect(product.category)
      .toBe("premium");

    expect(product.categories)
      .toEqual(["premium"]);
  });

  it("mantiene producto visible pero sin clasificación cuando no puede determinarla", () => {
    vi.spyOn(
      console,
      "warn",
    ).mockImplementation(
      () => undefined,
    );

    const result =
      validateProducts([
        createProduct({
          category: "",
          categories: [],
        }),
      ]);

    expect(result)
      .toHaveLength(1);

    expect(result[0].category)
      .toBe("");

    expect(result[0].categories)
      .toEqual([]);
  });
});
