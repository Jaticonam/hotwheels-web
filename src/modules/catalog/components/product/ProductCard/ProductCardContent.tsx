import { getCategoryName } from "@/tenant/config/catalog";

import type { Product } from "@/shared/types/product";

interface ProductCardContentProps {
  product: Product;
}

export function ProductCardContent({
  product,
}: ProductCardContentProps) {
  const caseCode =
    product.case_code
      ?.trim()
      .toUpperCase() ?? "";

  const cardNumber =
    product.card_number
      ?.trim() ?? "";

  const miniSeries =
    product.mini_series
      ?.trim() ?? "";

  const year =
    product.year !== null &&
    product.year !== undefined
      ? String(product.year).trim()
      : "";

  const seriesLine =
    [miniSeries, year]
      .filter(Boolean)
      .join(" · ");

  const hasCollectorMeta =
    Boolean(
      caseCode ||
      cardNumber,
    );

  return (
    <div className="product-card-content">
      <div className="product-card-identity-row">
        <p
          className="product-card-code product-card-copyable"
          data-product-card-no-detail="true"
        >
          ID {product.id}
        </p>

        <span className="product-card-category">
          {getCategoryName(
            product.category,
          )}
        </span>
      </div>

      <div
        className="product-card-title-button product-card-copyable"
        data-product-card-no-detail="true"
        title={product.title}
      >
        <h3 className="product-card-title">
          {product.title}
        </h3>
      </div>

      <p
        className="product-card-series product-card-copyable"
        data-product-card-no-detail="true"
      >
        {seriesLine}
      </p>

      {hasCollectorMeta && (
        <div
          className="product-card-collector-meta"
          aria-label="Datos de colección"
        >
          {caseCode && (
            <span>
              <small>Caja</small>

              <strong>
                {caseCode}
              </strong>
            </span>
          )}

          {caseCode &&
            cardNumber && (
            <i aria-hidden="true" />
          )}

          {cardNumber && (
            <span>
              <small>Tarjeta</small>

              <strong>
                {cardNumber}
              </strong>
            </span>
          )}
        </div>
      )}
    </div>
  );
}