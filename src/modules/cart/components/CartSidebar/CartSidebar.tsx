import { ProductImage } from "../../../../shared/components/media/ProductImage";
import "./CartSidebar.css";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ArrowLeft,
  MessageCircle,
  Minus,
  PackageOpen,
  Box,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import { BRAND_CONFIG } from "@/tenant/config/brand";

import type {
  CartItem,
} from "@/shared/types/product";

import { getEffectivePrice } from "@/domain/product/pricing";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onContinueShopping?: () => void;

  cart: CartItem[];

  totalItems: number;
  totalPrice: number;
  savings: number;

  onRemove: (
    id: string,
  ) => void;

  onChangeQty: (
    id: string,
    delta: number,
  ) => void;

  onSetQty: (
    id: string,
    qty: number | null,
  ) => void;
}

function checkout(
  cart: CartItem[],
  total: number,
): void {
  if (
    cart.length === 0
  ) {
    return;
  }

  let message =
    "Hola, quiero realizar este pedido de coleccionables:\n\n";

  cart.forEach(
    (item) => {
      const price =
        getEffectivePrice(
          item,
        );

      const subtotal =
        price *
        item.qty;

      message +=
        `• *${item.title}*\n`;

      message +=
        `  ID: ${item.id}\n`;

      message +=
        `  Cantidad: ${item.qty}\n`;

      message +=
        `  Precio unitario: S/ ${price.toFixed(2)}\n`;

      message +=
        `  Subtotal: S/ ${subtotal.toFixed(2)}\n\n`;
    },
  );

  message +=
    "━━━━━━━━━━━━━━━\n";

  message +=
    `*TOTAL: S/ ${total.toFixed(2)}*\n\n`;

  message +=
    "Quiero confirmar disponibilidad y coordinar mi pedido.";

  const url =
    `https://wa.me/${BRAND_CONFIG.contact.whatsapp}?text=${encodeURIComponent(message)}`;

  window.open(
    url,
    "_blank",
    "noopener,noreferrer",
  );
}

function QtyInput({
  item,
  onSetQty,
}: {
  item: CartItem;

  onSetQty: (
    id: string,
    qty: number | null,
  ) => void;
}) {
  const [
    qtyInput,
    setQtyInput,
  ] =
    useState(
      String(item.qty),
    );

  const [
    isEditing,
    setIsEditing,
  ] =
    useState(false);

  useEffect(() => {
    if (!isEditing) {
      setQtyInput(
        String(item.qty),
      );
    }
  }, [
    item.qty,
    isEditing,
  ]);

  return (
    <input
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      value={qtyInput}
      onFocus={() =>
        setIsEditing(true)
      }
      onBlur={() => {
        setIsEditing(false);
        setQtyInput(
          String(item.qty),
        );
      }}
      onChange={(event) => {
        const value =
          event.target.value;

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

        onSetQty(
          item.id,
          parseInt(
            value,
            10,
          ),
        );
      }}
      className="cart-sidebar-qty-input"
      aria-label={`Cantidad de ${item.title}`}
    />
  );
}

