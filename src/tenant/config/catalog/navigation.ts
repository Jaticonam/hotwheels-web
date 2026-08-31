import type {
  HotWheelsCategoryId,
  HotWheelsFormatId,
} from "@/domain/product/Taxonomy";

export type CatalogNavigationSectionId =
  | "categories"
  | "explore"
  | "buy";

export type CatalogNavigationFilter =
  | {
      kind: "all";
    }
  | {
      kind: "category";
      category: HotWheelsCategoryId;
    }
  | {
      kind: "explore-tag";
      tag: string;
    }
  | {
      kind: "formats";
      formats: readonly HotWheelsFormatId[];
    }
  | {
      kind: "offer";
    };

export interface CatalogNavigationItem {
  id: string;
  label: string;
  filter: CatalogNavigationFilter;
}

export interface CatalogNavigationSection {
  id: CatalogNavigationSectionId;
  label: string;
  items: readonly CatalogNavigationItem[];
}

/**
 * "Todos" pertenece exclusivamente a navegación/UI.
 * Nunca representa una categoría de producto.
 */
export const CATALOG_ALL_NAVIGATION_ITEM:
  CatalogNavigationItem = {
    id: "todos",
    label: "Todos",
    filter: {
      kind: "all",
    },
  };

/**
 * ¿Qué es el producto?
 *
 * Solo categorías canónicas Taxonomy 1.0.
 */
export const CATALOG_CATEGORY_NAVIGATION_ITEMS:
  readonly CatalogNavigationItem[] = [
    {
      id: "mainline",
      label: "Mainline",
      filter: {
        kind: "category",
        category: "mainline",
      },
    },
    {
      id: "silver-series",
      label: "Silver Series",
      filter: {
        kind: "category",
        category: "silver-series",
      },
    },
    {
      id: "premium",
      label: "Premium",
      filter: {
        kind: "category",
        category: "premium",
      },
    },
    {
      id: "collector",
      label: "Collector",
      filter: {
        kind: "category",
        category: "collector",
      },
    },
  ];

/**
 * ¿Qué me interesa?
 *
 * Primera capa transicional basada en los explore_tags
 * preservados desde la clasificación legacy.
 *
 * Manufacturer, franchise, series, rarity y otras
 * dimensiones podrán ampliar esta sección después,
 * sin volver a convertirlas en categorías.
 */
export const CATALOG_EXPLORE_NAVIGATION_ITEMS:
  readonly CatalogNavigationItem[] = [
    {
      id: "jdm",
      label: "JDM",
      filter: {
        kind: "explore-tag",
        tag: "jdm",
      },
    },
    {
      id: "clasicos",
      label: "Clásicos",
      filter: {
        kind: "explore-tag",
        tag: "clasicos",
      },
    },
    {
      id: "deportivos",
      label: "Deportivos",
      filter: {
        kind: "explore-tag",
        tag: "deportivos",
      },
    },
    {
      id: "fantasia",
      label: "Fantasía",
      filter: {
        kind: "explore-tag",
        tag: "fantasia",
      },
    },
    {
      id: "racing",
      label: "Racing",
      filter: {
        kind: "explore-tag",
        tag: "racing",
      },
    },
    {
      id: "truck",
      label: "Truck",
      filter: {
        kind: "explore-tag",
        tag: "truck",
      },
    },
    {
      id: "tematicos",
      label: "Temáticos",
      filter: {
        kind: "explore-tag",
        tag: "tematicos",
      },
    },
    {
      id: "coleccionables",
      label: "Coleccionables",
      filter: {
        kind: "explore-tag",
        tag: "coleccionables",
      },
    },
  ];

/**
 * ¿Cómo lo quiero comprar?
 *
 * Format y estado comercial son dimensiones separadas
 * de category.
 */
export const CATALOG_BUY_NAVIGATION_ITEMS:
  readonly CatalogNavigationItem[] = [
    {
      id: "individuales",
      label: "Individuales",
      filter: {
        kind: "formats",
        formats: [
          "single",
        ],
      },
    },
    {
      id: "packs-sets",
      label: "Packs & Sets",
      filter: {
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
      },
    },
    {
      id: "cajas",
      label: "Cajas",
      filter: {
        kind: "formats",
        formats: [
          "case",
        ],
      },
    },
    {
      id: "ofertas",
      label: "Ofertas",
      filter: {
        kind: "offer",
      },
    },
  ];

export const CATALOG_NAVIGATION_SECTIONS:
  readonly CatalogNavigationSection[] = [
    {
      id: "categories",
      label: "Categorías",
      items:
        CATALOG_CATEGORY_NAVIGATION_ITEMS,
    },
    {
      id: "explore",
      label: "Explorar",
      items:
        CATALOG_EXPLORE_NAVIGATION_ITEMS,
    },
    {
      id: "buy",
      label: "Comprar",
      items:
        CATALOG_BUY_NAVIGATION_ITEMS,
    },
  ];
