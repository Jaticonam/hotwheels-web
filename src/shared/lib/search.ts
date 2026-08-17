import type { Product } from "@/shared/types/product";

const SEARCH_SYNONYMS: Record<string, string[]> = {
  deportivo: [
    "deportivo",
    "deportivos",
    "sport",
    "sports",
  ],
  deportivos: [
    "deportivo",
    "deportivos",
    "sport",
    "sports",
  ],
  sport: [
    "deportivo",
    "deportivos",
    "sport",
    "sports",
  ],
  sports: [
    "deportivo",
    "deportivos",
    "sport",
    "sports",
  ],

  coleccionable: [
    "coleccionable",
    "coleccionables",
  ],
  coleccionables: [
    "coleccionable",
    "coleccionables",
  ],

  tematico: [
    "tematico",
    "tematicos",
  ],
  tematicos: [
    "tematico",
    "tematicos",
  ],

  clasico: [
    "clasico",
    "clasicos",
  ],
  clasicos: [
    "clasico",
    "clasicos",
  ],

  premium: [
    "premium",
  ],
};

export const normalize = (
  value: unknown,
): string =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\s\-_./]+/g, "");

function getSearchVariants(
  query: string,
): string[] {
  const normalized =
    normalize(query);

  if (!normalized) {
    return [];
  }

  const synonyms =
    SEARCH_SYNONYMS[
      normalized
    ] ?? [];

  return Array.from(
    new Set([
      normalized,
      ...synonyms.map(
        normalize,
      ),
    ]),
  );
}

function includesTerm(
  field: string,
  term: string,
  score: number,
): number {
  if (
    term.length < 2 ||
    !field.includes(term)
  ) {
    return 0;
  }

  return score;
}

function scoreProduct(
  product: Product,
  term: string,
): number {
  const id =
    normalize(product.id);

  const title =
    normalize(product.title);

  const miniSeries =
    normalize(
      product.mini_series,
    );

  const year =
    normalize(product.year);

  const caseCode =
    normalize(
      product.case_code,
    );

  const cardNumber =
    normalize(
      product.card_number,
    );

  const caseLabels =
    normalize(
      `case ${product.case_code ?? ""} caja ${product.case_code ?? ""}`,
    );

  const cardLabels =
    normalize(
      `card ${product.card_number ?? ""} tarjeta ${product.card_number ?? ""}`,
    );

  const yearLabels =
    normalize(
      `year ${product.year ?? ""} año ${product.year ?? ""}`,
    );

  const description =
    normalize(
      product.description,
    );

  const category =
    normalize(
      product.category,
    );

  const categories =
    normalize(
      (product.categories ?? [])
        .join(" "),
    );

  const badges =
    normalize(
      (product.badges ?? [])
        .join(" "),
    );

  const attributes =
    normalize(
      (product.attributes ?? [])
        .join(" "),
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

  if (caseCode === term) {
    score += 900;
  }

  if (cardNumber === term) {
    score += 880;
  }
  else if (
    term.length >= 2 &&
    cardNumber.startsWith(term)
  ) {
    score += 620;
  }

  if (year === term) {
    score += 820;
  }

  score +=
    includesTerm(
      caseLabels,
      term,
      520,
    );

  score +=
    includesTerm(
      cardLabels,
      term,
      500,
    );

  score +=
    includesTerm(
      yearLabels,
      term,
      460,
    );

  score +=
    includesTerm(
      title,
      term,
      320,
    );

  score +=
    includesTerm(
      miniSeries,
      term,
      290,
    );

  score +=
    includesTerm(
      attributes,
      term,
      250,
    );

  score +=
    includesTerm(
      description,
      term,
      180,
    );

  score +=
    includesTerm(
      category,
      term,
      120,
    );

  score +=
    includesTerm(
      categories,
      term,
      120,
    );

  score +=
    includesTerm(
      badges,
      term,
      100,
    );

  return score;
}

export const searchProducts = (
  products: Product[],
  query: string,
): Product[] => {
  const variants =
    getSearchVariants(query);

  if (
    variants.length === 0
  ) {
    return products;
  }

  return products
    .map((product) => {
      const score =
        Math.max(
          ...variants.map(
            (term) =>
              scoreProduct(
                product,
                term,
              ),
          ),
        );

      return {
        product,
        score,
      };
    })
    .filter(
      ({ score }) =>
        score > 0,
    )
    .sort(
      (a, b) =>
        b.score - a.score,
    )
    .map(
      ({ product }) =>
        product,
    );
};