import type { Product } from "@/shared/types/product";

import {
  SHEETS_CONFIG,
  type SheetSource,
} from "./sheetsConfig";

import { normalizeProduct } from "./normalizeProduct";
import { validateProducts } from "./validateProducts";
import { isVisibleProductStatus } from "@/tenant/config/product/statuses";

type CsvRow = Record<string, string>;

const PRODUCT_REQUIRED_HEADERS = [
  "id",
  "title",
  "price",
  "status",
] as const;

const PRODUCT_RECOMMENDED_HEADERS = [
  "description",
  "category",
  "categories",
  "offer_price",
  "stock",
  "img",
  "images",
  "badge",
  "badges",
  "priority",
  "attributes",

  "brand",
  "line",
  "series",
  "year",
  "scale",
  "mattel_code",
  "case_code",
  "rarity",
  "card_condition",
  "vehicle_condition",

  "updated_at",
] as const;

function parseCSVLine(
  line: string,
): string[] {
  const result: string[] = [];

  let current = "";
  let insideQuotes = false;

  for (
    let index = 0;
    index < line.length;
    index++
  ) {
    const char = line[index];
    const nextChar = line[index + 1];

    if (
      char === '"' &&
      insideQuotes &&
      nextChar === '"'
    ) {
      current += '"';
      index++;
      continue;
    }

    if (char === '"') {
      insideQuotes = !insideQuotes;
      continue;
    }

    if (
      char === "," &&
      !insideQuotes
    ) {
      result.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  result.push(current);

  return result;
}

function parseCSV(
  text: string,
): {
  headers: string[];
  rows: CsvRow[];
} {
  const lines = text
    .replace(/\r/g, "")
    .split("\n")
    .filter(
      (line) =>
        line.trim() !== "",
    );

  if (lines.length === 0) {
    return {
      headers: [],
      rows: [],
    };
  }

  const headers = parseCSVLine(lines[0]).map(
    (header) =>
      header.trim().toLowerCase(),
  );

  const rows = lines
    .slice(1)
    .map((line) => {
      const values = parseCSVLine(line);
      const row: CsvRow = {};

      headers.forEach(
        (header, index) => {
          row[header] =
            (values[index] ?? "").trim();
        },
      );

      return row;
    });

  return {
    headers,
    rows,
  };
}

function getMeaningfulRows(
  rows: CsvRow[],
): CsvRow[] {
  return rows.filter((row) =>
    Object.values(row).some(
      (value) =>
        value.trim() !== "",
    ),
  );
}

function getMissingHeaders(
  headers: string[],
  expectedHeaders: readonly string[],
): string[] {
  const normalizedHeaders =
    new Set(
      headers.map(
        (header) =>
          header.toLowerCase(),
      ),
    );

  return expectedHeaders.filter(
    (expected) =>
      !normalizedHeaders.has(
        expected.toLowerCase(),
      ),
  );
}

function validateProductHeaders(
  headers: string[],
  source: SheetSource,
): void {
  const missingRequired =
    getMissingHeaders(
      headers,
      PRODUCT_REQUIRED_HEADERS,
    );

  if (
    missingRequired.length > 0
  ) {
    throw new Error(
      `La hoja "products" docId="${source.docId}" gid="${source.gid}" no cumple el schema mínimo. Faltan: ${missingRequired.join(", ")}`,
    );
  }

  const missingRecommended =
    getMissingHeaders(
      headers,
      PRODUCT_RECOMMENDED_HEADERS,
    );

  if (
    missingRecommended.length > 0 &&
    import.meta.env.DEV
  ) {
    console.info(
      'La hoja "products" no tiene todas las columnas recomendadas:',
      missingRecommended,
    );
  }
}

async function loadProductRows():
Promise<CsvRow[]> {
  const source =
    SHEETS_CONFIG.products;

  const cacheBust =
    `&t=${Date.now()}`;

  const url =
    `https://docs.google.com/spreadsheets/d/${source.docId}/export?format=csv&gid=${source.gid}${cacheBust}`;

  const response = await fetch(
    url,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(
      `Error cargando products: HTTP ${response.status}`,
    );
  }

  const csvText =
    await response.text();

  const {
    headers,
    rows,
  } = parseCSV(csvText);

  validateProductHeaders(
    headers,
    source,
  );

  return getMeaningfulRows(rows);
}

export async function loadAllProducts():
Promise<Product[]> {
  const rows =
    await loadProductRows();

  const normalized =
    rows.map(normalizeProduct);

  return validateProducts(normalized)
    .filter((product) =>
      isVisibleProductStatus(
        product.status.trim(),
      ),
    )
    .sort(
      (a, b) =>
        b.priority - a.priority,
    );
}