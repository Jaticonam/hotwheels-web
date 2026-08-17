import {
  getCategoryName,
} from "@/tenant/config/catalog";

import {
  getBadgePresentation,
  PRODUCT_DETAIL_CONFIG,
  sortBadges,
} from "@/tenant/config/product";

import type {
  Product,
} from "@/shared/types/product";

import "./ProductMeta.css";

interface ProductMetaProps {
  product: Product;

  productState: {
    label: string;
  };

  stockClass: string;
  StockIcon: React.ElementType;
}

export function ProductMeta({
  product,
  productState,
  stockClass,
  StockIcon,
}: ProductMetaProps) {
  const visibleBadges =
    sortBadges(
      product.badges ?? [],
    ).slice(0, 3);

  const collectorFacts = [
    {
      label: "Caja",
      value:
        product.case_code
          ?.trim()
          .toUpperCase() ?? "",
    },
    {
      label: "Tarjeta",
      value:
        product.card_number
          ?.trim() ?? "",
    },
    {
      label: "Serie",
      value:
        product.mini_series
          ?.trim() ?? "",
    },
    {
      label: "Año",
      value:
        product.year
          ? String(
              product.year,
            )
          : "",
    },
  ].filter(
    (fact) =>
      Boolean(
        fact.value,
      ),
  );

  return (
    <>
      <div className="product-detail-heading">
        <div className="product-detail-topline">
          <span className="product-detail-code">
            ID {product.id}
          </span>

          <span className="product-detail-kicker">
            {getCategoryName(
              product.category,
            )}
          </span>
        </div>

        <h2 className="product-detail-title">
          {product.title}
        </h2>

        {visibleBadges.length >
          0 && (
          <div
            className="product-profile-badges"
            aria-label="Etiquetas del producto"
          >
            {visibleBadges.map(
              (badge) => {
                const presentation =
                  getBadgePresentation(
                    badge,
                  );

                return (
                  <span
                    key={badge}
                    className={[
                      "product-profile-badge",
                      presentation.className,
                    ].join(" ")}
                  >
                    <span
                      aria-hidden="true"
                      className="product-profile-badge-icon"
                    >
                      {
                        presentation.icon
                      }
                    </span>

                    {
                      presentation.label
                    }
                  </span>
                );
              },
            )}
          </div>
        )}

        <p className="product-detail-description">
          {product.description ||
            PRODUCT_DETAIL_CONFIG
              .description
              .fallback}
        </p>
      </div>

      {collectorFacts.length >
        0 && (
        <section
          className="product-profile-collector"
          aria-label="Ficha de colección"
        >
          <div className="product-profile-collector-heading">
            <span className="product-profile-collector-eyebrow">
              Ficha de colección
            </span>

            <span className="product-profile-collector-line" />
          </div>

          <dl className="product-profile-facts">
            {collectorFacts.map(
              (fact) => (
                <div
                  key={
                    fact.label
                  }
                  className="product-profile-fact"
                >
                  <dt>
                    {
                      fact.label
                    }
                  </dt>

                  <dd>
                    {
                      fact.value
                    }
                  </dd>
                </div>
              ),
            )}
          </dl>
        </section>
      )}

      <div className="product-detail-meta-row">
        <div
          className={[
            "product-detail-status",
            stockClass,
          ].join(" ")}
        >
          <StockIcon className="w-4 h-4" />

          <span>
            {productState.label}
          </span>
        </div>

        {product.stock !==
          null &&
          product.stock !==
            undefined && (
          <div className="product-detail-stock-count">
            Stock:{" "}
            <strong>
              {product.stock}
            </strong>
          </div>
        )}
      </div>
    </>
  );
}