import {
  MessageCircle,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingCart,
} from "lucide-react";

import {
  PRODUCT_DETAIL_CONFIG,
} from "@/tenant/config/product";

import "./ProductBuyBox.css";

interface ProductBuyBoxQuantity {
  qtyInput: string;
  effectiveQty: number;
  total: number;
  isQtyInputValid: boolean;

  maxQty:
    number | null;

  atMaxQty: boolean;

  updateQty:
    (qty: number) => void;

  handleQtyInputChange:
    (value: string) => void;

  handleQtyInputBlur:
    () => void;

  handleQtyInputKeyDown:
    (
      event:
        React.KeyboardEvent<HTMLInputElement>,
    ) => void;
}

interface ProductBuyBoxProps {
  finalPrice: number;
  originalPrice: number;
  hasOffer: boolean;

  quantity:
    ProductBuyBoxQuantity;

  available: boolean;

  onAddToCart:
    () => void;

  onWhatsApp:
    () => void;
}

export function ProductBuyBox({
  finalPrice,
  originalPrice,
  hasOffer,
  quantity,
  available,
  onAddToCart,
  onWhatsApp,
}: ProductBuyBoxProps) {
  const noRemainingStock =
    quantity.maxQty === 0;

  return (
    <div className="product-detail-buy-box">
      <div className="product-detail-price-box">
        <p>
          {
            PRODUCT_DETAIL_CONFIG
              .price
              .label
          }
        </p>

        {hasOffer && (
          <small className="product-detail-old-price">
            Antes S/{" "}
            {originalPrice.toFixed(
              2,
            )}
          </small>
        )}

        <div className="product-detail-price">
          <span>
            S/
          </span>

          <strong>
            {finalPrice.toFixed(
              2,
            )}
          </strong>
        </div>

        {hasOffer && (
          <span className="product-detail-offer-label">
            Precio especial
          </span>
        )}
      </div>

      <div className="product-detail-qty-box">
        <div>
          <p>
            {
              PRODUCT_DETAIL_CONFIG
                .quantity
                .label
            }
          </p>

          {quantity.maxQty !==
            null && (
            <small>
              {noRemainingStock
                ? "Ya tienes todo el stock disponible en tu carrito."
                : `Disponible para agregar: ${quantity.maxQty}`}
            </small>
          )}
        </div>

        <div className="product-detail-qty-control">
          <button
            type="button"
            onClick={() =>
              quantity.updateQty(
                quantity.effectiveQty -
                  1,
              )
            }
            disabled={
              quantity.effectiveQty <=
              1 ||
              noRemainingStock
            }
            aria-label="Disminuir cantidad"
          >
            <Minus className="w-4 h-4" />
          </button>

          <input
            value={
              quantity.qtyInput
            }
            onChange={(
              event,
            ) =>
              quantity
                .handleQtyInputChange(
                  event.target
                    .value,
                )
            }
            onBlur={
              quantity
                .handleQtyInputBlur
            }
            onKeyDown={
              quantity
                .handleQtyInputKeyDown
            }
            inputMode="numeric"
            aria-label="Cantidad a agregar"
            disabled={
              noRemainingStock
            }
          />

          <button
            type="button"
            onClick={() =>
              quantity.updateQty(
                quantity.effectiveQty +
                  1,
              )
            }
            disabled={
              quantity.atMaxQty ||
              noRemainingStock
            }
            aria-label="Aumentar cantidad"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!quantity.isQtyInputValid &&
        !noRemainingStock && (
        <small className="product-detail-error">
          {
            PRODUCT_DETAIL_CONFIG
              .quantity
              .invalidMessage
          }
        </small>
      )}

      <div className="product-detail-total">
        <span>
          Total
        </span>

        <strong>
          S/{" "}
          {quantity.total.toFixed(
            2,
          )}
        </strong>
      </div>

      <div className="product-detail-actions">
        <button
          type="button"
          className="product-detail-primary-button"
          onClick={
            onAddToCart
          }
          disabled={
            !available ||
            !quantity
              .isQtyInputValid
          }
        >
          <ShoppingCart className="w-5 h-5" />

          Agregar al carrito
        </button>

        <button
          type="button"
          className="product-detail-whatsapp-button"
          onClick={
            onWhatsApp
          }
        >
          <MessageCircle className="w-5 h-5" />

          Consultar por WhatsApp
        </button>
      </div>

      <div className="product-detail-trust">
        <ShieldCheck className="w-4 h-4" />

        <span>
          {
            PRODUCT_DETAIL_CONFIG
              .trust
              .text
          }
        </span>
      </div>
    </div>
  );
}