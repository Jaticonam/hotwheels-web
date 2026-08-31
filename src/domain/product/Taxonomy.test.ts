import {
  describe,
  expect,
  it,
} from "vitest";

import {
  HOT_WHEELS_CATEGORY_IDS,
  HOT_WHEELS_FORMAT_IDS,
  HOT_WHEELS_RARITY_IDS,
  isHotWheelsCategoryId,
  isHotWheelsFormatId,
  isHotWheelsRarityId,
} from "./Taxonomy";

describe("Hot Wheels Taxonomy 1.0", () => {
  it("define las cuatro categorías canónicas", () => {
    expect(
      HOT_WHEELS_CATEGORY_IDS,
    ).toEqual([
      "mainline",
      "silver-series",
      "premium",
      "collector",
    ]);
  });

  it("no confunde navegación o estados comerciales con categorías", () => {
    expect(
      isHotWheelsCategoryId("todas"),
    ).toBe(false);

    expect(
      isHotWheelsCategoryId("ofertas"),
    ).toBe(false);

    expect(
      isHotWheelsCategoryId("x-caja"),
    ).toBe(false);

    expect(
      isHotWheelsCategoryId("clasicos"),
    ).toBe(false);
  });

  it("reconoce las categorías oficiales", () => {
    expect(
      isHotWheelsCategoryId("mainline"),
    ).toBe(true);

    expect(
      isHotWheelsCategoryId("silver-series"),
    ).toBe(true);

    expect(
      isHotWheelsCategoryId("premium"),
    ).toBe(true);

    expect(
      isHotWheelsCategoryId("collector"),
    ).toBe(true);
  });

  it("define formatos independientes de categoría", () => {
    expect(
      HOT_WHEELS_FORMAT_IDS,
    ).toContain("single");

    expect(
      HOT_WHEELS_FORMAT_IDS,
    ).toContain("case");

    expect(
      HOT_WHEELS_FORMAT_IDS,
    ).toContain("team-transport");

    expect(
      isHotWheelsFormatId("case"),
    ).toBe(true);
  });

  it("define rareza independiente de categoría", () => {
    expect(
      HOT_WHEELS_RARITY_IDS,
    ).toEqual([
      "regular",
      "treasure-hunt",
      "super-treasure-hunt",
      "chase",
    ]);

    expect(
      isHotWheelsRarityId(
        "super-treasure-hunt",
      ),
    ).toBe(true);
  });
});
