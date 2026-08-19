import {
  describe,
  expect,
  it,
} from "vitest";

import {
  addProductsToSelection,
  areAllProductsSelected,
  keepAvailableProductSelection,
  removeProductsFromSelection,
  toggleProductSelection,
} from "./ProductSelection";

describe(
  "ProductSelection",
  () => {
    it(
      "selecciona y deselecciona un producto",
      () => {
        const selected =
          toggleProductSelection(
            [],
            "HW001",
          );

        expect(
          selected,
        ).toEqual([
          "HW001",
        ]);

        expect(
          toggleProductSelection(
            selected,
            "HW001",
          ),
        ).toEqual([]);
      },
    );

    it(
      "agrega productos sin duplicarlos",
      () => {
        expect(
          addProductsToSelection(
            [
              "HW001",
            ],
            [
              "HW001",
              "HW002",
              "HW003",
            ],
          ),
        ).toEqual([
          "HW001",
          "HW002",
          "HW003",
        ]);
      },
    );

    it(
      "quita un conjunto de productos",
      () => {
        expect(
          removeProductsFromSelection(
            [
              "HW001",
              "HW002",
              "HW003",
            ],
            [
              "HW002",
              "HW003",
            ],
          ),
        ).toEqual([
          "HW001",
        ]);
      },
    );

    it(
      "elimina ids que ya no existen en el catálogo",
      () => {
        expect(
          keepAvailableProductSelection(
            [
              "HW001",
              "HW002",
              "HW999",
            ],
            [
              "HW001",
              "HW002",
            ],
          ),
        ).toEqual([
          "HW001",
          "HW002",
        ]);
      },
    );

    it(
      "determina si todos los productos visibles están seleccionados",
      () => {
        expect(
          areAllProductsSelected(
            [
              "HW001",
              "HW002",
              "HW003",
            ],
            [
              "HW001",
              "HW003",
            ],
          ),
        ).toBe(true);

        expect(
          areAllProductsSelected(
            [
              "HW001",
            ],
            [
              "HW001",
              "HW003",
            ],
          ),
        ).toBe(false);
      },
    );
  },
);
