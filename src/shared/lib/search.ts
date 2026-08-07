import type { Product } from "@/shared/types/product";

export const normalize = (
  value: unknown,
) =>
  String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\s-_./]/g, "");

export const searchProducts = (
  products: Product[],
  query: string,
) => {
  const term =
    normalize(query.trim());

  if (!term) {
    return products;
  }

  return products
    .map((product) => {
      const id =
        normalize(product.id);

      const title =
        normalize(product.title);

      const description =
        normalize(product.description);

      const category =
        normalize(product.category);

      const categories =
        normalize(
          product.categories.join(" "),
        );

      const badges =
        normalize(
          product.badges.join(" "),
        );

      const attributes =
        normalize(
          product.attributes.join(" "),
        );

      let score = 0;

      if (id === term) {
        score += 1000;
      }
      else if (
        id.startsWith(term)
      ) {
        score += 700;
      }
      else if (
        term.length >= 3 &&
        id.includes(term)
      ) {
        score += 500;
      }

      if (title.includes(term)) {
        score += 300;
      }

      if (attributes.includes(term)) {
        score += 250;
      }

      if (description.includes(term)) {
        score += 180;
      }

      if (category.includes(term)) {
        score += 100;
      }

      if (categories.includes(term)) {
        score += 100;
      }

      if (badges.includes(term)) {
        score += 80;
      }

      return {
        product,
        score,
      };
    })
    .filter(
      (result) =>
        result.score > 0,
    )
    .sort(
      (a, b) =>
        b.score - a.score,
    )
    .map(
      (result) =>
        result.product,
    );
};