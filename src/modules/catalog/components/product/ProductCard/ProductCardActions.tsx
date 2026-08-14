import {
  MessageCircle,
  ShoppingCart,
} from "lucide-react";

interface ProductCardActionsProps {
  productTitle: string;
  canAddToCart: boolean;
  addToCartLabel: string;
  onAddToCart: () => void;
  onWhatsApp: () => void;
}

export function ProductCardActions({
  productTitle,
  canAddToCart,
  addToCartLabel,
  onAddToCart,
  onWhatsApp,
}: ProductCardActionsProps) {
  return (
    <div className="product-card-actions">
      <button
        type="button"
        onClick={onAddToCart}
        disabled={!canAddToCart}
        className={[
          "product-card-button",
          "product-card-button-cart",
          !canAddToCart
            ? "product-card-button-disabled"
            : "",
        ].join(" ")}
        aria-label={`${addToCartLabel}: ${productTitle}`}
      >
        <ShoppingCart className="w-4 h-4" />

        <span>
          {addToCartLabel}
        </span>
      </button>

      <button
        type="button"
        onClick={onWhatsApp}
        className="product-card-button product-card-button-whatsapp"
        aria-label={`Consultar ${productTitle} por WhatsApp`}
      >
        <MessageCircle className="w-4 h-4" />

        <span>
          Consulta WhatsApp
        </span>
      </button>
    </div>
  );
}