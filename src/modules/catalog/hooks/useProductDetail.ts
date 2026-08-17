import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { productSource } from "@/infrastructure/catalog/productSource";

import {
  getEffectivePrice,
  getOriginalProductPrice,
  getProductState,
  hasOfferPrice,
  isProductAvailable,
} from "@/domain/product";

import type { Product } from "@/shared/types/product";

interface UseProductDetailOptions {
  productId?: string;
}

function cleanText(
  value: unknown,
): string {
  return String(value ?? "").trim();
}

function safeDecode(
  value: string,
): string {
  try {
    return decodeURIComponent(value);
  }
  catch {
    return value;
  }
}

function normalizeLookup(
  value: unknown,
): string {
  return safeDecode(
    cleanText(value),
  )
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/_/g, "-")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function matchesProduct(
  product: Product,
  productId: string,
): boolean {
  const lookup =
    normalizeLookup(productId);

  if (!lookup) {
    return false;
  }

  const candidates = [
    product.id,
    product.title,
  ];

  return candidates.some(
    (candidate) =>
      normalizeLookup(candidate) ===
      lookup,
  );
}

export function useProductDetail({
  productId,
}: UseProductDetailOptions) {
  const [products, setProducts] =
    useState<Product[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [loadError, setLoadError] =
    useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    setLoading(true);
    setLoadError(null);

    productSource.loadAllProducts()
      .then((data) => {
        if (!mounted) return;

        setProducts(data);
      })
      .catch((error) => {
        if (!mounted) return;

        console.error(
          "Error cargando producto:",
          error,
        );

        setProducts([]);

        setLoadError(
          error instanceof Error
            ? error
            : new Error(String(error)),
        );
      })
      .finally(() => {
        if (!mounted) return;

        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const product =
    useMemo(() => {
      if (!productId) {
        return undefined;
      }

      return products.find(
        (item) =>
          matchesProduct(
            item,
            productId,
          ),
      );
    }, [
      products,
      productId,
    ]);

  const available =
    product
      ? isProductAvailable(product)
      : false;

  const originalPrice =
    product
      ? getOriginalProductPrice(product)
      : 0;

  const finalPrice =
    product
      ? getEffectivePrice(product)
      : 0;

  const hasOffer =
    product
      ? hasOfferPrice(product)
      : false;

  const productState =
    product
      ? getProductState(product)
      : {
          type: "unavailable",
          label: "No disponible",
          available: false,
        };

  return {
    product,
    loading,
    loadError,
    notFound:
      !loading && !product,

    available,
    originalPrice,
    finalPrice,
    hasOffer,
    productState,
  };
}