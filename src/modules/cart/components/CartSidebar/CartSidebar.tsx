import "./CartSidebar.css";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ShoppingBag,
  X,
  Minus,
  Plus,
  Trash2,
  MessageCircle,
} from "lucide-react";

import { BRAND_CONFIG } from "@/tenant/config/brand";

import type { CartItem } from "@/shared/types/product";

import { getEffectivePrice } from "@/domain/product/pricing";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;

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
    "Hola, quiero realizar este pedido:\n\n";

  cart.forEach(
    (item) => {
      const price =
        getEffectivePrice(
          item,
        );

      const subtotal =
        price * item.qty;

      message +=
        `• *${item.title}*\n`;

      message +=
        `  Código: ${item.id}\n`;

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
    `*TOTAL: S/ ${total.toFixed(2)}*`;

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
      onBlur={() =>
        setIsEditing(false)
      }
      onChange={(event) => {
        const value =
          event.target.value;

        if (
          value === ""
        ) {
          setQtyInput("");

          onSetQty(
            item.id,
            null,
          );

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
          <img
            src={
              item.img ||
              "/placeholder.svg"
            }
            alt={
              item.title
            }
          />
        </div>

        <div className="cart-sidebar-item-info">
          <div className="cart-sidebar-item-top">
            <div>
              <h4>
                {item.title}
              </h4>

              <p>
                {item.id}
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
              U: S/{" "}
              {activePrice.toFixed(
                2,
              )}
            </div>
          </div>
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
            aria-label={`Aumentar cantidad de ${item.title}`}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </article>
  );
}

export function CartSidebar({
  isOpen,
  onClose,
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
      >
        <header className="cart-sidebar-header">
          <div className="cart-sidebar-title-wrap">
            <div className="cart-sidebar-icon">
              <ShoppingBag className="w-5 h-5" />
            </div>

            <div>
              <h2>
                Tu carrito
              </h2>

              <span>
                {totalItems}{" "}
                unidad
                {totalItems ===
                1
                  ? ""
                  : "es"}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={
              onClose
            }
            className="cart-sidebar-close"
            aria-label="Cerrar carrito"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        <div className="cart-sidebar-body">
          {cart.length ===
          0 ? (
            <div className="cart-sidebar-empty">
              <ShoppingBag className="w-12 h-12" />

              <p>
                Tu carrito
                está vacío
              </p>

              <small>
                Agrega productos
                desde el catálogo.
              </small>
            </div>
          ) : (
            cart.map(
              (item) => (
                <CartRow
                  key={
                    item.id
                  }
                  item={
                    item
                  }
                  onRemove={
                    onRemove
                  }
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
                Ahorro
              </span>

              <strong>
                - S/{" "}
                {savings.toFixed(
                  2,
                )}
              </strong>
            </div>
          )}

          <div className="cart-sidebar-total-row">
            <div>
              <span>
                Total
              </span>

              <div className="cart-sidebar-total">
                <small>
                  S/
                </small>

                <strong>
                  {
                    totalPrice.toFixed(
                      2,
                    )
                  }
                </strong>
              </div>
            </div>

            <div className="cart-sidebar-units">
              <strong>
                {totalItems}
              </strong>

              <span>
                unidades
              </span>
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
              cart.length ===
              0
            }
            className={[
              "cart-sidebar-checkout",
              cart.length >
              0
                ? "cart-sidebar-checkout-active"
                : "cart-sidebar-checkout-disabled",
            ].join(" ")}
          >
            <MessageCircle className="w-5 h-5" />

            <span>
              Enviar pedido
              por WhatsApp
            </span>
          </button>
        </footer>
      </aside>
    </div>
  );
}