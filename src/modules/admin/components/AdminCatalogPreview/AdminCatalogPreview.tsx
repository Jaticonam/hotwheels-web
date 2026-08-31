import { ProductImage } from "../../../../shared/components/media/ProductImage";
import "./AdminCatalogPreview.css";

import {
  AlertTriangle,
  X,
} from "lucide-react";

import {
  useEffect,
  useMemo,
} from "react";

import {
  type CatalogComposition,
} from "@/application/catalog/CatalogComposition";

import {
  resolveCatalogPreview,
} from "@/application/catalog/CatalogPreview";

import type {
  Product,
} from "@/shared/types/product";

import {
  getCategoryName,
} from "@/tenant/config/catalog";

interface AdminCatalogPreviewProps {
  composition:
    CatalogComposition;

  products:
    readonly Product[];

  onClose:
    () => void;
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

function formatDate():
string {
  return new Intl.DateTimeFormat(
    "es-PE",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    },
  ).format(
    new Date(),
  );
}

function statusClass(
  status: string,
): string {
  return status
    .trim()
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      "",
    )
    .toLowerCase();
}

export function AdminCatalogPreview({
  composition,
  products,
  onClose,
}: AdminCatalogPreviewProps) {
  const preview =
    useMemo(
      () =>
        resolveCatalogPreview(
          composition,
          products,
        ),
      [
        composition,
        products,
      ],
    );

  useEffect(
    () => {
      const handleKeyDown =
        (
          event:
          KeyboardEvent,
        ) => {
          if (
            event.key ===
            "Escape"
          ) {
            onClose();
          }
        };

      window.addEventListener(
        "keydown",
        handleKeyDown,
      );

      return () => {
        window.removeEventListener(
          "keydown",
          handleKeyDown,
        );
      };
    },
    [onClose],
  );

  return (
    <div
      className="hwa-preview-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Vista previa del catálogo"
    >
      <div className="hwa-preview-shell">
        <header className="hwa-preview-toolbar">
          <div>
            <span>
              Vista previa
            </span>

            <strong>
              {
                composition.title
              }
            </strong>

            <small>
              {
                preview.products.length
              } productos · {
                preview.pages.length
              } {
                preview.pages.length === 1
                  ? "página"
                  : "páginas"
              }
            </small>
          </div>

          <div className="hwa-preview-toolbar-right">
            <span>
              Preview · sin generar archivo
            </span>

            <button
              type="button"
              onClick={
                onClose
              }
              aria-label="Cerrar vista previa"
            >
              <X
                size={19}
                aria-hidden="true"
              />
            </button>
          </div>
        </header>

        {
          preview.missingProductIds.length >
            0 &&
          (
            <div className="hwa-preview-warning">
              <AlertTriangle
                size={16}
                aria-hidden="true"
              />

              <span>
                {
                  preview
                    .missingProductIds
                    .length
                } productos de la composición ya no existen en la fuente actual.
              </span>
            </div>
          )
        }

        <div className="hwa-preview-scroll">
          {
            preview.pages.map(
              (
                pageProducts,
                pageIndex,
              ) => (
                <article
                  key={
                    `page-${pageIndex + 1}`
                  }
                  className="hwa-preview-page"
                >
                  <header className="hwa-document-header">
                    <div>
                      <p>
                        COLECCIONABLES 1:64
                      </p>

                      <h2>
                        {
                          composition.title
                        }
                      </h2>

                      <span>
                        Catálogo comercial
                      </span>
                    </div>

                    <div className="hwa-document-meta">
                      <span>
                        {
                          composition.mode ===
                          "category"
                            ? "Por categorías"
                            : "Personalizado"
                        }
                      </span>

                      <strong>
                        {
                          formatDate()
                        }
                      </strong>
                    </div>
                  </header>

                  <div className="hwa-document-rule" />

                  <div className="hwa-document-products">
                    {
                      pageProducts.map(
                        (
                          product,
                        ) => {
                          const hasOffer =
                            typeof product.offer_price ===
                              "number" &&
                            Number.isFinite(
                              product.offer_price,
                            ) &&
                            product.offer_price >
                              0;

                          const currentPrice =
                            hasOffer
                              ? product.offer_price!
                              : product.price;

                          const meta = [
                            product.mini_series,
                            product.card_number,
                            product.year,
                          ]
                            .filter(Boolean)
                            .join(" · ");

                          return (
                            <section
                              key={
                                product.id
                              }
                              className="hwa-document-product"
                            >
                              <div className="hwa-document-product-media">
                                {
                                  (
                                        <ProductImage
                                          src={
                                            product.img
                                          }
                                          alt={
                                            product.title
                                          }
                                        />
                                      )
                                }

                                <span
                                  className={[
                                    "hwa-document-status",
                                    `hwa-document-status-${statusClass(
                                      product.status,
                                    )}`,
                                  ].join(" ")}
                                >
                                  {
                                    product.status
                                  }
                                </span>
                              </div>

                              <div className="hwa-document-product-body">
                                <span className="hwa-document-product-id">
                                  {
                                    product.id
                                  }
                                </span>

                                <h3>
                                  {
                                    product.title
                                  }
                                </h3>

                                {
                                  meta &&
                                  (
                                    <p>
                                      {
                                        meta
                                      }
                                    </p>
                                  )
                                }

                                <span className="hwa-document-category">
                                  {
                                    getCategoryName(
                                      product.category,
                                    )
                                  }
                                </span>

                                <div className="hwa-document-price">
                                  <strong>
                                    {
                                      formatPrice(
                                        currentPrice,
                                      )
                                    }
                                  </strong>

                                  {
                                    hasOffer &&
                                    (
                                      <del>
                                        {
                                          formatPrice(
                                            product.price,
                                          )
                                        }
                                      </del>
                                    )
                                  }
                                </div>
                              </div>
                            </section>
                          );
                        },
                      )
                    }
                  </div>

                  <footer className="hwa-document-footer">
                    <span>
                      {
                        preview.products.length
                      } productos
                    </span>

                    <strong>
                      Página {
                        pageIndex + 1
                      } de {
                        preview.pages.length
                      }
                    </strong>
                  </footer>
                </article>
              ),
            )
          }
        </div>
      </div>
    </div>
  );
}
