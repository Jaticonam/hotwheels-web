import {
  describe,
  expect,
  it,
} from "vitest";

import type {
  Product,
} from "@/shared/types/product";

import {
  diffCatalogProducts,
} from "./catalogSync.service";

function product(
  id: string,
  overrides:
  Partial<Product> = {},
): Product {
  return {
    id,
    title: `Auto ${id}`,
    description: "",

    category: "deportivos",
    categories: [
      "deportivos",
    ],

    price: 19.9,
    offer_price: null,

    stock: 4,

    img: "",
    images: [],

    priority: 0,
    status: "Publicado",

    badges: [],
    attributes: [],

    ...overrides,
  };
}

describe(
  "catalogSync.service",
  () => {
    it(
      "detecta nuevos, modificados, retirados y sin cambios",
      () => {
        const previous = [
          product("A"),
          product("B"),
          product("C"),
        ];

        const current = [
          product("A"),
          product(
            "B",
            {
              stock: 2,
            },
          ),
          product("D"),
        ];

        const diff =
          diffCatalogProducts(
            previous,
            current,
          );

        expect(
          diff.added.map(
            (item) => item.id,
          ),
        ).toEqual(["D"]);

        expect(
          diff.updated.map(
            (item) => item.id,
          ),
        ).toEqual(["B"]);

        expect(
          diff.removed.map(
            (item) => item.id,
          ),
        ).toEqual(["C"]);

        expect(
          diff.unchanged,
        ).toBe(1);

        expect(
          diff.totalPrevious,
        ).toBe(3);

        expect(
          diff.totalCurrent,
        ).toBe(3);
      },
    );

    it(
      "no reporta cambios para snapshots equivalentes",
      () => {
        const previous = [
          product("A"),
          product("B"),
        ];

        const current = [
          product("A"),
          product("B"),
        ];

        const diff =
          diffCatalogProducts(
            previous,
            current,
          );

        expect(
          diff.added,
        ).toHaveLength(0);

        expect(
          diff.updated,
        ).toHaveLength(0);

        expect(
          diff.removed,
        ).toHaveLength(0);

        expect(
          diff.unchanged,
        ).toBe(2);
      },
    );
  },
);
