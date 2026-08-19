import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Check,
  MessageCircle,
  PackagePlus,
} from "lucide-react";

import type {
  ProductCardPrimaryActionType,
} from "./ProductCard.utils";

interface ProductCardActionsProps {
  productTitle: string;
  actionType: ProductCardPrimaryActionType;
  actionLabel: string;
  onAction: () => boolean;
}

const SUCCESS_DURATION_MS = 900;

export function ProductCardActions({
  productTitle,
  actionType,
  actionLabel,
  onAction,
}: ProductCardActionsProps) {
  const [
    addedSuccessfully,
    setAddedSuccessfully,
  ] =
    useState(false);

  const successTimerRef =
    useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (
        successTimerRef.current !== null
      ) {
        window.clearTimeout(
          successTimerRef.current,
        );
      }
    };
  }, []);

  const disabled =
    actionType === "disabled";

  const isCart =
    actionType === "cart";

  const isWhatsApp =
    actionType === "whatsapp";

  const handleClick = () => {
    if (disabled) {
      return;
    }

    const completed =
      onAction();

    if (
      !completed ||
      !isCart
    ) {
      return;
    }

    setAddedSuccessfully(true);

    if (
      successTimerRef.current !== null
    ) {
      window.clearTimeout(
        successTimerRef.current,
      );
    }

    successTimerRef.current =
      window.setTimeout(
        () => {
          setAddedSuccessfully(false);
          successTimerRef.current = null;
        },
        SUCCESS_DURATION_MS,
      );
  };

  const buttonLabel =
    addedSuccessfully
      ? "Agregado a Mi Box"
      : actionLabel;

  return (
    <div className="product-card-actions">
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        className={[
          "product-card-button",
          isWhatsApp
            ? "product-card-button-whatsapp"
            : "product-card-button-cart",
          addedSuccessfully
            ? "product-card-button-success"
            : "",
          disabled
            ? "product-card-button-disabled"
            : "",
        ].join(" ")}
        aria-label={`${buttonLabel}: ${productTitle}`}
      >
        <span
          className="product-card-button-highlight"
          aria-hidden="true"
        />

        <span className="product-card-button-content">
          <span className="product-card-button-icon-shell">
            {addedSuccessfully ? (
              <Check
                className="product-card-button-icon"
                aria-hidden="true"
              />
            ) : isWhatsApp ? (
              <MessageCircle
                className="product-card-button-icon"
                aria-hidden="true"
              />
            ) : (
              <PackagePlus
                className="product-card-button-icon"
                aria-hidden="true"
              />
            )}
          </span>

          <span
            className="product-card-button-label"
            aria-live="polite"
          >
            {buttonLabel}
          </span>
        </span>

        <span
          className="product-card-button-collector-accent"
          aria-hidden="true"
        />
      </button>
    </div>
  );
}
