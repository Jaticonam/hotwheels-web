import type { Product } from "@/shared/types/product";

export function getCatalogUrl(): string {
  return "/catalogo";
}

export function getCategoryUrl(categoryId: string): string {
  return `/catalogo/categoria.html?cat=${encodeURIComponent(categoryId)}`;
}

export function getProductDetailUrl(
  productId: string,
  categoryId?: string,
): string {
  const params = new URLSearchParams({
    id: productId,
  });

  if (categoryId) {
    params.set("cat", categoryId);
  }

  return `/catalogo/producto.html?${params.toString()}`;
}

export function getProductUrl(product: Product): string {
  return getProductDetailUrl(product.id, product.category);
}