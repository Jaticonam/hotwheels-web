import {
  describe,
  expect,
  it,
} from "vitest";

import type {
  Product,
} from "@/shared/types/product";

import {
  CATALOG_ALL_NAVIGATION_ITEM,
  CATALOG_BUY_NAVIGATION_ITEMS,
  CATALOG_CATEGORY_NAVIGATION_ITEMS,
  CATALOG_EXPLORE_NAVIGATION_ITEMS,
} from "@/tenant/config/catalog/navigation";

import {
  buildCatalogNavigationSnapshot,
  filterProductsByCatalogNavigation,
  productMatchesCatalogNavigationFilter,
  productMatchesCatalogNavigationItem,
} from "./CatalogNavigationResolver";

function makeProduct(
  overrides: Partial<Product> = {},
): Product {
  return {
    id:
      "HW-001",

    title:
      "Hot Wheels Test",

    description:
      "",

    category:
      "mainline",

    categories: [
      "mainline",
    ],

    price:
      20,

    offer_price:
      null,

    stock:
      1,

    img:
      "",

    priority:
      0,

    status:
      "Publicado",

    badges:
      [],

    attributes:
      [],

    explore_tags:
      [],

    format:
      "single",

    rarity:
      "",

    ...overrides,
  };
}

describe(
  "CatalogNavigationResolver",
  () => {
    it("Todos incluye cualquier producto", () => {
      const product =
        makeProduct();

      expect(
        productMatchesCatalogNavigationItem(
          product,
          CATALOG_ALL_NAVIGATION_ITEM,
        ),
      ).toBe(true);
    });

    it("resuelve categorías mediante productBelongsToCategory", () => {
      const mainline =
        makeProduct({
          category:
            "mainline",

          categories: [
            "mainline",
          ],
        });

      const premium =
        makeProduct({
          category:
            "premium",

          categories: [
            "premium",
          ],
        });

      const mainlineItem =
        CATALOG_CATEGORY_NAVIGATION_ITEMS.find(
          (item) =>
            item.id ===
            "mainline",
        );

      expect(
        mainlineItem,
      ).toBeDefined();

      expect(
        productMatchesCatalogNavigationItem(
          mainline,
          mainlineItem!,
        ),
      ).toBe(true);

      expect(
        productMatchesCatalogNavigationItem(
          premium,
          mainlineItem!,
        ),
      ).toBe(false);
    });

    it("mantiene explore-tag separado de category", () => {
      const product =
        makeProduct({
          category:
            "mainline",

          categories: [
            "mainline",
          ],

          explore_tags: [
            "jdm",
          ],
        });

      const jdmItem =
        CATALOG_EXPLORE_NAVIGATION_ITEMS.find(
          (item) =>
            item.id ===
            "jdm",
        );

      expect(
        jdmItem,
      ).toBeDefined();

      expect(
        productMatchesCatalogNavigationItem(
          product,
          jdmItem!,
        ),
      ).toBe(true);

      expect(
        product.categories,
      ).not.toContain(
        "jdm",
      );
    });

    it("no encuentra explore-tag ausente", () => {
      const product =
        makeProduct({
          explore_tags: [
            "jdm",
          ],
        });

      expect(
        productMatchesCatalogNavigationFilter(
          product,
          {
            kind:
              "explore-tag",

            tag:
              "clasicos",
          },
        ),
      ).toBe(false);
    });

    it("resuelve Individuales desde format=single", () => {
      const product =
        makeProduct({
          format:
            "single",
        });

      const individuales =
        CATALOG_BUY_NAVIGATION_ITEMS.find(
          (item) =>
            item.id ===
            "individuales",
        );

      expect(
        individuales,
      ).toBeDefined();

      expect(
        productMatchesCatalogNavigationItem(
          product,
          individuales!,
        ),
      ).toBe(true);
    });

    it("agrupa packs y sets por formatos", () => {
      const fivePack =
        makeProduct({
          format:
            "5-pack",
        });

      const teamTransport =
        makeProduct({
          id:
            "HW-002",

          format:
            "team-transport",
        });

      const single =
        makeProduct({
          id:
            "HW-003",

          format:
            "single",
        });

      const packs =
        CATALOG_BUY_NAVIGATION_ITEMS.find(
          (item) =>
            item.id ===
            "packs-sets",
        );

      expect(
        packs,
      ).toBeDefined();

      expect(
        productMatchesCatalogNavigationItem(
          fivePack,
          packs!,
        ),
      ).toBe(true);

      expect(
        productMatchesCatalogNavigationItem(
          teamTransport,
          packs!,
        ),
      ).toBe(true);

      expect(
        productMatchesCatalogNavigationItem(
          single,
          packs!,
        ),
      ).toBe(false);
    });

    it("resuelve Cajas exclusivamente desde format=case", () => {
      const caseProduct =
        makeProduct({
          format:
            "case",
        });

      const cajas =
        CATALOG_BUY_NAVIGATION_ITEMS.find(
          (item) =>
            item.id ===
            "cajas",
        );

      expect(
        cajas,
      ).toBeDefined();

      expect(
        productMatchesCatalogNavigationItem(
          caseProduct,
          cajas!,
        ),
      ).toBe(true);

      expect(
        productMatchesCatalogNavigationItem(
          makeProduct({
            format:
              "single",
          }),
          cajas!,
        ),
      ).toBe(false);
    });

    it("resuelve Ofertas usando hasOfferPrice", () => {
      const offerItem =
        CATALOG_BUY_NAVIGATION_ITEMS.find(
          (item) =>
            item.id ===
            "ofertas",
        );

      expect(
        offerItem,
      ).toBeDefined();

      expect(
        productMatchesCatalogNavigationItem(
          makeProduct({
            price:
              20,

            offer_price:
              15,
          }),
          offerItem!,
        ),
      ).toBe(true);

      expect(
        productMatchesCatalogNavigationItem(
          makeProduct({
            price:
              20,

            offer_price:
              25,
          }),
          offerItem!,
        ),
      ).toBe(false);

      expect(
        productMatchesCatalogNavigationItem(
          makeProduct({
            offer_price:
              null,
          }),
          offerItem!,
        ),
      ).toBe(false);
    });

    it("filtra una colección sin alterar el orden original", () => {
      const products = [
        makeProduct({
          id:
            "A",

          explore_tags: [
            "jdm",
          ],
        }),

        makeProduct({
          id:
            "B",

          explore_tags: [
            "clasicos",
          ],
        }),

        makeProduct({
          id:
            "C",

          explore_tags: [
            "jdm",
          ],
        }),
      ];

      const filtered =
        filterProductsByCatalogNavigation(
          products,
          {
            kind:
              "explore-tag",

            tag:
              "jdm",
          },
        );

      expect(
        filtered.map(
          (product) =>
            product.id,
        ),
      ).toEqual([
        "A",
        "C",
      ]);

      expect(
        products.map(
          (product) =>
            product.id,
        ),
      ).toEqual([
        "A",
        "B",
        "C",
      ]);
    });

    it("un producto puede pertenecer simultáneamente a categoría, explorar y comprar sin mezclar dimensiones", () => {
      const product =
        makeProduct({
          category:
            "mainline",

          categories: [
            "mainline",
          ],

          explore_tags: [
            "jdm",
          ],

          format:
            "single",

          price:
            20,

          offer_price:
            15,
        });

      expect(
        productMatchesCatalogNavigationFilter(
          product,
          {
            kind:
              "category",

            category:
              "mainline",
          },
        ),
      ).toBe(true);

      expect(
        productMatchesCatalogNavigationFilter(
          product,
          {
            kind:
              "explore-tag",

            tag:
              "jdm",
          },
        ),
      ).toBe(true);

      expect(
        productMatchesCatalogNavigationFilter(
          product,
          {
            kind:
              "formats",

            formats: [
              "single",
            ],
          },
        ),
      ).toBe(true);

      expect(
        productMatchesCatalogNavigationFilter(
          product,
          {
            kind:
              "offer",
          },
        ),
      ).toBe(true);
    });

    it("construye conteos y visibilidad usando el resolver único", () => {
      const products = [
        makeProduct({
          id:
            "A",

          category:
            "mainline",

          categories: [
            "mainline",
          ],
        }),

        makeProduct({
          id:
            "B",

          category:
            "mainline",

          categories: [
            "mainline",
          ],

          explore_tags: [
            "jdm",
          ],
        }),
      ];

      const snapshot =
        buildCatalogNavigationSnapshot(
          products,
          [
            CATALOG_ALL_NAVIGATION_ITEM,
            ...CATALOG_CATEGORY_NAVIGATION_ITEMS,
          ],
        );

      expect(
        snapshot.counts,
      ).toMatchObject({
        todos:
          2,

        mainline:
          2,

        "silver-series":
          0,

        premium:
          0,

        collector:
          0,
      });

      expect(
        snapshot.visibleItems.map(
          (item) =>
            item.id,
        ),
      ).toEqual([
        "todos",
        "mainline",
      ]);
    });

    it("mantiene Todos visible aunque el catálogo esté vacío", () => {
      const snapshot =
        buildCatalogNavigationSnapshot(
          [],
          [
            CATALOG_ALL_NAVIGATION_ITEM,
            ...CATALOG_CATEGORY_NAVIGATION_ITEMS,
          ],
        );

      expect(
        snapshot.counts.todos,
      ).toBe(0);

      expect(
        snapshot.visibleItems.map(
          (item) =>
            item.id,
        ),
      ).toEqual([
        "todos",
      ]);
    });
  },
);
