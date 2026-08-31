import type {
  HotWheelsRarityId,
} from "./Taxonomy";

export type LegacyRarityMigrationStatus =
  | "resolved"
  | "none"
  | "conflict";

export type LegacyRarityMigrationReason =
  | "treasure-hunt"
  | "super-treasure-hunt"
  | "no-signal"
  | "conflicting-signals";

export interface LegacyRarityMigrationResult {
  status:
    LegacyRarityMigrationStatus;

  reason:
    LegacyRarityMigrationReason;

  rarity:
    HotWheelsRarityId | null;
}

const SUPER_TREASURE_HUNT_PATTERN =
  /\bsuper\s+treasure\s+hunt\b/i;

const SUPER_TREASURE_HUNT_GLOBAL_PATTERN =
  /\bsuper\s+treasure\s+hunt\b/gi;

const TREASURE_HUNT_PATTERN =
  /\btreasure\s+hunt\b/i;

/**
 * Migra únicamente las señales legacy demostradas
 * en CAT-3D1:
 *
 * - fuente: description
 * - token completo "Treasure Hunt"
 * - token completo "Super Treasure Hunt"
 *
 * No interpreta aliases TH/STH.
 * No infiere "regular" por ausencia de señal.
 */
export function resolveLegacyRarityMigration(
  description?: string | null,
): LegacyRarityMigrationResult {
  const text =
    (
      description ??
      ""
    ).trim();

  if (!text) {
    return {
      status:
        "none",

      reason:
        "no-signal",

      rarity:
        null,
    };
  }

  const hasSuperTreasureHunt =
    SUPER_TREASURE_HUNT_PATTERN.test(
      text,
    );

  /**
   * Se retira primero la frase STH para impedir que
   * "Super Treasure Hunt" sea contado también como TH.
   */
  const textWithoutSuperTreasureHunt =
    text.replace(
      SUPER_TREASURE_HUNT_GLOBAL_PATTERN,
      " ",
    );

  const hasTreasureHunt =
    TREASURE_HUNT_PATTERN.test(
      textWithoutSuperTreasureHunt,
    );

  if (
    hasSuperTreasureHunt &&
    hasTreasureHunt
  ) {
    return {
      status:
        "conflict",

      reason:
        "conflicting-signals",

      rarity:
        null,
    };
  }

  if (hasSuperTreasureHunt) {
    return {
      status:
        "resolved",

      reason:
        "super-treasure-hunt",

      rarity:
        "super-treasure-hunt",
    };
  }

  if (hasTreasureHunt) {
    return {
      status:
        "resolved",

      reason:
        "treasure-hunt",

      rarity:
        "treasure-hunt",
    };
  }

  return {
    status:
      "none",

    reason:
      "no-signal",

    rarity:
      null,
  };
}

export function hasDeterministicLegacyRarity(
  description?: string | null,
): boolean {
  return (
    resolveLegacyRarityMigration(
      description,
    ).status ===
    "resolved"
  );
}
