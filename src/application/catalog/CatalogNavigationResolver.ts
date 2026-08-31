import {
  hasOfferPrice,
  productBelongsToCategory,
} from "@/domain/product";

import type {
  Product,
} from "@/shared/types/product";

import type {
  CatalogNavigationFilter,
  CatalogNavigationItem,
} from "@/tenant/config/catalog/navigation";

/**
 * Resuelve una única dimensión de navegación contra un producto.
 *
 * Semántica:
 *
 * - all:
 *   navegación global, sin clasificación de dominio.
 *
 * - category:
 *   categoría canónica de producto.
 *
 * - explore-tag:
 *   faceta de descubrimiento independiente de category.
 *
 * - formats:
 *   forma comercial/física del producto.
 *
 * - offer:
 *   estado comercial derivado exclusivamente de una
 *   oferta válida según el dominio de pricing.
 */
export function productMatchesCatalogNavigationFilter(
  product: Product,
  filter: CatalogNavigationFilter,
): boolean {
  switch (filter.kind) {
    case "all":
      return true;

    case "category":
      return productBelongsToCategory(
        product,
        filter.category,
      );

    case "explore-tag":
      return (
        product.explore_tags?.includes(
          filter.tag,
        ) ??
        false
      );

    case "formats":
      return filter.formats.some(
        (format) =>
          product.format ===
          format,
      );

    case "offer":
      return hasOfferPrice(
        product,
      );
  }
}

export function productMatchesCatalogNavigationItem(
  product: Product,
  item: CatalogNavigationItem,
): boolean {
  return productMatchesCatalogNavigationFilter(
    product,
    item.filter,
  );
}

export function filterProductsByCatalogNavigation(
  products: readonly Product[],
  filter: CatalogNavigationFilter,
): Product[] {
  return products.filter(
    (product) =>
      productMatchesCatalogNavigationFilter(
        product,
        filter,
      ),
  );
}
export interface CatalogNavigationSnapshot {
  counts: Record<string, number>;
  visibleItems: CatalogNavigationItem[];
}

/**
 * Construye una proyección de navegación para UI sin
 * volver a interpretar category, explore, format u offer.
 *
 * Todos permanece visible incluso cuando el catálogo
 * está vacío. El resto de items solo aparece si tiene
 * al menos un producto.
 */
export function buildCatalogNavigationSnapshot(
  products: readonly Product[],
  items: readonly CatalogNavigationItem[],
): CatalogNavigationSnapshot {
  const counts =
    items.reduce<
      Record<string, number>
    >(
      (result, item) => {
        result[item.id] =
          products.reduce(
            (
              count,
              product,
            ) =>
              productMatchesCatalogNavigationItem(
                product,
                item,
              )
                ? count + 1
                : count,
            0,
          );

        return result;
      },
      {},
    );

  const visibleItems =
    items.filter(
      (item) =>
        item.filter.kind ===
          "all" ||
        (
          counts[
            item.id
          ] ?? 0
        ) > 0,
    );

  return {
    counts,
    visibleItems,
  };
}
