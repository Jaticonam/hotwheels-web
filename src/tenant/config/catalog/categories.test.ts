import {
  describe,
  expect,
  it,
} from "vitest";

import {
  CATEGORIES,
  getCategoryIdFromSheetLabel,
  getCategoryName,
} from "./categories";

describe("Hot Wheels catalog categories", () => {
  it("mantiene el orden comercial oficial", () => {
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

  it("normaliza etiquetas humanas de Sheets", () => {
    expect(
      getCategoryIdFromSheetLabel(
        "Deportivos",
      ),
    ).toBe("deportivos");

    expect(
      getCategoryIdFromSheetLabel(
        "TEMÁTICOS",
      ),
    ).toBe("tematicos");

    expect(
      getCategoryIdFromSheetLabel(
        "Clásicos",
      ),
    ).toBe("clasicos");

    expect(
      getCategoryIdFromSheetLabel(
        "x Caja",
      ),
    ).toBe("x-caja");
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