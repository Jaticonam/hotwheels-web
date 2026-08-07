import type { Category } from "@/shared/types/product";

export interface CatalogCategory extends Category {
  sheetLabel: string;
}

export const CATEGORIES: CatalogCategory[] = [
  {
    id: "todas",
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

export function getCategoryIdFromSheetLabel(
  label?: string | null,
): string {
  if (!label) {
    return "";
  }

  const normalized = label
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  return (
    CATEGORIES.find((category) => {
      const normalizedSheetLabel =
        category.sheetLabel
          .trim()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase();

      return normalizedSheetLabel === normalized;
    })?.id ?? ""
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