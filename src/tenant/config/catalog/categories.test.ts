import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ALL_CATALOG_CATEGORY_ID,
  CANONICAL_PRODUCT_CATEGORIES,
  CATEGORIES,
  LEGACY_PRODUCT_CATEGORIES,
  PRODUCT_CATEGORIES,
  getCategoryById,
  getCategoryIdFromSheetLabel,
  getCategoryName,
  getProductCategoryIdFromSheetLabel,
  isProductCategoryId,
} from "./categories";

describe(
  "Hot Wheels catalog categories",
  () => {
    it("mantiene navegación legacy sin cambios durante CAT-3", () => {
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

    it("define exactamente cuatro categorías canónicas", () => {
      expect(
        CANONICAL_PRODUCT_CATEGORIES.map(
          (category) =>
            category.id,
        ),
      ).toEqual([
        "mainline",
        "silver-series",
        "premium",
        "collector",
      ]);
    });

    it("mantiene todas únicamente como navegación", () => {
      expect(
        ALL_CATALOG_CATEGORY_ID,
      ).toBe("todas");

      expect(
        PRODUCT_CATEGORIES.some(
          (category) =>
            category.id ===
            "todas",
        ),
      ).toBe(false);

      expect(
        isProductCategoryId(
          "todas",
        ),
      ).toBe(false);
    });

    it("acepta categorías canónicas como categorías de producto", () => {
      expect(
        isProductCategoryId(
          "mainline",
        ),
      ).toBe(true);

      expect(
        isProductCategoryId(
          "silver-series",
        ),
      ).toBe(true);

      expect(
        isProductCategoryId(
          "premium",
        ),
      ).toBe(true);

      expect(
        isProductCategoryId(
          "collector",
        ),
      ).toBe(true);
    });

    it("mantiene temporalmente categorías legacy", () => {
      expect(
        isProductCategoryId(
          "clasicos",
        ),
      ).toBe(true);

      expect(
        isProductCategoryId(
          "deportivos",
        ),
      ).toBe(true);

      expect(
        LEGACY_PRODUCT_CATEGORIES.some(
          (category) =>
            category.id ===
            "premium",
        ),
      ).toBe(false);
    });

    it("premium aparece una sola vez en el registro de producto", () => {
      expect(
        PRODUCT_CATEGORIES.filter(
          (category) =>
            category.id ===
            "premium",
        ),
      ).toHaveLength(1);
    });

    it("resuelve Mainline desde Sheets", () => {
      expect(
        getProductCategoryIdFromSheetLabel(
          "Mainline",
        ),
      ).toBe(
        "mainline",
      );

      expect(
        getProductCategoryIdFromSheetLabel(
          "SILVER SERIES",
        ),
      ).toBe(
        "silver-series",
      );
    });

    it("continúa resolviendo etiquetas legacy durante transición", () => {
      expect(
        getProductCategoryIdFromSheetLabel(
          "Clásicos",
        ),
      ).toBe(
        "clasicos",
      );

      expect(
        getProductCategoryIdFromSheetLabel(
          "Deportivos",
        ),
      ).toBe(
        "deportivos",
      );
    });

    it("impide asignar Todos como categoría de producto", () => {
      expect(
        getCategoryIdFromSheetLabel(
          "Todos",
        ),
      ).toBe(
        "todas",
      );

      expect(
        getProductCategoryIdFromSheetLabel(
          "Todos",
        ),
      ).toBe("");
    });

    it("permite resolver metadata visible de categorías canónicas", () => {
      expect(
        getCategoryById(
          "mainline",
        )?.name,
      ).toBe(
        "Mainline",
      );

      expect(
        getCategoryName(
          "collector",
        ),
      ).toBe(
        "Collector",
      );
    });
  },
);
