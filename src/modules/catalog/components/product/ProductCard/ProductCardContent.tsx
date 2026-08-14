import { getCategoryName } from "@/tenant/config/catalog";

import type { Product } from "@/shared/types/product";

import type {
  ProductCardStockPresentation,
} from "./ProductCard.utils";

interface ProductCardContentProps {
  product: Product;
  stockPresentation: ProductCardStockPresentation;
  onViewDetail: () => void;
}

export function ProductCardContent({
  product,
  stockPresentation,
  onViewDetail,
}: ProductCardContentProps) {
  return (
    <div className="product-card-content">
      <p className="product-card-code">
        ID {product.id}
      </p>

      <button
        type="button"
        className="product-card-title-button"
        onClick={onViewDetail}
        aria-label={`Ver ${product.title}`}
      >
        <h3 className="product-card-title">
          {product.title}
        </h3>
      </button>

      <div className="product-card-category">
        {getCategoryName(
          product.category,
        )}
      </div>

      <div
        className={[
          "product-card-stock",
          stockPresentation.className,
        ].join(" ")}
      >
        <span
          className="product-card-stock-dot"
          aria-hidden="true"
        />

        {stockPresentation.label}
      </div>
    </div>
  );
}