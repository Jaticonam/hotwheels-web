import type { Product } from "@/shared/types/product";

import { getCategoryIdFromSheetLabel } from "@/tenant/config/catalog";

type CsvRow = Record<string, string>;

export type SheetProduct = Product;

function cleanText(value: unknown): string {
  return String(value ?? "").trim();
}

function getRowValue(
  row: CsvRow,
  ...keys: string[]
): string {
  for (const key of keys) {
    const value = row[key.toLowerCase()];

    if (cleanText(value)) {
      return cleanText(value);
    }
  }

  return "";
}

function slugify(value: unknown): string {
  return cleanText(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/_/g, "-")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseNumber(
  value: unknown,
): number | null {
  const cleaned = cleanText(value)
    .replace(/\s/g, "")
    .replace(",", ".");

  if (!cleaned) return null;

  const number = Number(cleaned);

  return Number.isFinite(number)
    ? number
    : null;
}

function parseRequiredNumber(
  value: unknown,
): number {
  return parseNumber(value) ?? 0;
}

function parseOptionalInteger(
  value: unknown,
): number | null {
  const number =
    parseNumber(value);

  if (
    number === null ||
    !Number.isInteger(number)
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
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseUniqueList(
  value: unknown,
): string[] {
  const seen = new Set<string>();

  return parsePipeList(value).filter((item) => {
    const key = item
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function parseCategories(
  value: unknown,
): string[] {
  return parsePipeList(value)
    .map(getCategoryIdFromSheetLabel)
    .filter(Boolean);
}

function parseBadges(
  value: unknown,
): string[] {
  return parseUniqueList(value);
}

function parseAttributes(
  value: unknown,
): string[] {
  return Array.from(
    new Set(
      parsePipeList(value)
        .map(slugify)
        .filter(Boolean),
    ),
  );
}

function normalizeSheetStatus(
  value: unknown,
): string {
  const raw = cleanText(value);
  const slug = slugify(raw);

  const map: Record<string, string> = {
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

  return map[slug] ?? raw;
}

export function normalizeProduct(
  row: CsvRow,
): SheetProduct {
  const primaryCategory =
    getCategoryIdFromSheetLabel(row.category);

  const extraCategories =
    parseCategories(row.categories);

  const categories = Array.from(
    new Set(
      [
        primaryCategory,
        ...extraCategories,
      ].filter(Boolean),
    ),
  );

  return {
    id: cleanText(row.id),
    title: cleanText(row.title),
    description: cleanText(row.description),

    category: primaryCategory,
    categories,

    price: parseRequiredNumber(row.price),
    offer_price: parseNumber(row.offer_price),

    stock: parseNumber(row.stock),

    img: cleanText(row.img),
    images: parsePipeList(row.images),

    priority: parseRequiredNumber(row.priority),
    status: normalizeSheetStatus(row.status),

    badges: parseBadges(
      getRowValue(
        row,
        "badges",
        "badge",
      ),
    ),

    attributes: parseAttributes(row.attributes),

    year: parseOptionalInteger(row.year),
    case_code: cleanText(row.case_code),
    card_number: cleanText(row.card_number),
    mini_series: cleanText(row.mini_series),

    updated_at: cleanText(row.updated_at),
  };
}