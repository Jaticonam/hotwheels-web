import {
  describe,
  expect,
  it,
} from "vitest";

import {
  clampProductQuantity,
  getProductQuantityLimit,
  isProductQuantityValid,
} from "./productQuantity.utils";

describe(
  "product quantity rules",
  () => {
    it(
      "mantiene cantidad sin límite",
      () => {
        expect(
          clampProductQuantity(
            7,
            null,
          ),
        ).toBe(7);
      },
    );

    it(
      "limita cantidad al stock",
      () => {
        expect(
          clampProductQuantity(
            9,
            4,
          ),
        ).toBe(4);
      },
    );

    it(
      "no baja de uno",
      () => {
        expect(
          clampProductQuantity(
            -3,
            8,
          ),
        ).toBe(1);
      },
    );

    it(
      "marca inválido si supera stock",
      () => {
        expect(
          isProductQuantityValid(
            5,
            4,
          ),
        ).toBe(false);

        expect(
          isProductQuantityValid(
            4,
            4,
          ),
        ).toBe(true);
      },
    );

    it(
      "stock cero no permite cantidad",
      () => {
        expect(
          getProductQuantityLimit(
            0,
          ),
        ).toBe(0);

        expect(
          isProductQuantityValid(
            1,
            0,
          ),
        ).toBe(false);
      },
    );
  },
);