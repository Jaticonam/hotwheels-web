import type {
  CatalogComposition,
} from "@/application/catalog/CatalogComposition";

import type {
  Product,
} from "@/shared/types/product";

export interface CatalogPreviewResolution {
  products:
    Product[];

  pages:
    Product[][];

  missingProductIds:
    string[];
}

function normalizePageSize(
  pageSize: number,
): number {
  if (
    !Number.isInteger(
      pageSize,
    ) ||
    pageSize <= 0
  ) {
    return 6;
  }

  return pageSize;
}

function chunkProducts(
  products:
  Product[],
  pageSize: number,
): Product[][] {
  const pages:
    Product[][] = [];

  for (
    let index = 0;
    index < products.length;
    index += pageSize
  ) {
    pages.push(
      products.slice(
        index,
        index + pageSize,
      ),
    );
  }

  return pages;
}

/**
 * Resuelve una CatalogComposition contra
 * el snapshot de productos disponible.
 *
 * Reglas:
 * - respeta exactamente productIds;
 * - no reordena por priority;
 * - reporta IDs faltantes;
 * - genera páginas únicamente para preview.
 *
 * No genera archivos ni conoce renderer.
 */
export function resolveCatalogPreview(
  composition:
    CatalogComposition,
  sourceProducts:
    readonly Product[],
  pageSize = 6,
): CatalogPreviewResolution {
  const productsById =
    new Map(
      sourceProducts.map(
        (product) => [
          product.id,
          product,
        ],
      ),
    );

  const products:
    Product[] = [];

  const missingProductIds:
    string[] = [];

  composition.productIds.forEach(
    (productId) => {
      const product =
        productsById.get(
          productId,
        );

      if (!product) {
        missingProductIds.push(
          productId,
        );

        return;
      }

      products.push(
        product,
      );
    },
  );

  return {
    products,

    pages:
      chunkProducts(
        products,
        normalizePageSize(
          pageSize,
        ),
      ),

    missingProductIds,
  };
}
