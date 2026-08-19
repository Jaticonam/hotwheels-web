import {
  productBelongsToCategory,
} from "@/domain/product/categories";

import type {
  Product,
} from "@/shared/types/product";

import {
  isVisibleProductStatus,
} from "@/tenant/config/product/statuses";

export type CatalogCompositionMode =
  | "category"
  | "custom";

/**
 * Contrato de composición comercial.
 *
 * No conoce renderer, storage ni persistencia documental.
 * JUNG CORE podrá materializar este contrato posteriormente.
 */
export interface CatalogComposition {
  schemaVersion: 1;

  mode:
    CatalogCompositionMode;

  title: string;

  /**
   * IDs en el orden comercial final.
   */
  productIds: string[];

  /**
   * Categorías origen cuando mode=category.
   */
  categoryIds: string[];
}

export interface CatalogCompositionResolution {
  composition:
    CatalogComposition;

  /**
   * IDs solicitados que no pueden formar parte
   * de un catálogo comercial.
   */
  excludedProductIds:
    string[];
}

function normalizeUniqueIds(
  values:
  readonly string[],
): string[] {
  const seen =
    new Set<string>();

  const result:
    string[] = [];

  values.forEach(
    (value) => {
      const clean =
        value.trim();

      if (
        !clean ||
        seen.has(clean)
      ) {
        return;
      }

      seen.add(clean);

      result.push(clean);
    },
  );

  return result;
}

function normalizeTitle(
  title: string,
  fallback: string,
): string {
  const clean =
    title.trim();

  return clean ||
    fallback;
}

function isCatalogEligible(
  product: Product,
): boolean {
  return isVisibleProductStatus(
    product.status,
  );
}

/**
 * Composición personalizada.
 *
 * El orden final respeta selectedProductIds.
 */
export function createCustomCatalogComposition(
  products:
  readonly Product[],
  selectedProductIds:
  readonly string[],
  title =
    "Catálogo personalizado",
): CatalogCompositionResolution {
  const requestedIds =
    normalizeUniqueIds(
      selectedProductIds,
    );

  const productsById =
    new Map(
      products.map(
        (product) => [
          product.id,
          product,
        ],
      ),
    );

  const includedIds:
    string[] = [];

  const excludedIds:
    string[] = [];

  requestedIds.forEach(
    (productId) => {
      const product =
        productsById.get(
          productId,
        );

      if (
        !product ||
        !isCatalogEligible(
          product,
        )
      ) {
        excludedIds.push(
          productId,
        );

        return;
      }

      includedIds.push(
        product.id,
      );
    },
  );

  return {
    composition: {
      schemaVersion: 1,

      mode:
        "custom",

      title:
        normalizeTitle(
          title,
          "Catálogo personalizado",
        ),

      productIds:
        includedIds,

      categoryIds: [],
    },

    excludedProductIds:
      excludedIds,
  };
}

/**
 * Composición generada por categorías.
 *
 * Mantiene el orden de productos entregado por la fuente.
 */
export function createCategoryCatalogComposition(
  products:
  readonly Product[],
  selectedCategoryIds:
  readonly string[],
  title =
    "Catálogo por categorías",
): CatalogCompositionResolution {
  const categoryIds =
    normalizeUniqueIds(
      selectedCategoryIds,
    );

  const includeAll =
    categoryIds.includes(
      "todas",
    ) ||
    categoryIds.includes(
      "all",
    );

  const includedIds:
    string[] = [];

  const excludedIds:
    string[] = [];

  products.forEach(
    (product) => {
      const belongs =
        includeAll ||
        categoryIds.some(
          (categoryId) =>
            productBelongsToCategory(
              product,
              categoryId,
            ),
        );

      if (!belongs) {
        return;
      }

      if (
        !isCatalogEligible(
          product,
        )
      ) {
        excludedIds.push(
          product.id,
        );

        return;
      }

      includedIds.push(
        product.id,
      );
    },
  );

  return {
    composition: {
      schemaVersion: 1,

      mode:
        "category",

      title:
        normalizeTitle(
          title,
          "Catálogo por categorías",
        ),

      productIds:
        normalizeUniqueIds(
          includedIds,
        ),

      categoryIds:
        includeAll
          ? ["todas"]
          : categoryIds,
    },

    excludedProductIds:
      normalizeUniqueIds(
        excludedIds,
      ),
  };
}

export function isCatalogCompositionReady(
  composition:
  CatalogComposition,
): boolean {
  return (
    composition.title.trim()
      .length > 0 &&
    composition.productIds
      .length > 0
  );
}
