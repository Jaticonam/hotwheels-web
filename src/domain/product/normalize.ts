import type { Product } from "@/shared/types/product";

export function ensureCatalogProduct(
  product: Partial<Product>,
): Product {
  const category =
    product.category ?? "";

  const price =
    Number(product.price) || 0;

  const offerPrice =
    product.offer_price !== null &&
    product.offer_price !== undefined &&
    Number(product.offer_price) > 0
      ? Number(product.offer_price)
      : null;

  return {
    id:
      product.id ?? "",

    title:
      product.title ?? "",

    description:
      product.description ?? "",

    category,

    categories:
      product.categories &&
      product.categories.length > 0
        ? product.categories
        : [category].filter(Boolean),

    price,

    offer_price:
      offerPrice,

    stock:
      product.stock === null ||
      product.stock === undefined
        ? null
        : Number(product.stock),

    img:
      product.img ?? "",

    images:
      product.images ?? [],

    priority:
      Number(product.priority) || 0,

    status:
      product.status ?? "Publicado",

    badges:
      product.badges ?? [],

    attributes:
      product.attributes ?? [],

    year:
      product.year ?? null,

    case_code:
      product.case_code ?? "",

    card_number:
      product.card_number ?? "",

    mini_series:
      product.mini_series ?? "",

    explore_tags:
      Array.isArray(
        product.explore_tags,
      )
        ? product.explore_tags
        : [],

    series:
      product.series ?? "",

    collection:
      product.collection ?? "",

    set_number:
      product.set_number ?? "",

    format:
      product.format ?? "",

    rarity:
      product.rarity ?? "",

    manufacturer:
      product.manufacturer ?? "",

    franchise:
      product.franchise ?? "",

    style:
      product.style ?? "",

    exclusivity:
      product.exclusivity ?? "",

    updated_at:
      product.updated_at,
  };
}

export function normalizeProducts(
  products: Partial<Product>[],
): Product[] {
  return products.map(
    ensureCatalogProduct,
  );
}
