export type LegacyMiniSeriesMigrationStatus =
  | "parsed"
  | "review"
  | "invalid";

export type LegacyMiniSeriesMigrationReason =
  | "parsed"
  | "empty"
  | "missing-set-number"
  | "invalid-set-number";

export interface LegacyMiniSeriesMigrationResult {
  status:
    LegacyMiniSeriesMigrationStatus;

  reason:
    LegacyMiniSeriesMigrationReason;

  series:
    string | null;

  set_number:
    string | null;
}

function cleanText(
  value?: string | null,
): string {
  return (
    value ?? ""
  ).trim();
}

/**
 * Migra únicamente la representación legacy:
 *
 *   "Exoticars 2/10"
 *
 * hacia:
 *
 *   series      = "Exoticars"
 *   set_number  = "2/10"
 *
 * No valida unicidad de slots dentro del catálogo.
 * Esa responsabilidad pertenece a una auditoría de dataset.
 */
export function resolveLegacyMiniSeriesMigration(
  value?: string | null,
): LegacyMiniSeriesMigrationResult {
  const raw =
    cleanText(
      value,
    );

  if (!raw) {
    return {
      status:
        "review",

      reason:
        "empty",

      series:
        null,

      set_number:
        null,
    };
  }

  const match =
    /^(.+?)\s+(\d+)\/(\d+)$/.exec(
      raw,
    );

  if (!match) {
    return {
      status:
        "review",

      reason:
        "missing-set-number",

      series:
        raw,

      set_number:
        null,
    };
  }

  const series =
    match[1].trim();

  const position =
    Number(
      match[2],
    );

  const total =
    Number(
      match[3],
    );

  if (
    !series ||
    !Number.isInteger(
      position,
    ) ||
    !Number.isInteger(
      total,
    ) ||
    position < 1 ||
    total < 1 ||
    position > total
  ) {
    return {
      status:
        "invalid",

      reason:
        "invalid-set-number",

      series:
        series || null,

      set_number:
        `${position}/${total}`,
    };
  }

  return {
    status:
      "parsed",

    reason:
      "parsed",

    series,

    set_number:
      `${position}/${total}`,
  };
}

export function hasDeterministicLegacyMiniSeriesMigration(
  value?: string | null,
): boolean {
  return (
    resolveLegacyMiniSeriesMigration(
      value,
    ).status ===
    "parsed"
  );
}
