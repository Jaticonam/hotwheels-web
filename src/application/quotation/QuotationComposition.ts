import {
  getEffectivePrice,
  getOriginalProductPrice,
} from "@/domain/product/pricing";

import {
  clampProductQuantity,
  isProductQuantityValid,
} from "@/domain/product/quantity";

import type {
  Product,
} from "@/shared/types/product";

import {
  isPreorderStatus,
  isPublishedStatus,
} from "@/tenant/config/product/statuses";

export interface QuotationLine {
  productId:
    string;

  title:
    string;

  imageUrl:
    string;

  status:
    string;

  stockSnapshot:
    number | null;

  quantity:
    number;

  unitPrice:
    number;

  originalUnitPrice:
    number;

  subtotal:
    number;
}

export interface QuotationComposition {
  schemaVersion: 1;

  title:
    string;

  currency:
    "PEN";

  lines:
    QuotationLine[];
}

export interface QuotationCompositionResolution {
  composition:
    QuotationComposition;

  excludedProductIds:
    string[];
}

export interface QuotationSummary {
  products:
    number;

  units:
    number;

  originalTotal:
    number;

  total:
    number;

  savings:
    number;
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
): string {
  const clean =
    title.trim();

  return (
    clean ||
    "Nueva cotización"
  );
}

function isQuotationEligible(
  product: Product,
): boolean {
  const validStatus =
    isPublishedStatus(
      product.status,
    ) ||
    isPreorderStatus(
      product.status,
    );

  if (!validStatus) {
    return false;
  }

  const unitPrice =
    getEffectivePrice(
      product,
    );

  if (
    !Number.isFinite(
      unitPrice,
    ) ||
    unitPrice <= 0
  ) {
    return false;
  }

  return isProductQuantityValid(
    1,
    product.stock,
  );
}

function createQuotationLine(
  product: Product,
): QuotationLine {
  const unitPrice =
    getEffectivePrice(
      product,
    );

  const originalUnitPrice =
    getOriginalProductPrice(
      product,
    );

  return {
    productId:
      product.id,

    title:
      product.title,

    imageUrl:
      product.img,

    status:
      product.status,

    stockSnapshot:
      product.stock,

    quantity:
      1,

    unitPrice,

    originalUnitPrice,

    subtotal:
      unitPrice,
  };
}

/**
 * Construye una cotización desde la selección
 * del Product Explorer.
 *
 * Mantiene el orden comercial de selectedProductIds.
 *
 * La composición contiene un snapshot de precio,
 * stock y estado para evitar depender de cambios
 * posteriores de la fuente durante la edición.
 */
export function createQuotationComposition(
  products:
    readonly Product[],
  selectedProductIds:
    readonly string[],
  title =
    "Nueva cotización",
): QuotationCompositionResolution {
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

  const lines:
    QuotationLine[] = [];

  const excludedProductIds:
    string[] = [];

  requestedIds.forEach(
    (productId) => {
      const product =
        productsById.get(
          productId,
        );

      if (
        !product ||
        !isQuotationEligible(
          product,
        )
      ) {
        excludedProductIds.push(
          productId,
        );

        return;
      }

      lines.push(
        createQuotationLine(
          product,
        ),
      );
    },
  );

  return {
    composition: {
      schemaVersion: 1,

      title:
        normalizeTitle(
          title,
        ),

      currency:
        "PEN",

      lines,
    },

    excludedProductIds,
  };
}

/**
 * Cambia cantidad respetando las mismas reglas
 * comerciales usadas por el catálogo:
 *
 * - mínimo 1
 * - stock conocido como máximo
 */
export function updateQuotationLineQuantity(
  composition:
    QuotationComposition,
  productId: string,
  quantity: number,
): QuotationComposition {
  const cleanId =
    productId.trim();

  if (!cleanId) {
    return composition;
  }

  let changed =
    false;

  const lines =
    composition.lines.map(
      (line) => {
        if (
          line.productId !==
          cleanId
        ) {
          return line;
        }

        const nextQuantity =
          clampProductQuantity(
            quantity,
            line.stockSnapshot,
          );

        if (
          nextQuantity ===
          line.quantity
        ) {
          return line;
        }

        changed = true;

        return {
          ...line,

          quantity:
            nextQuantity,

          subtotal:
            line.unitPrice *
            nextQuantity,
        };
      },
    );

  if (!changed) {
    return composition;
  }

  return {
    ...composition,
    lines,
  };
}

export function removeQuotationLine(
  composition:
    QuotationComposition,
  productId: string,
): QuotationComposition {
  const cleanId =
    productId.trim();

  const lines =
    composition.lines.filter(
      (line) =>
        line.productId !==
        cleanId,
    );

  if (
    lines.length ===
    composition.lines.length
  ) {
    return composition;
  }

  return {
    ...composition,
    lines,
  };
}

export function calculateQuotationSummary(
  composition:
    QuotationComposition,
): QuotationSummary {
  const units =
    composition.lines.reduce(
      (
        total,
        line,
      ) =>
        total +
        line.quantity,
      0,
    );

  const total =
    composition.lines.reduce(
      (
        amount,
        line,
      ) =>
        amount +
        line.subtotal,
      0,
    );

  const originalTotal =
    composition.lines.reduce(
      (
        amount,
        line,
      ) =>
        amount +
        (
          line.originalUnitPrice *
          line.quantity
        ),
      0,
    );

  return {
    products:
      composition.lines.length,

    units,

    originalTotal,

    total,

    savings:
      Math.max(
        0,
        originalTotal -
          total,
      ),
  };
}

export function isQuotationCompositionReady(
  composition:
    QuotationComposition,
): boolean {
  return (
    composition.title.trim()
      .length > 0 &&
    composition.lines.length >
      0
  );
}
