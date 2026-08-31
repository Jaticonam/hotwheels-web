import {
  describe,
  expect,
  it,
} from "vitest";

import {
  PRODUCT_LEGACY_HEADERS,
  PRODUCT_REQUIRED_HEADERS,
  PRODUCT_SUPPORTED_HEADERS,
  PRODUCT_TAXONOMY_HEADERS,
} from "./productSheetSchema";

describe("Hot Wheels product sheet schema", () => {
  it("mantiene mínimo técnico pequeño para no bloquear ventas", () => {
    expect(
      PRODUCT_REQUIRED_HEADERS,
    ).toEqual([
      "id",
      "title",
      "price",
      "status",
    ]);
  });

  it("declara las dimensiones Taxonomy 1.0", () => {
    expect(
      PRODUCT_TAXONOMY_HEADERS,
    ).toEqual([
      "series",
      "collection",
      "set_number",
      "format",
      "rarity",
      "manufacturer",
      "franchise",
      "style",
      "exclusivity",
    ]);
  });

  it("mantiene mini_series únicamente como compatibilidad legacy", () => {
    expect(
      PRODUCT_LEGACY_HEADERS,
    ).toEqual([
      "mini_series",
    ]);

    expect(
      PRODUCT_TAXONOMY_HEADERS,
    ).not.toContain(
      "mini_series",
    );
  });

  it("declara todas las columnas consumidas o previstas", () => {
    expect(
      PRODUCT_SUPPORTED_HEADERS,
    ).toEqual(
      expect.arrayContaining([
        "category",
        "categories",
        "images",
        "attributes",
        "updated_at",
        "year",
        "case_code",
        "card_number",
        "series",
        "collection",
        "set_number",
        "format",
        "rarity",
        "manufacturer",
        "franchise",
        "style",
        "exclusivity",
        "mini_series",
      ]),
    );
  });

  it("no contiene encabezados duplicados", () => {
    expect(
      new Set(
        PRODUCT_SUPPORTED_HEADERS,
      ).size,
    ).toBe(
      PRODUCT_SUPPORTED_HEADERS.length,
    );
  });
});
