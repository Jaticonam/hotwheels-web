export type ProductSelection =
  string[];

function normalizeIds(
  ids: readonly string[],
): string[] {
  const seen =
    new Set<string>();

  return ids.filter(
    (id) => {
      const clean =
        id.trim();

      if (
        !clean ||
        seen.has(clean)
      ) {
        return false;
      }

      seen.add(clean);

      return true;
    },
  );
}

export function toggleProductSelection(
  selectedIds:
  ProductSelection,
  productId: string,
): ProductSelection {
  const cleanId =
    productId.trim();

  if (!cleanId) {
    return selectedIds;
  }

  if (
    selectedIds.includes(
      cleanId,
    )
  ) {
    return selectedIds.filter(
      (id) =>
        id !== cleanId,
    );
  }

  return normalizeIds([
    ...selectedIds,
    cleanId,
  ]);
}

export function addProductsToSelection(
  selectedIds:
  ProductSelection,
  productIds:
  readonly string[],
): ProductSelection {
  return normalizeIds([
    ...selectedIds,
    ...productIds,
  ]);
}

export function removeProductsFromSelection(
  selectedIds:
  ProductSelection,
  productIds:
  readonly string[],
): ProductSelection {
  const removal =
    new Set(
      productIds.map(
        (id) => id.trim(),
      ),
    );

  return selectedIds.filter(
    (id) =>
      !removal.has(id),
  );
}

export function keepAvailableProductSelection(
  selectedIds:
  ProductSelection,
  availableIds:
  readonly string[],
): ProductSelection {
  const available =
    new Set(
      availableIds,
    );

  return normalizeIds(
    selectedIds,
  ).filter(
    (id) =>
      available.has(id),
  );
}

export function areAllProductsSelected(
  selectedIds:
  ProductSelection,
  productIds:
  readonly string[],
): boolean {
  const cleanIds =
    normalizeIds(
      productIds,
    );

  if (
    cleanIds.length === 0
  ) {
    return false;
  }

  const selected =
    new Set(
      selectedIds,
    );

  return cleanIds.every(
    (id) =>
      selected.has(id),
  );
}
