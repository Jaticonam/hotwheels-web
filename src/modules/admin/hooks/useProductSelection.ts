import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  addProductsToSelection,
  areAllProductsSelected,
  keepAvailableProductSelection,
  removeProductsFromSelection,
  toggleProductSelection,
} from "@/application/catalog/ProductSelection";

const STORAGE_KEY =
  "hwa:admin:product-selection:v1";

export function readProductSelectionSnapshot():
string[] {
  try {
    const raw =
      sessionStorage.getItem(
        STORAGE_KEY,
      );

    if (!raw) {
      return [];
    }

    const parsed =
      JSON.parse(raw);

    if (
      !Array.isArray(parsed)
    ) {
      return [];
    }

    return parsed.filter(
      (value):
      value is string =>
        typeof value ===
        "string",
    );
  }
  catch {
    return [];
  }
}

function saveSelection(
  ids: string[],
): void {
  try {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(ids),
    );
  }
  catch {
    // La selección continúa operativa aunque
    // sessionStorage no esté disponible.
  }
}

export function useProductSelection(
  availableProductIds:
  readonly string[],
) {
  const [
    selectedIds,
    setSelectedIds,
  ] =
    useState<string[]>(
      () =>
        readProductSelectionSnapshot(),
    );

  useEffect(
    () => {
      setSelectedIds(
        (current) => {
          const next =
            keepAvailableProductSelection(
              current,
              availableProductIds,
            );

          saveSelection(
            next,
          );

          return next;
        },
      );
    },
    [availableProductIds],
  );

  const selectedSet =
    useMemo(
      () =>
        new Set(
          selectedIds,
        ),
      [selectedIds],
    );

  const toggleProduct =
    useCallback(
      (
        productId: string,
      ) => {
        setSelectedIds(
          (current) => {
            const next =
              toggleProductSelection(
                current,
                productId,
              );

            saveSelection(
              next,
            );

            return next;
          },
        );
      },
      [],
    );

  const clearSelection =
    useCallback(
      () => {
        setSelectedIds([]);

        saveSelection([]);
      },
      [],
    );

  const toggleProducts =
    useCallback(
      (
        productIds:
        readonly string[],
      ) => {
        setSelectedIds(
          (current) => {
            const allSelected =
              areAllProductsSelected(
                current,
                productIds,
              );

            const next =
              allSelected
                ? removeProductsFromSelection(
                    current,
                    productIds,
                  )
                : addProductsToSelection(
                    current,
                    productIds,
                  );

            saveSelection(
              next,
            );

            return next;
          },
        );
      },
      [],
    );

  const areAllSelected =
    useCallback(
      (
        productIds:
        readonly string[],
      ) =>
        areAllProductsSelected(
          selectedIds,
          productIds,
        ),
      [selectedIds],
    );

  return {
    selectedIds,
    selectedSet,

    selectedCount:
      selectedIds.length,

    toggleProduct,
    toggleProducts,

    areAllSelected,

    clearSelection,
  };
}
