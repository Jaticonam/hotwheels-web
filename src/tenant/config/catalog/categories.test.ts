import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ALL_CATALOG_CATEGORY_ID,
  CATEGORIES,
  PRODUCT_CATEGORIES,
  getCategoryIdFromSheetLabel,
  getCategoryName,
  getProductCategoryIdFromSheetLabel,
  isProductCategoryId,
} from "./categories";

describe("Hot Wheels catalog categories", () => {
  it("mantiene el orden comercial legacy durante la migración", () => {
    expect(
      CATEGORIES.map(
        (category) =>
          category.id,
      ),
    ).toEqual([
      "todas",
      "deportivos",
      "coleccionables",
      "tematicos",
      "clasicos",
      "premium",
      "x-caja",
      "ofertas",
    ]);
  });

  it("declara todas únicamente como navegación", () => {
    expect(
      ALL_CATALOG_CATEGORY_ID,
    ).toBe("todas");

    expect(
      PRODUCT_CATEGORIES.some(
        (category) =>
          category.id === "todas",
      ),
    ).toBe(false);

    expect(
      isProductCategoryId("todas"),
    ).toBe(false);
  });

  it("mantiene categorías legacy válidas durante la transición", () => {
    expect(
      isProductCategoryId("premium"),
    ).toBe(true);

    expect(
      isProductCategoryId("clasicos"),
    ).toBe(true);
  });

  it("normaliza etiquetas generales de navegación", () => {
    expect(
      getCategoryIdFromSheetLabel(
        "Todos",
      ),
    ).toBe("todas");

    expect(
      getCategoryIdFromSheetLabel(
        "TEMÁTICOS",
      ),
    ).toBe("tematicos");
  });

  it("impide asignar Todos como categoría de producto", () => {
    expect(
      getProductCategoryIdFromSheetLabel(
        "Todos",
      ),
    ).toBe("");

    expect(
      getProductCategoryIdFromSheetLabel(
        "Clásicos",
      ),
    ).toBe("clasicos");

    expect(
      getProductCategoryIdFromSheetLabel(
        "Premium",
      ),
    ).toBe("premium");
  });

  it("devuelve nombre visible desde id", () => {
    expect(
      getCategoryName("premium"),
    ).toBe("Premium");

    expect(
      getCategoryName(
        "categoria-inexistente",
      ),
    ).toBe("Coleccionable");
  });
});
