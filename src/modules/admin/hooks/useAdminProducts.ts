import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  productBelongsToCategory,
} from "@/domain/product/categories";

import {
  adminCatalogSource,
} from "@/infrastructure/admin/adminCatalogSource";

import {
  diffCatalogProducts,
  readCatalogSyncSnapshot,
  saveCatalogSyncSnapshot,
  type CatalogSyncDiff,
} from "@/modules/admin/services/catalogSync.service";

import type {
  Product,
} from "@/shared/types/product";

export type AdminProductStatusFilter =
  | "todos"
  | "publicado"
  | "preventa"
  | "agotado"
  | "oculto"
  | "borrador";

function normalizeText(
  value: string,
): string {
  return value
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function matchesSearch(
  product: Product,
  query: string,
): boolean {
  const normalizedQuery =
    normalizeText(query);

  if (!normalizedQuery) {
    return true;
  }

  const searchableValues = [
    product.id,
    product.title,
    product.description,
    product.mini_series ?? "",
    product.card_number ?? "",
    product.case_code ?? "",
    product.year?.toString() ?? "",
    product.category,
    ...(product.badges ?? []),
    ...(product.attributes ?? []),
  ];

  return searchableValues.some((value) =>
    normalizeText(value).includes(
      normalizedQuery,
    ),
  );
}

function matchesStatus(
  product: Product,
  status:
  AdminProductStatusFilter,
): boolean {
  if (status === "todos") {
    return true;
  }

  return (
    normalizeText(
      product.status,
    ) === status
  );
}

export function useAdminProducts() {
  const [
    products,
    setProducts,
  ] =
    useState<Product[]>([]);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    syncing,
    setSyncing,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null,
    );

  const [
    query,
    setQuery,
  ] =
    useState("");

  const [
    category,
    setCategory,
  ] =
    useState("todas");

  const [
    status,
    setStatus,
  ] =
    useState<
      AdminProductStatusFilter
    >(
      "todos",
    );

  const [
    syncResult,
    setSyncResult,
  ] =
    useState<
      CatalogSyncDiff | null
    >(
      null,
    );

  const [
    lastSyncedAt,
    setLastSyncedAt,
  ] =
    useState<string | null>(
      null,
    );

  const baselineRef =
    useRef<Product[]>([]);

  const loadInitialProducts =
    useCallback(
      async () => {
        setLoading(true);
        setError(null);

        try {
          const data =
            await adminCatalogSource
              .loadAllProducts();

          setProducts(data);

          const existingSnapshot =
            readCatalogSyncSnapshot();

          if (existingSnapshot) {
            baselineRef.current =
              existingSnapshot.products;

            setLastSyncedAt(
              existingSnapshot.syncedAt,
            );
          }
          else {
            const snapshot =
              saveCatalogSyncSnapshot(
                data,
              );

            baselineRef.current =
              data;

            setLastSyncedAt(
              snapshot.syncedAt,
            );
          }
        }
        catch (loadError) {
          console.error(
            "No se pudo cargar Hot Wheels Admin:",
            loadError,
          );

          setError(
            "No se pudo cargar el catálogo administrativo desde la fuente actual.",
          );

          setProducts([]);
        }
        finally {
          setLoading(false);
        }
      },
      [],
    );

  useEffect(() => {
    void loadInitialProducts();
  }, [loadInitialProducts]);

  const sync =
    useCallback(
      async () => {
        setSyncing(true);
        setError(null);

        try {
          const current =
            await adminCatalogSource
              .loadAllProducts();

          const storedSnapshot =
            readCatalogSyncSnapshot();

          const previous =
            storedSnapshot
              ?.products ??
            baselineRef.current;

          const diff =
            diffCatalogProducts(
              previous,
              current,
            );

          setProducts(
            current,
          );

          setSyncResult(
            diff,
          );

          const snapshot =
            saveCatalogSyncSnapshot(
              current,
            );

          baselineRef.current =
            current;

          setLastSyncedAt(
            snapshot.syncedAt,
          );
        }
        catch (syncError) {
          console.error(
            "No se pudo sincronizar Hot Wheels Admin:",
            syncError,
          );

          setError(
            "No se pudo sincronizar el catálogo con Google Sheets.",
          );
        }
        finally {
          setSyncing(false);
        }
      },
      [],
    );

  const filteredProducts =
    useMemo(
      () =>
        products.filter(
          (product) => {
            const categoryMatch =
              category === "todas" ||
              productBelongsToCategory(
                product,
                category,
              );

            return (
              categoryMatch &&
              matchesStatus(
                product,
                status,
              ) &&
              matchesSearch(
                product,
                query,
              )
            );
          },
        ),
      [
        products,
        category,
        status,
        query,
      ],
    );

  const statusCounts =
    useMemo(
      () => {
        const counts = {
          todos:
            products.length,
          publicado: 0,
          preventa: 0,
          agotado: 0,
          oculto: 0,
          borrador: 0,
        };

        products.forEach(
          (product) => {
            const normalized =
              normalizeText(
                product.status,
              );

            if (
              normalized in counts &&
              normalized !== "todos"
            ) {
              counts[
                normalized as Exclude<
                  AdminProductStatusFilter,
                  "todos"
                >
              ] += 1;
            }
          },
        );

        return counts;
      },
      [products],
    );

  return {
    products,
    filteredProducts,

    loading,
    syncing,
    error,

    query,
    setQuery,

    category,
    setCategory,

    status,
    setStatus,

    statusCounts,

    syncResult,
    lastSyncedAt,

    sync,
  };
}
