import {
  resolveLegacyMiniSeriesMigration,
} from "@/domain/product/LegacyMiniSeriesMigration";
import {
  resolveLegacyTaxonomyMigration,
} from "@/domain/product/LegacyTaxonomyMigration";
import {
  isHotWheelsFormatId,
  isHotWheelsRarityId,
} from "@/domain/product/Taxonomy";

import type {
  Product,
} from "@/shared/types/product";

import {
  getProductCategoryIdFromSheetLabel,
} from "@/tenant/config/catalog";

type CsvRow =
  Record<string, string>;

export type SheetProduct =
  Product;

function cleanText(
  value: unknown,
): string {
  return String(
    value ?? "",
  ).trim();
}

function getRowValue(
  row: CsvRow,
  ...keys: string[]
): string {
  for (const key of keys) {
    const value =
      row[
        key.toLowerCase()
      ];

    if (
      cleanText(value)
    ) {
      return cleanText(
        value,
      );
    }
  }

  return "";
}

function slugify(
  value: unknown,
): string {
  return cleanText(value)
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

function parseNumber(
  value: unknown,
): number | null {
  const cleaned =
    cleanText(value)
      .replace(/\s/g, "")
      .replace(",", ".");

  if (!cleaned) {
    return null;
  }

  const number =
    Number(cleaned);

  return Number.isFinite(
    number,
  )
    ? number
    : null;
}

function parseRequiredNumber(
  value: unknown,
): number {
  return (
    parseNumber(value) ??
    0
  );
}

function parseOptionalInteger(
  value: unknown,
): number | null {
  const number =
    parseNumber(value);

  if (
    number === null ||
    !Number.isInteger(
      number,
    )
  ) {
    return null;
  }

  return number;
}

function parsePipeList(
  value: unknown,
): string[] {
  return cleanText(value)
    .split("|")
    .map(
      (item) =>
        item.trim(),
    )
    .filter(Boolean);
}

function parseUniqueList(
  value: unknown,
): string[] {
  const seen =
    new Set<string>();

  return parsePipeList(
    value,
  ).filter(
    (item) => {
      const key =
        item
          .normalize("NFD")
          .replace(
            /[\u0300-\u036f]/g,
            "",
          )
          .toLowerCase();

      if (
        seen.has(key)
      ) {
        return false;
      }

      seen.add(key);

      return true;
    },
  );
}

function parseCategories(
  value: unknown,
): string[] {
  return parsePipeList(
    value,
  )
    .map(
      getProductCategoryIdFromSheetLabel,
    )
    .filter(Boolean);
}

function parseBadges(
  value: unknown,
): string[] {
  return parseUniqueList(
    value,
  );
}

function parseAttributes(
  value: unknown,
): string[] {
  return Array.from(
    new Set(
      parsePipeList(
        value,
      )
        .map(slugify)
        .filter(Boolean),
    ),
  );
}

function parseFormat(
  value: unknown,
): string {
  const slug =
    slugify(value);

  const aliases:
    Record<string, string> = {
      individual: "single",
      unidad: "single",

      caja: "case",
      "x-caja": "case",
    };

  const normalized =
    aliases[slug] ??
    slug;

  return isHotWheelsFormatId(
    normalized,
  )
    ? normalized
    : "";
}

function parseRarity(
  value: unknown,
): string {
  const slug =
    slugify(value);

  const aliases:
    Record<string, string> = {
      th: "treasure-hunt",
      sth: "super-treasure-hunt",
    };

  const normalized =
    aliases[slug] ??
    slug;

  return isHotWheelsRarityId(
    normalized,
  )
    ? normalized
    : "";
}

function normalizeSheetStatus(
  value: unknown,
): string {
  const raw =
    cleanText(value);

  const slug =
    slugify(raw);

  const map:
    Record<string, string> = {
      publicado: "Publicado",
      publicada: "Publicado",
      activo: "Publicado",
      activa: "Publicado",
      disponible: "Publicado",
      visible: "Publicado",
      "en-stock": "Publicado",

      preventa: "Preventa",
      "pre-venta": "Preventa",
      reserva: "Preventa",
      reservado: "Preventa",

      borrador: "Borrador",
      draft: "Borrador",
      pendiente: "Borrador",

      oculto: "Oculto",
      oculta: "Oculto",
      inactivo: "Oculto",
      inactiva: "Oculto",

      agotado: "Agotado",
      agotada: "Agotado",
      "sin-stock": "Agotado",
      soldout: "Agotado",
      "sold-out": "Agotado",
    };

  return (
    map[slug] ??
    raw
  );
}

export function normalizeProduct(
  row: CsvRow,
): SheetProduct {
  const year =
    parseOptionalInteger(
      row.year,
    );

  const legacyPrimaryCategory =
    getProductCategoryIdFromSheetLabel(
      row.category,
    );

  const migration =
    resolveLegacyTaxonomyMigration({
      category:
        cleanText(
          row.category,
        ),

      year,

      cardNumber:
        cleanText(
          row.card_number,
        ),
    });

  const primaryCategory =
    migration.canonicalCategory ??
    legacyPrimaryCategory;

  const extraCategories =
    migration.canonicalCategory
      ? []
      : parseCategories(
          row.categories,
        );

  const categories =
    Array.from(
      new Set(
        [
          primaryCategory,
          ...extraCategories,
        ].filter(Boolean),
      ),
    );
  const sourceFormat =
    cleanText(
      row.format,
    );

  const format =
    sourceFormat
      ? parseFormat(
          sourceFormat,
        )
      : migration.reason ===
          "mainline-2026-card-sequence"
        ? "single"
        : "";
  const sourceSeries =
    cleanText(
      row.series,
    );

  const sourceSetNumber =
    cleanText(
      row.set_number,
    );

  const legacyMiniSeriesMigration =
    resolveLegacyMiniSeriesMigration(
      row.mini_series,
    );

  const canUseLegacyMiniSeries =
    !sourceSeries &&
    !sourceSetNumber &&
    legacyMiniSeriesMigration.status ===
      "parsed";

  const series =
    sourceSeries ||
    (
      canUseLegacyMiniSeries
        ? legacyMiniSeriesMigration.series ??
          ""
        : ""
    );

  const setNumber =
    sourceSetNumber ||
    (
      canUseLegacyMiniSeries
        ? legacyMiniSeriesMigration.set_number ??
          ""
        : ""
    );
  return {
    id:
      cleanText(row.id),

    title:
      cleanText(row.title),

    description:
      cleanText(
        row.description,
      ),

    category:
      primaryCategory,

    categories,

    price:
      parseRequiredNumber(
        row.price,
      ),

    offer_price:
      parseNumber(
        row.offer_price,
      ),

    stock:
      parseNumber(
        row.stock,
      ),

    img:
      cleanText(row.img),

    images:
      parsePipeList(
        row.images,
      ),

    priority:
      parseRequiredNumber(
        row.priority,
      ),

    status:
      normalizeSheetStatus(
        row.status,
      ),

    badges:
      parseBadges(
        getRowValue(
          row,
          "badges",
          "badge",
        ),
      ),

    attributes:
      parseAttributes(
        row.attributes,
      ),

    explore_tags:
      migration.exploreTags,
    year,

    case_code:
      cleanText(
        row.case_code,
      ),

    card_number:
      cleanText(
        row.card_number,
      ),

    mini_series:
      cleanText(
        row.mini_series,
      ),

    series,

    collection:
      cleanText(
        row.collection,
      ),

    set_number:
      setNumber,

    format,

    rarity:
      parseRarity(
        row.rarity,
      ),

    manufacturer:
      cleanText(
        row.manufacturer,
      ),

    franchise:
      cleanText(
        row.franchise,
      ),

    style:
      slugify(
        row.style,
      ),

    exclusivity:
      slugify(
        row.exclusivity,
      ),

    updated_at:
      cleanText(
        row.updated_at,
      ),
  };
}
