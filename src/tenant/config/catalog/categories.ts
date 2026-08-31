import type { Category } from "@/shared/types/product";

export interface CatalogCategory extends Category {
  sheetLabel: string;
}

/**
 * Selector global de navegación.
 *
 * "todas" NO representa una categoría real de producto.
 */
export const ALL_CATALOG_CATEGORY_ID =
  "todas" as const;

/**
 * Taxonomía oficial Hot Wheels 1.0.
 *
 * Estas son las únicas categorías canónicas
 * para nuevos productos.
 */
export const CANONICAL_PRODUCT_CATEGORIES:
  CatalogCategory[] = [
    {
      id: "mainline",
      name: "Mainline",
      sheetLabel: "Mainline",
      icon: "🏁",
      description:
        "Línea principal Hot Wheels.",
    },
    {
      id: "silver-series",
      name: "Silver Series",
      sheetLabel: "Silver Series",
      icon: "🥈",
      description:
        "Series especiales Silver Series.",
    },
    {
      id: "premium",
      name: "Premium",
      sheetLabel: "Premium",
      icon: "✨",
      description:
        "Líneas Hot Wheels Premium.",
    },
    {
      id: "collector",
      name: "Collector",
      sheetLabel: "Collector",
      icon: "💎",
      description:
        "Líneas orientadas al coleccionista.",
    },
  ];

/**
 * Navegación legacy vigente.
 *
 * CAT-3B1 NO cambia todavía la experiencia pública.
 * Estas opciones se retirarán o reclasificarán
 * progresivamente en CAT-5.
 */
export const CATEGORIES:
  CatalogCategory[] = [
    {
      id: ALL_CATALOG_CATEGORY_ID,
      name: "Todos",
      sheetLabel: "Todos",
      icon: "🏁",
      description:
        "Explora todos los autos disponibles en el catálogo.",
    },
    {
      id: "deportivos",
      name: "Deportivos",
      sheetLabel: "Deportivos",
      icon: "🏎️",
      description:
        "Velocidad, diseño y alto desempeño.",
    },
    {
      id: "coleccionables",
      name: "Coleccionables",
      sheetLabel: "Coleccionables",
      icon: "💎",
      description:
        "Piezas que destacan dentro de una colección.",
    },
    {
      id: "tematicos",
      name: "Temáticos",
      sheetLabel: "Temáticos",
      icon: "🎬",
      description:
        "Modelos inspirados en personajes y franquicias.",
    },
    {
      id: "clasicos",
      name: "Clásicos",
      sheetLabel: "Clásicos",
      icon: "🚗",
      description:
        "Diseños legendarios que nunca pasan de moda.",
    },
    {
      id: "premium",
      name: "Premium",
      sheetLabel: "Premium",
      icon: "✨",
      description:
        "Mayor detalle, acabados y presentaciones especiales.",
    },
    {
      id: "x-caja",
      name: "x Caja",
      sheetLabel: "x Caja",
      icon: "📦",
      description:
        "Opciones disponibles para compra por caja.",
    },
    {
      id: "ofertas",
      name: "Ofertas",
      sheetLabel: "Ofertas",
      icon: "🔥",
      description:
        "Oportunidades y precios especiales disponibles.",
    },
  ];

/**
 * Clasificaciones legacy todavía aceptadas
 * durante la transición.
 *
 * Se excluye:
 * - "todas" porque es navegación;
 * - "premium" porque ya existe como categoría canónica.
 */
export const LEGACY_PRODUCT_CATEGORIES:
  CatalogCategory[] =
  CATEGORIES.filter(
    (category) =>
      category.id !==
        ALL_CATALOG_CATEGORY_ID &&
      category.id !==
        "premium",
  );

/**
 * Registro transitorio aceptado por integraciones
 * y Validator.
 *
 * Nuevos datos:
 *   canonical only.
 *
 * Datos existentes:
 *   canonical + legacy durante migración.
 */
export const PRODUCT_CATEGORIES:
  CatalogCategory[] = [
    ...CANONICAL_PRODUCT_CATEGORIES,
    ...LEGACY_PRODUCT_CATEGORIES,
  ];

function normalizeCategoryLabel(
  value: string,
): string {
  return value
    .trim()
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      "",
    )
    .toLowerCase();
}

export function getCategoryById(
  categoryId?: string | null,
): CatalogCategory | null {
  if (!categoryId) {
    return null;
  }

  return (
    CANONICAL_PRODUCT_CATEGORIES.find(
      (category) =>
        category.id === categoryId,
    ) ??
    CATEGORIES.find(
      (category) =>
        category.id === categoryId,
    ) ??
    null
  );
}

/**
 * Resolver general de UI.
 *
 * Puede devolver "todas".
 */
export function getCategoryIdFromSheetLabel(
  label?: string | null,
): string {
  if (!label) {
    return "";
  }

  const normalized =
    normalizeCategoryLabel(label);

  const allCategories = [
    ...CATEGORIES,
    ...CANONICAL_PRODUCT_CATEGORIES,
  ];

  return (
    allCategories.find(
      (category) =>
        normalizeCategoryLabel(
          category.sheetLabel,
        ) === normalized,
    )?.id ?? ""
  );
}

/**
 * Resolver exclusivo para productos.
 *
 * Nunca devuelve "todas".
 * Durante CAT-3 acepta canonical + legacy.
 */
export function getProductCategoryIdFromSheetLabel(
  label?: string | null,
): string {
  if (!label) {
    return "";
  }

  const normalized =
    normalizeCategoryLabel(label);

  return (
    PRODUCT_CATEGORIES.find(
      (category) =>
        normalizeCategoryLabel(
          category.sheetLabel,
        ) === normalized,
    )?.id ?? ""
  );
}

export function isProductCategoryId(
  categoryId?: string | null,
): boolean {
  if (!categoryId) {
    return false;
  }

  return PRODUCT_CATEGORIES.some(
    (category) =>
      category.id === categoryId,
  );
}

export function getCategoryName(
  categoryId?: string | null,
): string {
  return (
    getCategoryById(
      categoryId,
    )?.name ??
    "Coleccionable"
  );
}
