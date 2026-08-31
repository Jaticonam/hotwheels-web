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
 * Configuración legacy vigente del catálogo.
 *
 * CAT-1B solo separa navegación de clasificación.
 * La migración a Mainline / Silver Series /
 * Premium / Collector se realizará posteriormente.
 */
export const CATEGORIES: CatalogCategory[] = [
  {
    id: ALL_CATALOG_CATEGORY_ID,
    name: "Todos",
    sheetLabel: "Todos",
    icon: "🏁",
    description: "Explora todos los autos disponibles en el catálogo.",
  },
  {
    id: "deportivos",
    name: "Deportivos",
    sheetLabel: "Deportivos",
    icon: "🏎️",
    description: "Velocidad, diseño y alto desempeño.",
  },
  {
    id: "coleccionables",
    name: "Coleccionables",
    sheetLabel: "Coleccionables",
    icon: "💎",
    description: "Piezas que destacan dentro de una colección.",
  },
  {
    id: "tematicos",
    name: "Temáticos",
    sheetLabel: "Temáticos",
    icon: "🎬",
    description: "Modelos inspirados en personajes y franquicias.",
  },
  {
    id: "clasicos",
    name: "Clásicos",
    sheetLabel: "Clásicos",
    icon: "🚗",
    description: "Diseños legendarios que nunca pasan de moda.",
  },
  {
    id: "premium",
    name: "Premium",
    sheetLabel: "Premium",
    icon: "✨",
    description: "Mayor detalle, acabados y presentaciones especiales.",
  },
  {
    id: "x-caja",
    name: "x Caja",
    sheetLabel: "x Caja",
    icon: "📦",
    description: "Opciones disponibles para compra por caja.",
  },
  {
    id: "ofertas",
    name: "Ofertas",
    sheetLabel: "Ofertas",
    icon: "🔥",
    description: "Oportunidades y precios especiales disponibles.",
  },
];

/**
 * Categorías que pueden asignarse temporalmente a productos
 * mientras se completa la migración Taxonomy 1.0.
 *
 * Importante:
 * - excluye "todas";
 * - x-caja y ofertas permanecen solo por compatibilidad legacy
 *   hasta su migración a formato/estado comercial.
 */
export const PRODUCT_CATEGORIES:
  CatalogCategory[] =
  CATEGORIES.filter(
    (category) =>
      category.id !==
      ALL_CATALOG_CATEGORY_ID,
  );

function normalizeCategoryLabel(
  value: string,
): string {
  return value
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function getCategoryById(
  categoryId?: string | null,
): CatalogCategory | null {
  if (!categoryId) {
    return null;
  }

  return (
    CATEGORIES.find(
      (category) =>
        category.id === categoryId,
    ) ?? null
  );
}

/**
 * Resolver general.
 *
 * Incluye opciones de navegación como "Todos".
 */
export function getCategoryIdFromSheetLabel(
  label?: string | null,
): string {
  if (!label) {
    return "";
  }

  const normalized =
    normalizeCategoryLabel(label);

  return (
    CATEGORIES.find(
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
    getCategoryById(categoryId)?.name ??
    "Coleccionable"
  );
}
