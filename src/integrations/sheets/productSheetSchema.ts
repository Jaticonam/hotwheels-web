/**
 * Contrato de entrada de Google Sheets para productos Hot Wheels.
 *
 * REQUIRED:
 * mínimo técnico para aceptar la hoja.
 *
 * RECOMMENDED:
 * columnas operativas que enriquecen la venta actual.
 *
 * TAXONOMY:
 * dimensiones coleccionables de Hot Wheels Taxonomy 1.0.
 *
 * LEGACY:
 * columnas soportadas durante la migración, pero que no deben
 * utilizarse como contrato canónico para nuevos desarrollos.
 */

export const PRODUCT_REQUIRED_HEADERS = [
  "id",
  "title",
  "price",
  "status",
] as const;

export const PRODUCT_RECOMMENDED_HEADERS = [
  "description",
  "category",
  "badges",
  "offer_price",
  "stock",
  "img",
  "priority",
] as const;

export const PRODUCT_COLLECTION_METADATA_HEADERS = [
  "year",
  "case_code",
  "card_number",
] as const;

export const PRODUCT_TAXONOMY_HEADERS = [
  "series",
  "collection",
  "set_number",
  "format",
  "rarity",
  "manufacturer",
  "franchise",
  "style",
  "exclusivity",
] as const;

export const PRODUCT_OPTIONAL_HEADERS = [
  "categories",
  "images",
  "attributes",
  "updated_at",
] as const;

export const PRODUCT_LEGACY_HEADERS = [
  "mini_series",
] as const;

export const PRODUCT_SUPPORTED_HEADERS = [
  ...PRODUCT_REQUIRED_HEADERS,
  ...PRODUCT_RECOMMENDED_HEADERS,
  ...PRODUCT_COLLECTION_METADATA_HEADERS,
  ...PRODUCT_TAXONOMY_HEADERS,
  ...PRODUCT_OPTIONAL_HEADERS,
  ...PRODUCT_LEGACY_HEADERS,
] as const;
