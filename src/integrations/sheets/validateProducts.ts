import {
  PRODUCT_CATEGORIES,
} from "@/tenant/config/catalog";

import {
  isVisibleProductStatus,
} from "@/tenant/config/product/statuses";

import type {
  SheetProduct,
} from "./normalizeProduct";

const PRODUCT_CATEGORY_IDS =
  new Set(
    PRODUCT_CATEGORIES.map(
      (category) =>
        category.id,
    ),
  );

function hasValidBasePrice(
  product: SheetProduct,
): boolean {
  return (
    Number.isFinite(product.price) &&
    product.price > 0
  );
}

function getInvalidCategories(
  product: SheetProduct,
): string[] {
  const invalid: string[] = [];

  if (
    product.category &&
    !PRODUCT_CATEGORY_IDS.has(
      product.category,
    )
  ) {
    invalid.push(
      product.category,
    );
  }

  for (
    const categoryId
    of product.categories ?? []
  ) {
    if (
      !PRODUCT_CATEGORY_IDS.has(
        categoryId,
      )
    ) {
      invalid.push(
        categoryId,
      );
    }
  }

  if (
    !product.category &&
    (
      !product.categories ||
      product.categories.length === 0
    )
  ) {
    invalid.push(
      "sin categoría válida",
    );
  }

  return Array.from(
    new Set(invalid),
  );
}

/**
 * Sanitiza clasificación legacy sin inventar datos.
 *
 * Si la categoría principal es inválida:
 * - promueve una secundaria válida, si existe;
 * - de lo contrario deja el producto sin categoría.
 *
 * El producto continúa visible en "Todos".
 */
function sanitizeCategories(
  product: SheetProduct,
): void {
  const validCategories =
    (
      product.categories ?? []
    ).filter(
      (categoryId) =>
        PRODUCT_CATEGORY_IDS.has(
          categoryId,
        ),
    );

  const hasValidPrimary =
    Boolean(
      product.category &&
      PRODUCT_CATEGORY_IDS.has(
        product.category,
      ),
    );

  if (hasValidPrimary) {
    product.categories =
      Array.from(
        new Set([
          product.category,
          ...validCategories,
        ]),
      );

    return;
  }

  if (
    validCategories.length > 0
  ) {
    product.category =
      validCategories[0];

    product.categories =
      Array.from(
        new Set(
          validCategories,
        ),
      );

    return;
  }

  product.category = "";
  product.categories = [];
}

function hasInvalidOffer(
  product: SheetProduct,
): boolean {
  if (
    product.offer_price === null
  ) {
    return false;
  }

  return (
    !Number.isFinite(
      product.offer_price,
    ) ||
    product.offer_price <= 0 ||
    product.offer_price >=
      product.price
  );
}

export function validateProducts(
  products: SheetProduct[],
): SheetProduct[] {
  const seen =
    new Set<string>();

  return products.filter(
    (product) => {
      const status =
        product.status.trim();

      if (!product.id) {
        console.warn(
          "Producto descartado: sin id",
          product,
        );

        return false;
      }

      if (
        seen.has(product.id)
      ) {
        console.warn(
          "Producto descartado: id duplicado ->",
          product.id,
        );

        return false;
      }

      if (!product.title) {
        console.warn(
          "Producto descartado: sin title ->",
          product.id,
        );

        return false;
      }

      if (
        !isVisibleProductStatus(
          status,
        )
      ) {
        return false;
      }

      if (
        !hasValidBasePrice(
          product,
        )
      ) {
        console.warn(
          "Producto descartado: precio base inválido ->",
          {
            id: product.id,
            title: product.title,
            price: product.price,
          },
        );

        return false;
      }

      const invalidCategories =
        getInvalidCategories(
          product,
        );

      if (
        invalidCategories.length > 0
      ) {
        console.warn(
          "Producto con categoría incompleta o inválida. Se normaliza sin inventar categoría ->",
          {
            id: product.id,
            title: product.title,
            category:
              product.category,
            categories:
              product.categories,
            invalidCategories,
            validCategories:
              PRODUCT_CATEGORIES.map(
                (category) =>
                  category.sheetLabel,
              ),
          },
        );

        sanitizeCategories(
          product,
        );
      }

      if (
        hasInvalidOffer(
          product,
        )
      ) {
        console.warn(
          "Producto con oferta inválida. Se mantiene precio base ->",
          {
            id: product.id,
            title: product.title,
            price: product.price,
            offer_price:
              product.offer_price,
          },
        );

        product.offer_price =
          null;
      }

      if (
        !product.img.trim()
      ) {
        console.warn(
          "Producto sin imagen. Se mantiene publicado, revisar ficha ->",
          {
            id: product.id,
            title: product.title,
          },
        );
      }

      seen.add(product.id);

      return true;
    },
  );
}
