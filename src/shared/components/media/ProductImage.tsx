import {
  forwardRef,
  type ImgHTMLAttributes,
  type SyntheticEvent,
} from "react";

const DEFAULT_PRODUCT_PLACEHOLDER = "/placeholder.svg";

export type ProductImageProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "src"
> & {
  src?: string | null;
  fallbackSrc?: string;
};

export const ProductImage = forwardRef<HTMLImageElement, ProductImageProps>(
  (
    {
      src,
      alt = "",
      fallbackSrc = DEFAULT_PRODUCT_PLACEHOLDER,
      onError,
      ...props
    },
    ref,
  ) => {
    const resolvedSrc =
      typeof src === "string" && src.trim().length > 0
        ? src
        : fallbackSrc;

    const handleError = (
      event: SyntheticEvent<HTMLImageElement, Event>,
    ) => {
      const image = event.currentTarget;

      if (image.getAttribute("src") !== fallbackSrc) {
        image.src = fallbackSrc;
      }

      onError?.(event);
    };

    return (
      <img
        ref={ref}
        {...props}
        src={resolvedSrc}
        alt={alt}
        onError={handleError}
      />
    );
  },
);

ProductImage.displayName = "ProductImage";