import type {
  Product,
} from "@/shared/types/product";

const STORAGE_KEY =
  "hwa:admin:catalog-sync:v1";

export interface CatalogSyncDiff {
  added: Product[];
  updated: Product[];
  removed: Product[];

  unchanged: number;

  totalPrevious: number;
  totalCurrent: number;
}

export interface CatalogSyncSnapshot {
  version: 1;
  syncedAt: string;
  products: Product[];
}

function comparableProduct(
  product: Product,
): string {
  return JSON.stringify({
    id: product.id,
    title: product.title,
    description:
      product.description,

    category:
      product.category,
    categories:
      product.categories,

    price:
      product.price,
    offer_price:
      product.offer_price,

    stock:
      product.stock,

    img:
      product.img,
    images:
      product.images ?? [],

    priority:
      product.priority,
    status:
      product.status,

    badges:
      product.badges,
    attributes:
      product.attributes,

    year:
      product.year ?? null,
    case_code:
      product.case_code ?? "",
    card_number:
      product.card_number ?? "",
    mini_series:
      product.mini_series ?? "",

    updated_at:
      product.updated_at ?? "",
  });
}

export function diffCatalogProducts(
  previous: Product[],
  current: Product[],
): CatalogSyncDiff {
  const previousById =
    new Map(
      previous.map(
        (product) => [
          product.id,
          product,
        ],
      ),
    );

  const currentById =
    new Map(
      current.map(
        (product) => [
          product.id,
          product,
        ],
      ),
    );

  const added: Product[] = [];
  const updated: Product[] = [];
  const removed: Product[] = [];

  let unchanged = 0;

  current.forEach(
    (product) => {
      const previousProduct =
        previousById.get(
          product.id,
        );

      if (!previousProduct) {
        added.push(product);
        return;
      }

      if (
        comparableProduct(
          previousProduct,
        ) !==
        comparableProduct(
          product,
        )
      ) {
        updated.push(product);
        return;
      }

      unchanged += 1;
    },
  );

  previous.forEach(
    (product) => {
      if (
        !currentById.has(
          product.id,
        )
      ) {
        removed.push(product);
      }
    },
  );

  return {
    added,
    updated,
    removed,
    unchanged,

    totalPrevious:
      previous.length,

    totalCurrent:
      current.length,
  };
}

export function readCatalogSyncSnapshot():
CatalogSyncSnapshot | null {
  try {
    const raw =
      localStorage.getItem(
        STORAGE_KEY,
      );

    if (!raw) {
      return null;
    }

    const parsed =
      JSON.parse(
        raw,
      ) as CatalogSyncSnapshot;

    if (
      parsed.version !== 1 ||
      !Array.isArray(
        parsed.products,
      ) ||
      typeof parsed.syncedAt !==
        "string"
    ) {
      return null;
    }

    return parsed;
  }
  catch {
    return null;
  }
}

export function saveCatalogSyncSnapshot(
  products: Product[],
): CatalogSyncSnapshot {
  const snapshot:
  CatalogSyncSnapshot = {
    version: 1,
    syncedAt:
      new Date().toISOString(),
    products,
  };

  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(
        snapshot,
      ),
    );
  }
  catch {
    // El snapshot mejora la experiencia,
    // pero no debe bloquear la operación.
  }

  return snapshot;
}
