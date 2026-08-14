import "./ProductCard.css";

import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { getProductUrl } from "@/app/routes/routes";
import { sortBadges } from "@/tenant/config/product";

import type { Product } from "@/shared/types/product";

import {
  getOriginalProductPrice,
  getProductPrice,
  getProductState,
  hasOfferPrice,
  isProductAvailable,
} from "@/domain/product";

import { buildProductWhatsAppUrl } from "@/integrations/whatsapp/whatsapp";
import { showNotification } from "@/shared/components/feedback/NotificationStack";

import { ProductCardImage } from "./ProductCardImage";
import { ProductCardContent } from "./ProductCardContent";
import { ProductCardPrice } from "./ProductCardPrice";
import { ProductCardActions } from "./ProductCardActions";

import {
  getProductCardStockPresentation,
} from "./ProductCard.utils";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (
    product: Product,
    qty?: number,
  ) => boolean | void;
}

export function ProductCard({
  product,
  onAddToCart,
}: ProductCardProps) {
  const navigate = useNavigate();

  const available =
    isProductAvailable(product);

  const productState =
    getProductState(product);

  const isPreventa =
    productState.type ===
    "preorder";

  const price =
    getProductPrice(product);

  const originalPrice =
    getOriginalProductPrice(
      product,
    );

  const hasOffer =
    hasOfferPrice(product);

  const visibleBadges =
    useMemo(
      () =>
        sortBadges(
          product.badges ?? [],
        ).slice(0, 2),
      [product.badges],
    );

  const stockPresentation =
    getProductCardStockPresentation(
      product,
    );

  const canAddToCart =
    available &&
    Boolean(onAddToCart);

  const addToCartLabel =
    available
      ? "Agregar al carrito"
      : isPreventa
        ? "Preventa"
        : "Agotado";

  const handleViewDetail = () => {
    navigate(
      getProductUrl(product),
    );
  };

  const handleAddToCart = () => {
    if (
      !available ||
      !onAddToCart
    ) {
      return;
    }

    const added =
      onAddToCart(
        product,
        1,
      );

    if (
      added === false
    ) {
      showNotification(
        "Stock máximo alcanzado",
        `Ya tienes el máximo disponible de ${product.title}.`,
      );

      return;
    }

    showNotification(
      "Agregado al carrito",
      `${product.title} se agregó correctamente.`,
    );
  };

  const handleWhatsApp = () => {
    const url =
      buildProductWhatsAppUrl({
        product,
        qty: 1,
      });

    window.open(
      url,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <article className="product-card">
      <ProductCardImage
        product={product}
        available={available}
        isPreventa={isPreventa}
        badges={visibleBadges}
        onImageClick={
          handleViewDetail
        }
      />

      <div className="product-card-body">
        <ProductCardContent
          product={product}
          stockPresentation={
            stockPresentation
          }
          onViewDetail={
            handleViewDetail
          }
        />

        <ProductCardPrice
          isPreventa={
            isPreventa
          }
          hasOffer={
            hasOffer
          }
          price={price}
          originalPrice={
            originalPrice
          }
        />

        <ProductCardActions
          productTitle={
            product.title
          }
          canAddToCart={
            canAddToCart
          }
          addToCartLabel={
            addToCartLabel
          }
          onAddToCart={
            handleAddToCart
          }
          onWhatsApp={
            handleWhatsApp
          }
        />
      </div>
    </article>
  );
}