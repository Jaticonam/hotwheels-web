import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Check,
  PackagePlus,
} from "lucide-react";

interface ProductCardActionsProps {
  productTitle: string;
  canAddToCart: boolean;
  addToCartLabel: string;
  onAddToCart: () => boolean;
}

const SUCCESS_DURATION_MS = 900;

export function ProductCardActions({
  productTitle,
  canAddToCart,
  addToCartLabel,
  onAddToCart,
}: ProductCardActionsProps) {
  const [
    addedSuccessfully,
    setAddedSuccessfully,
  ] = useState(false);

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

  const handleClick = () => {
    const added =
      onAddToCart();

    if (!added) {
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
      : addToCartLabel;

  return (
    <div className="product-card-actions">
      <button
        type="button"
        onClick={handleClick}
        disabled={!canAddToCart}
        className={[
          "product-card-button",
          "product-card-button-cart",
          addedSuccessfully
            ? "product-card-button-success"
            : "",
          !canAddToCart
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