import type {
  Product,
} from "@/shared/types/product";

import {
  isHotWheelsCategoryId,
  isHotWheelsFormatId,
  isHotWheelsRarityId,
  type HotWheelsCategoryId,
  type HotWheelsFormatId,
  type HotWheelsRarityId,
  type HotWheelsTaxonomy,
} from "./Taxonomy";

export type HotWheelsTaxonomyResolutionStatus =
  | "complete"
  | "incomplete"
  | "invalid";

export type HotWheelsTaxonomyIssueCode =
  | "missing-category"
  | "non-canonical-category"
  | "missing-format"
  | "invalid-format"
  | "invalid-rarity";

export interface HotWheelsTaxonomyIssue {
  code: HotWheelsTaxonomyIssueCode;
  field:
    | "category"
    | "format"
    | "rarity";
  value?: string;
}

export interface HotWheelsTaxonomyResolution {
  status:
    HotWheelsTaxonomyResolutionStatus;

  taxonomy:
    HotWheelsTaxonomy | null;

  issues:
    HotWheelsTaxonomyIssue[];
}

function cleanOptionalText(
  value?: string,
): string | undefined {
  const cleaned =
    value?.trim() ?? "";

  return cleaned || undefined;
}

function resolveCategory(
  product: Product,
  issues: HotWheelsTaxonomyIssue[],
): HotWheelsCategoryId | undefined {
  const value =
    product.category.trim();

  if (!value) {
    issues.push({
      code: "missing-category",
      field: "category",
    });

    return undefined;
  }

  if (
    !isHotWheelsCategoryId(
      value,
    )
  ) {
    issues.push({
      code:
        "non-canonical-category",
      field: "category",
      value,
    });

    return undefined;
  }

  return value;
}

function resolveFormat(
  product: Product,
  issues: HotWheelsTaxonomyIssue[],
): HotWheelsFormatId | undefined {
  const value =
    product.format?.trim() ?? "";

  if (!value) {
    issues.push({
      code: "missing-format",
      field: "format",
    });

    return undefined;
  }

  if (
    !isHotWheelsFormatId(
      value,
    )
  ) {
    issues.push({
      code: "invalid-format",
      field: "format",
      value,
    });

    return undefined;
  }

  return value;
}

function resolveRarity(
  product: Product,
  issues: HotWheelsTaxonomyIssue[],
): HotWheelsRarityId | undefined {
  const value =
    product.rarity?.trim() ?? "";

  if (!value) {
    return undefined;
  }

  if (
    !isHotWheelsRarityId(
      value,
    )
  ) {
    issues.push({
      code: "invalid-rarity",
      field: "rarity",
      value,
    });

    return undefined;
  }

  return value;
}

function getResolutionStatus(
  issues:
    HotWheelsTaxonomyIssue[],
): HotWheelsTaxonomyResolutionStatus {
  const hasInvalidData =
    issues.some(
      (issue) =>
        issue.code ===
          "invalid-format" ||
        issue.code ===
          "invalid-rarity",
    );

  if (hasInvalidData) {
    return "invalid";
  }

  if (
    issues.length > 0
  ) {
    return "incomplete";
  }

  return "complete";
}

/**
 * Certifica la clasificación coleccionable de un producto.
 *
 * Este resolver NO decide si el producto puede venderse.
 * La disponibilidad comercial continúa siendo responsabilidad
 * del catálogo/estado comercial.
 *
 * Un producto legacy puede seguir operativo y resultar
 * "incomplete" hasta que CAT-3 migre su clasificación.
 */
export function resolveHotWheelsTaxonomy(
  product: Product,
): HotWheelsTaxonomyResolution {
  const issues:
    HotWheelsTaxonomyIssue[] = [];

  const category =
    resolveCategory(
      product,
      issues,
    );

  const format =
    resolveFormat(
      product,
      issues,
    );

  const rarity =
    resolveRarity(
      product,
      issues,
    );

  const status =
    getResolutionStatus(
      issues,
    );

  if (
    status !== "complete" ||
    !category ||
    !format
  ) {
    return {
      status,
      taxonomy: null,
      issues,
    };
  }

  const series =
    cleanOptionalText(
      product.series,
    );

  const collection =
    cleanOptionalText(
      product.collection,
    );

  const setNumber =
    cleanOptionalText(
      product.set_number,
    );

  const manufacturer =
    cleanOptionalText(
      product.manufacturer,
    );

  const franchise =
    cleanOptionalText(
      product.franchise,
    );

  const style =
    cleanOptionalText(
      product.style,
    );

  const exclusivity =
    cleanOptionalText(
      product.exclusivity,
    );

  const taxonomy:
    HotWheelsTaxonomy = {
      category,
      format,

      ...(rarity
        ? { rarity }
        : {}),

      ...(series
        ? { series }
        : {}),

      ...(collection
        ? { collection }
        : {}),

      ...(setNumber
        ? {
            set_number:
              setNumber,
          }
        : {}),

      ...(manufacturer
        ? { manufacturer }
        : {}),

      ...(franchise
        ? { franchise }
        : {}),

      ...(style
        ? { style }
        : {}),

      ...(exclusivity
        ? { exclusivity }
        : {}),
    };

  return {
    status: "complete",
    taxonomy,
    issues: [],
  };
}

export function hasCompleteHotWheelsTaxonomy(
  product: Product,
): boolean {
  return (
    resolveHotWheelsTaxonomy(
      product,
    ).status === "complete"
  );
}
