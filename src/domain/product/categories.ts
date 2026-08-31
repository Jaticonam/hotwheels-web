import type {
  Product,
} from "@/shared/types/product";

import {
  isLegacyExploreTagId,
} from "./LegacyTaxonomyMigration";

/**
 * Determina pertenencia para navegación de catálogo.
 *
 * Prioridad:
 *
 * 1. "todas" es navegación global.
 * 2. categories contiene categorías reales/canónicas.
 * 3. Durante CAT-3/CAT-5 las antiguas facetas de navegación
 *    pueden resolverse desde explore_tags.
 *
 * explore_tags NO convierte esas facetas nuevamente
 * en categorías de producto.
 */
export function productBelongsToCategory(
  product: Product,
  categoryId: string,
): boolean {
  if (
    categoryId === "todas"
  ) {
    return true;
  }

  if (
    product.categories.includes(
      categoryId,
    )
  ) {
    return true;
  }

  if (
    isLegacyExploreTagId(
      categoryId,
    )
  ) {
    return (
      product.explore_tags?.includes(
        categoryId,
      ) ??
      false
    );
  }

  return false;
}
