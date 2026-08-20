/**
 * Normaliza el límite máximo de unidades
 * disponible para una operación comercial.
 *
 * null:
 *   no existe un límite conocido.
 *
 * 0:
 *   no existen unidades disponibles.
 */
export function getProductQuantityLimit(
  maxQty?: number | null,
): number | null {
  if (
    maxQty === null ||
    maxQty === undefined ||
    !Number.isFinite(maxQty)
  ) {
    return null;
  }

  return Math.max(
    0,
    Math.floor(maxQty),
  );
}

/**
 * Normaliza una cantidad al rango comercial:
 *
 * mínimo: 1
 * máximo: stock conocido, si existe.
 */
export function clampProductQuantity(
  qty: number,
  maxQty?: number | null,
): number {
  const safeQty =
    Math.max(
      1,
      Math.floor(qty),
    );

  const limit =
    getProductQuantityLimit(
      maxQty,
    );

  if (limit === null) {
    return safeQty;
  }

  if (limit <= 0) {
    return 1;
  }

  return Math.min(
    safeQty,
    limit,
  );
}

/**
 * Valida una cantidad comercial sin modificarla.
 */
export function isProductQuantityValid(
  qty: number | null,
  maxQty?: number | null,
): boolean {
  if (
    qty === null ||
    !Number.isFinite(qty) ||
    qty < 1
  ) {
    return false;
  }

  const limit =
    getProductQuantityLimit(
      maxQty,
    );

  if (limit === null) {
    return true;
  }

  return (
    limit > 0 &&
    qty <= limit
  );
}