function CartRow({
  item,
  onRemove,
  onChangeQty,
  onSetQty,
}: {
  item: CartItem;

  onRemove: (
    id: string,
  ) => void;

  onChangeQty: (
    id: string,
    delta: number,
  ) => void;

  onSetQty: (
    id: string,
    qty: number | null,
  ) => void;
}) {
  const activePrice =
    getEffectivePrice(item);

  const subtotal =
    activePrice *
    item.qty;

  const prevQtyRef =
    useRef(item.qty);

  const [
    qtyPulse,
    setQtyPulse,
  ] =
    useState(false);

  useEffect(() => {
    if (
      prevQtyRef.current !==
      item.qty
    ) {
      setQtyPulse(true);

      const timer =
        setTimeout(
          () =>
            setQtyPulse(false),
          220,
        );

      prevQtyRef.current =
        item.qty;

      return () =>
        clearTimeout(timer);
    }
  }, [item.qty]);

  const hasStockLimit =
    item.stock !== null &&
    item.stock !== undefined;

  const atStockLimit =
    hasStockLimit &&
    item.qty >=
      Number(item.stock);

  return (
    <article
      className={[
        "cart-sidebar-item",
        qtyPulse
          ? "cart-sidebar-item-pulse"
          : "",
      ].join(" ")}
    >
      <div className="cart-sidebar-item-main">
        <div className="cart-sidebar-item-img">
          <ProductImage
            src={
              item.img ||
              "/placeholder.svg"
            }
            alt={item.title}
          />
        </div>

        <div className="cart-sidebar-item-info">
          <div className="cart-sidebar-item-top">
            <div>
              <h4>
                {item.title}
              </h4>

              <p className="cart-sidebar-item-code">
                ID {item.id}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                onRemove(
                  item.id,
                )
              }
              className="cart-sidebar-remove"
              aria-label={`Eliminar ${item.title}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="cart-sidebar-item-price-row">
            <div>
              <span>
                Subtotal
              </span>

              <strong>
                S/{" "}
                {subtotal.toFixed(
                  2,
                )}
              </strong>
            </div>

            <div className="cart-sidebar-unit-price">
              S/{" "}
              {activePrice.toFixed(
                2,
              )} c/u
            </div>
          </div>

          <div className="cart-sidebar-item-controls">
            <div className="cart-sidebar-qty">
              <button
                type="button"
                onClick={() =>
                  onChangeQty(
                    item.id,
                    -1,
                  )
                }
                aria-label={`Disminuir cantidad de ${item.title}`}
              >
                <Minus className="w-4 h-4" />
              </button>

              <QtyInput
                item={item}
                onSetQty={
                  onSetQty
                }
              />

              <button
                type="button"
                onClick={() =>
                  onChangeQty(
                    item.id,
                    1,
                  )
                }
                disabled={
                  atStockLimit
                }
                aria-label={`Aumentar cantidad de ${item.title}`}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {hasStockLimit && (
              <span className="cart-sidebar-stock">
                Stock: {item.stock}
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export function CartSidebar({
  isOpen,
  onClose,
  onContinueShopping,
  cart,
  totalItems,
  totalPrice,
  savings,
  onRemove,
  onChangeQty,
  onSetQty,
}: CartSidebarProps) {
  if (!isOpen) {
    return null;
  }

  const continueShopping =
    onContinueShopping ??
    onClose;

  return (
    <div
      className="cart-sidebar-overlay"
      onClick={onClose}
    >
      <aside
        className="cart-sidebar-panel"
        onClick={(
          event,
        ) =>
          event.stopPropagation()
        }
        aria-label="Mi Box"
      >
        <header className="cart-sidebar-header">
          <div className="cart-sidebar-title-wrap">
            <div className="cart-sidebar-icon">
              <Box className="w-5 h-5" />
            </div>

            <div>
              <span className="cart-sidebar-kicker">
                Tu selección
              </span>

              <h2>
                Mi Box
              </h2>

              <p>
                {totalItems}{" "}
                {totalItems === 1
                  ? "unidad"
                  : "unidades"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="cart-sidebar-close"
            aria-label="Cerrar Mi Box"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        <div className="cart-sidebar-body">
          {cart.length === 0 ? (
            <div className="cart-sidebar-empty">
              <div className="cart-sidebar-empty-icon">
                <PackageOpen className="w-8 h-8" />
              </div>

              <p>
                Aún no agregaste modelos a Mi Box.
              </p>

              <small>
                Explora el catálogo y arma tu selección.
              </small>

              <button
                type="button"
                onClick={
                  continueShopping
                }
              >
                Explorar catálogo
              </button>
            </div>
          ) : (
            cart.map(
              (item) => (
                <CartRow
                  key={item.id}
                  item={item}
                  onRemove={onRemove}
                  onChangeQty={
                    onChangeQty
                  }
                  onSetQty={
                    onSetQty
                  }
                />
              ),
            )
          )}
        </div>

        <footer className="cart-sidebar-footer">
          {savings > 0 && (
            <div className="cart-sidebar-benefit">
              <span>
                Ahorro por ofertas
              </span>

              <strong>
                S/{" "}
                {savings.toFixed(
                  2,
                )}
              </strong>
            </div>
          )}

          <div className="cart-sidebar-summary">
            <div>
              <span>
                Unidades
              </span>

              <strong>
                {totalItems}
              </strong>
            </div>

            <div className="cart-sidebar-total-wrap">
              <span>
                Total
              </span>

              <div className="cart-sidebar-total">
                <small>
                  S/
                </small>

                <strong>
                  {totalPrice.toFixed(
                    2,
                  )}
                </strong>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              checkout(
                cart,
                totalPrice,
              )
            }
            disabled={
              cart.length === 0
            }
            className={[
              "cart-sidebar-checkout",
              cart.length > 0
                ? "cart-sidebar-checkout-active"
                : "cart-sidebar-checkout-disabled",
            ].join(" ")}
          >
            <MessageCircle className="w-5 h-5" />

            <span>
              Enviar pedido por WhatsApp
            </span>
          </button>

          <button
            type="button"
            onClick={
              continueShopping
            }
            className="cart-sidebar-continue"
          >
            <ArrowLeft className="w-4 h-4" />

            <span>
              Seguir comprando
            </span>
          </button>

          <p className="cart-sidebar-checkout-note">
            Confirmaremos stock y disponibilidad antes de cerrar el pedido.
          </p>
        </footer>
      </aside>
    </div>
  );
}
