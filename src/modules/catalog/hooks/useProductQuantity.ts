import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  clampProductQuantity,
  getProductQuantityLimit,
  isProductQuantityValid,
} from "./productQuantity.utils";

interface UseProductQuantityOptions {
  initialQty?: number;
  unitPrice?: number;
  maxQty?: number | null;
}

export function useProductQuantity({
  initialQty = 1,
  unitPrice = 0,
  maxQty = null,
}: UseProductQuantityOptions = {}) {
  const [
    qty,
    setQty,
  ] =
    useState(initialQty);

  const [
    qtyInput,
    setQtyInput,
  ] =
    useState(
      String(initialQty),
    );

  const maxQtyLimit =
    useMemo(
      () =>
        getProductQuantityLimit(
          maxQty,
        ),
      [maxQty],
    );

  const parsedQtyInput =
    useMemo(() => {
      if (
        qtyInput.trim() === ""
      ) {
        return null;
      }

      if (
        !/^\d+$/.test(
          qtyInput,
        )
      ) {
        return null;
      }

      return parseInt(
        qtyInput,
        10,
      );
    }, [qtyInput]);

  const isQtyInputValid =
    isProductQuantityValid(
      parsedQtyInput,
      maxQtyLimit,
    );

  const effectiveQty =
    isQtyInputValid
      ? parsedQtyInput
      : qty;

  const total =
    unitPrice *
    effectiveQty;

  const atMaxQty =
    maxQtyLimit !== null &&
    maxQtyLimit > 0 &&
    effectiveQty >=
      maxQtyLimit;

  const updateQty =
    useCallback(
      (
        newQty: number,
      ) => {
        const safeQty =
          clampProductQuantity(
            newQty,
            maxQtyLimit,
          );

        setQty(safeQty);

        setQtyInput(
          String(safeQty),
        );
      },
      [maxQtyLimit],
    );

  const resetQty =
    useCallback(() => {
      const safeInitialQty =
        clampProductQuantity(
          initialQty,
          maxQtyLimit,
        );

      setQty(
        safeInitialQty,
      );

      setQtyInput(
        String(
          safeInitialQty,
        ),
      );
    }, [
      initialQty,
      maxQtyLimit,
    ]);

  useEffect(() => {
    const safeQty =
      clampProductQuantity(
        qty,
        maxQtyLimit,
      );

    if (
      safeQty !== qty
    ) {
      setQty(safeQty);
      setQtyInput(
        String(safeQty),
      );
    }
  }, [
    maxQtyLimit,
    qty,
  ]);

  const handleQtyInputChange =
    useCallback(
      (value: string) => {
        if (
          value === ""
        ) {
          setQtyInput("");
          return;
        }

        if (
          !/^\d+$/.test(
            value,
          )
        ) {
          return;
        }

        setQtyInput(value);

        const parsed =
          parseInt(
            value,
            10,
          );

        if (
          isProductQuantityValid(
            parsed,
            maxQtyLimit,
          )
        ) {
          setQty(parsed);
        }
      },
      [maxQtyLimit],
    );

  const handleQtyInputBlur =
    useCallback(() => {
      const parsed =
        parseInt(
          qtyInput,
          10,
        );

      if (
        Number.isNaN(
          parsed,
        )
      ) {
        updateQty(1);
        return;
      }

      updateQty(parsed);
    }, [
      qtyInput,
      updateQty,
    ]);

  const handleQtyInputKeyDown =
    useCallback(
      (
        event:
          React.KeyboardEvent<HTMLInputElement>,
      ) => {
        if (
          event.key ===
          "Enter"
        ) {
          event.currentTarget.blur();
        }

        if (
          event.key ===
          "ArrowUp"
        ) {
          event.preventDefault();

          updateQty(
            effectiveQty + 1,
          );
        }

        if (
          event.key ===
          "ArrowDown"
        ) {
          event.preventDefault();

          updateQty(
            effectiveQty - 1,
          );
        }
      },
      [
        effectiveQty,
        updateQty,
      ],
    );

  return {
    qty,
    qtyInput,
    parsedQtyInput,
    isQtyInputValid,
    effectiveQty,
    total,

    maxQty:
      maxQtyLimit,
    atMaxQty,

    setQty,
    setQtyInput,
    updateQty,
    resetQty,

    handleQtyInputChange,
    handleQtyInputBlur,
    handleQtyInputKeyDown,
  };
}