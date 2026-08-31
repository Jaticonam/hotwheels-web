import { ProductImage } from "../../../../shared/components/media/ProductImage";
import "./AdminProductCard.css";

import {
  Check,
  PackageOpen,
} from "lucide-react";

import {
  getCategoryName,
} from "@/tenant/config/catalog";

import type {
  Product,
} from "@/shared/types/product";

interface AdminProductCardProps {
  product: Product;

  selected?: boolean;

  onToggleSelection?: (
    product: Product,
  ) => void;
}

function normalizeStatus(
  status: string,
): string {
  return status
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function formatPrice(
  value: number,
): string {
  return new Intl.NumberFormat(
    "es-PE",
    {
      style: "currency",
      currency: "PEN",
      minimumFractionDigits: 2,
    },
  ).format(value);
}

export function AdminProductCard({
  product,
  selected = false,
  onToggleSelection,
}: AdminProductCardProps) {
  const hasOffer =
    typeof product.offer_price ===
      "number" &&
    Number.isFinite(
      product.offer_price,
    ) &&
    product.offer_price > 0;

  const effectivePrice =
    hasOffer
      ? product.offer_price!
      : product.price;

  const stockLabel =
    product.stock === null
      ? "Stock no definido"
      : product.stock <= 0
        ? "Sin stock"
        : `${product.stock} unid.`;

  const normalizedStatus =
    normalizeStatus(
      product.status,
    );

  const collectibleMeta = [
    product.mini_series,
    product.card_number,
    product.year,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <article
      className={[
        "hwa-product-card",
        selected
          ? "hwa-product-card-selected"
          : "",
      ].join(" ")}
    >
      <div className="hwa-product-card-media">
        {
          (
                <ProductImage
                  src={product.img}
                  alt={product.title}
                  loading="lazy"
                />
              )
        }

        {
          onToggleSelection &&
          (
            <button
              type="button"
              className={[
                "hwa-select-button",
                selected
                  ? "hwa-select-button-active"
                  : "",
              ].join(" ")}
              aria-pressed={
                selected
              }
              aria-label={
                selected
                  ? `Quitar ${product.title} de la selección`
                  : `Seleccionar ${product.title}`
              }
              onClick={() =>
                onToggleSelection(
                  product,
                )
              }
            >
              {
                selected
                  ? (
                      <Check
                        size={15}
                        strokeWidth={3}
                        aria-hidden="true"
                      />
                    )
                  : (
                      <span
                        aria-hidden="true"
                      />
                    )
              }
            </button>
          )
        }

        <span
          className={[
            "hwa-status",
            `hwa-status-${normalizedStatus}`,
          ].join(" ")}
        >
          {product.status}
        </span>
      </div>

      <div className="hwa-product-card-body">
        <div className="hwa-product-card-id">
          {product.id}
        </div>

        <h3>
          {product.title}
        </h3>

        {
          collectibleMeta &&
          (
            <p className="hwa-product-card-meta">
              {collectibleMeta}
            </p>
          )
        }

        <p className="hwa-product-card-category">
          {
            getCategoryName(
              product.category,
            )
          }
        </p>

        <div className="hwa-product-card-commerce">
          <div>
            <span className="hwa-product-card-price">
              {
                formatPrice(
                  effectivePrice,
                )
              }
            </span>

            {
              hasOffer &&
              (
                <span className="hwa-product-card-original-price">
                  {
                    formatPrice(
                      product.price,
                    )
                  }
                </span>
              )
            }
          </div>

          <span
            className={[
              "hwa-product-card-stock",
              product.stock !== null &&
              product.stock > 0
                ? "hwa-product-card-stock-ok"
                : "hwa-product-card-stock-zero",
            ].join(" ")}
          >
            {stockLabel}
          </span>
        </div>
      </div>
    </article>
  );
}
