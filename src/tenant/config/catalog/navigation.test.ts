import {
  describe,
  expect,
  it,
} from "vitest";

import {
  CATALOG_ALL_NAVIGATION_ITEM,
  CATALOG_BUY_NAVIGATION_ITEMS,
  CATALOG_CATEGORY_NAVIGATION_ITEMS,
  CATALOG_EXPLORE_NAVIGATION_ITEMS,
  CATALOG_NAVIGATION_SECTIONS,
} from "./navigation";

describe(
  "Hot Wheels Catalog Navigation",
  () => {
    it("mantiene Todos como navegación y no como categoría", () => {
      expect(
        CATALOG_ALL_NAVIGATION_ITEM,
      ).toEqual({
        id: "todos",
        label: "Todos",
        filter: {
          kind: "all",
        },
      });

      expect(
        CATALOG_CATEGORY_NAVIGATION_ITEMS.some(
          (item) =>
            item.id ===
            "todos",
        ),
      ).toBe(false);
    });

    it("define únicamente las cuatro categorías canónicas", () => {
      expect(
        CATALOG_CATEGORY_NAVIGATION_ITEMS.map(
          (item) =>
            item.id,
        ),
      ).toEqual([
        "mainline",
        "silver-series",
        "premium",
        "collector",
      ]);

      expect(
        CATALOG_CATEGORY_NAVIGATION_ITEMS.map(
          (item) =>
            item.filter.kind,
        ),
      ).toEqual([
        "category",
        "category",
        "category",
        "category",
      ]);
    });

    it("separa las facetas legacy dentro de Explorar", () => {
      expect(
        CATALOG_EXPLORE_NAVIGATION_ITEMS.map(
          (item) =>
            item.id,
        ),
      ).toEqual([
        "jdm",
        "clasicos",
        "deportivos",
        "fantasia",
        "racing",
        "truck",
        "tematicos",
        "coleccionables",
      ]);

      expect(
        CATALOG_EXPLORE_NAVIGATION_ITEMS.every(
          (item) =>
            item.filter.kind ===
            "explore-tag",
        ),
      ).toBe(true);
    });

    it("no convierte x-caja, ofertas o premium en explore tags", () => {
      const exploreIds =
        CATALOG_EXPLORE_NAVIGATION_ITEMS.map(
          (item) =>
            item.id,
        );

      expect(
        exploreIds,
      ).not.toContain(
        "x-caja",
      );

      expect(
        exploreIds,
      ).not.toContain(
        "ofertas",
      );

      expect(
        exploreIds,
      ).not.toContain(
        "premium",
      );
    });

    it("separa Individuales, Packs & Sets, Cajas y Ofertas", () => {
      expect(
        CATALOG_BUY_NAVIGATION_ITEMS.map(
          (item) =>
            item.id,
        ),
      ).toEqual([
        "individuales",
        "packs-sets",
        "cajas",
        "ofertas",
      ]);

      expect(
        CATALOG_BUY_NAVIGATION_ITEMS[0]
          .filter,
      ).toEqual({
        kind: "formats",
        formats: [
          "single",
        ],
      });

      expect(
        CATALOG_BUY_NAVIGATION_ITEMS[2]
          .filter,
      ).toEqual({
        kind: "formats",
        formats: [
          "case",
        ],
      });

      expect(
        CATALOG_BUY_NAVIGATION_ITEMS[3]
          .filter,
      ).toEqual({
        kind: "offer",
      });
    });

    it("agrupa todos los formatos pack/set sin mezclarlos con cajas", () => {
      expect(
        CATALOG_BUY_NAVIGATION_ITEMS[1]
          .filter,
      ).toEqual({
        kind: "formats",
        formats: [
          "2-pack",
          "3-pack",
          "5-pack",
          "6-pack",
          "multipack",
          "team-transport",
          "display-set",
        ],
      });
    });

    it("expone exactamente las tres secciones semánticas", () => {
      expect(
        CATALOG_NAVIGATION_SECTIONS.map(
          (section) =>
            section.id,
        ),
      ).toEqual([
        "categories",
        "explore",
        "buy",
      ]);

      expect(
        CATALOG_NAVIGATION_SECTIONS.map(
          (section) =>
            section.label,
        ),
      ).toEqual([
        "Categorías",
        "Explorar",
        "Comprar",
      ]);
    });

    it("no repite ids dentro del contrato global", () => {
      const ids = [
        CATALOG_ALL_NAVIGATION_ITEM.id,
        ...CATALOG_NAVIGATION_SECTIONS.flatMap(
          (section) =>
            section.items.map(
              (item) =>
                item.id,
            ),
        ),
      ];

      expect(
        new Set(
          ids,
        ).size,
      ).toBe(
        ids.length,
      );
    });
  },
);
