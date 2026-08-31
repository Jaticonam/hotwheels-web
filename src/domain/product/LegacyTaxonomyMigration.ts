import {
  isHotWheelsCategoryId,
  type HotWheelsCategoryId,
} from "./Taxonomy";

/**
 * Facetas heredadas del catálogo anterior.
 *
 * No son categorías Hot Wheels.
 * Se conservan temporalmente para exploración.
 */
export const LEGACY_EXPLORE_TAG_IDS = [
  "deportivos",
  "coleccionables",
  "tematicos",
  "clasicos",
  "fantasia",
  "racing",
  "truck",
  "jdm",
] as const;

export type LegacyExploreTagId =
  (typeof LEGACY_EXPLORE_TAG_IDS)[number];

export type LegacyTaxonomyMigrationReason =
  | "canonical"
  | "mainline-2026-card-sequence"
  | "unresolved";

export interface LegacyTaxonomyMigrationInput {
  category?: string;
  year?: number | null;
  cardNumber?: string;
}

export interface LegacyTaxonomyMigrationResult {
  canonicalCategory:
    HotWheelsCategoryId | null;

  exploreTags:
    LegacyExploreTagId[];

  reason:
    LegacyTaxonomyMigrationReason;
}

function normalizeLabel(
  value?: string,
): string {
  return (
    value ?? ""
  )
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      "",
    )
    .replace(/_/g, "-")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function isLegacyExploreTagId(
  value?: string | null,
): value is LegacyExploreTagId {
  if (!value) {
    return false;
  }

  return (
    LEGACY_EXPLORE_TAG_IDS as
      readonly string[]
  ).includes(value);
}

/**
 * Evidencia cerrada en CAT-3A:
 *
 * inventario actual:
 * - año 2026;
 * - card_number 1/250 ... 250/250;
 * - sin duplicados ni faltantes.
 *
 * Esta regla es deliberadamente estrecha.
 * No debe utilizarse para inferir otros años
 * ni otras líneas Hot Wheels.
 */
export function isAuditedMainline2026Card(
  year?: number | null,
  cardNumber?: string,
): boolean {
  if (year !== 2026) {
    return false;
  }

  const match =
    /^(\d{1,3})\/250$/.exec(
      (
        cardNumber ??
        ""
      ).trim(),
    );

  if (!match) {
    return false;
  }

  const position =
    Number(match[1]);

  return (
    Number.isInteger(
      position,
    ) &&
    position >= 1 &&
    position <= 250
  );
}

/**
 * Resuelve únicamente la migración del contrato legacy.
 *
 * Prioridad:
 *
 * 1. Si el dato ya es canónico, se conserva.
 * 2. Si pertenece al inventario auditado Mainline 2026,
 *    se clasifica como Mainline.
 * 3. La etiqueta antigua se conserva como exploreTag
 *    solo cuando realmente es una faceta de exploración.
 * 4. Fuera de la evidencia auditada no se inventa categoría.
 */
export function resolveLegacyTaxonomyMigration(
  input:
    LegacyTaxonomyMigrationInput,
): LegacyTaxonomyMigrationResult {
  const normalizedCategory =
    normalizeLabel(
      input.category,
    );

  if (
    isHotWheelsCategoryId(
      normalizedCategory,
    )
  ) {
    return {
      canonicalCategory:
        normalizedCategory,

      exploreTags: [],

      reason:
        "canonical",
    };
  }

  const exploreTags:
    LegacyExploreTagId[] =
    isLegacyExploreTagId(
      normalizedCategory,
    )
      ? [
          normalizedCategory,
        ]
      : [];

  if (
    isAuditedMainline2026Card(
      input.year,
      input.cardNumber,
    )
  ) {
    return {
      canonicalCategory:
        "mainline",

      exploreTags,

      reason:
        "mainline-2026-card-sequence",
    };
  }

  return {
    canonicalCategory:
      null,

    exploreTags,

    reason:
      "unresolved",
  };
}
