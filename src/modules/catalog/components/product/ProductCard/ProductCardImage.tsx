import { getBadgePresentation } from "@/tenant/config/product";

import type { Product } from "@/shared/types/product";

interface ProductCardImageProps {
  product: Product;
  available: boolean;
  isPreventa: boolean;
  badges: string[];
  onImageClick?: () => void;
}

export function ProductCardImage({
  product,
  available,
  isPreventa,
  badges,
  onImageClick,
}: ProductCardImageProps) {
  return (
    <div
      className="product-card-image-wrap"
      onClick={onImageClick}
      role="button"
      tabIndex={0}
      aria-label={`Ampliar imagen de ${product.title}`}
      onKeyDown={(event) => {
        if (
          event.key === "Enter" ||
          event.key === " "
        ) {
          event.preventDefault();
          onImageClick?.();
        }
      }}
    >
      <img
        src={
          product.img ||
          "/placeholder.svg"
        }
        alt={product.title}
        loading="lazy"
        className={[
          "product-card-image",
          !available && !isPreventa
            ? "product-card-image-disabled"
            : "",
        ].join(" ")}
      />

      <div className="product-card-image-overlay">
        <span>Ver producto</span>
      </div>

      {badges.length > 0 && (
        <div className="product-card-badges">
          {badges.map((badge) => {
            const presentation =
              getBadgePresentation(
                badge,
              );

            return (
              <span
                key={badge}
                className={[
                  "product-card-badge",
                  presentation.className,
                ].join(" ")}
              >
                <span>
                  {presentation.icon}
                </span>

                {presentation.label}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}