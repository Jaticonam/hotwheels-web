/**
 * Estados comerciales oficiales del catálogo.
 *
 * Contrato:
 * - Publicado: visible y vendible si precio y stock son válidos.
 * - Preventa: visible para consulta o reserva; no se agrega a Mi Box.
 * - Agotado: visible, pero no vendible.
 * - Oculto: no visible en frontend.
 * - Borrador: estado interno de preparación; no visible en frontend.
 */
export const PRODUCT_STATUSES = {
  published: "Publicado",
  preorder: "Preventa",
  soldOut: "Agotado",
  hidden: "Oculto",
  draft: "Borrador",
} as const;

export const VISIBLE_PRODUCT_STATUSES = [
  PRODUCT_STATUSES.published,
  PRODUCT_STATUSES.preorder,
  PRODUCT_STATUSES.soldOut,
] as const;

export type ProductStatus =
  (typeof PRODUCT_STATUSES)[keyof typeof PRODUCT_STATUSES];

export function isVisibleProductStatus(
  status?: string | null,
): boolean {
  if (!status) return false;

  return VISIBLE_PRODUCT_STATUSES.includes(
    status.trim() as
      (typeof VISIBLE_PRODUCT_STATUSES)[number],
  );
}

export function isPublishedStatus(
  status?: string | null,
): boolean {
  return (
    status?.trim() ===
    PRODUCT_STATUSES.published
  );
}

export function isPreorderStatus(
  status?: string | null,
): boolean {
  return (
    status?.trim() ===
    PRODUCT_STATUSES.preorder
  );
}

export function isSoldOutStatus(
  status?: string | null,
): boolean {
  return (
    status?.trim() ===
    PRODUCT_STATUSES.soldOut
  );
}

export function isHiddenStatus(
  status?: string | null,
): boolean {
  return (
    status?.trim() ===
    PRODUCT_STATUSES.hidden
  );
}

export function isDraftStatus(
  status?: string | null,
): boolean {
  return (
    status?.trim() ===
    PRODUCT_STATUSES.draft
  );
}
