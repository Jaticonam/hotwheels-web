import {
  PRODUCT_CARD_CONFIG,
} from "@/tenant/config/product";

interface ProductCardPriceProps {
  isPreventa: boolean;
  hasOffer: boolean;
  price: number;
  originalPrice: number;
}

export function ProductCardPrice({
  isPreventa,
  hasOffer,
  price,
  originalPrice,
}: ProductCardPriceProps) {
  if (isPreventa) {
    return (
      <div className="product-card-price-block product-card-price-block-preorder">
        <span className="product-card-preorder">
          {
            PRODUCT_CARD_CONFIG
              .price
              .preorder
          }
        </span>
      </div>
    );
  }

  return (
    <div
      className={[
        "product-card-price-block",
        hasOffer
          ? "product-card-price-block-offer"
          : "",
      ].join(" ")}
    >
      <div
        className="product-card-price-topline"
        aria-hidden={
          hasOffer
            ? undefined
            : true
        }
      >
        {hasOffer && (
          <span className="product-card-price-old">
            S/ {originalPrice.toFixed(2)}
          </span>
        )}
      </div>

      <div className="product-card-price">
        <span>S/</span>

        <strong>
          {price.toFixed(2)}
        </strong>
      </div>
    </div>
  );
}