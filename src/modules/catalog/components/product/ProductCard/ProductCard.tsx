import "./ProductCard.css";

import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { getProductUrl } from "@/app/routes/routes";
import { sortBadges } from "@/tenant/config/product";

import type { Product } from "@/shared/types/product";

import {
  getProductPrice,
  getOriginalProductPrice,
  hasOfferPrice,
  isProductAvailable,
  getProductState,
} from "@/domain/product";

import { buildProductWhatsAppUrl } from "@/integrations/whatsapp/whatsapp";

import { ProductCardImage } from "./ProductCardImage";
import { ProductCardContent } from "./ProductCardContent";
import { ProductCardPrice } from "./ProductCardPrice";
import { ProductCardActions } from "./ProductCardActions";

import {
  CAMPAIGN_BADGE_KEYS,
  STATE_BADGE_KEYS,
  pickBadgeByKeys,
} from "./ProductCard.utils";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({
  product,
}: ProductCardProps) {
  const navigate =
    useNavigate();

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

  const sortedBadges =
    useMemo(
      () =>
        sortBadges(
          product.badges ?? [],
        ),
      [product.badges],
    );

  const campaignBadge =
    pickBadgeByKeys(
      sortedBadges,
      CAMPAIGN_BADGE_KEYS,
    );

  const stateBadge =
    pickBadgeByKeys(
      sortedBadges,
      STATE_BADGE_KEYS,
    );

  const handleViewDetail = () => {
    navigate(
      getProductUrl(product),
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
        campaignBadge={
          campaignBadge
        }
        stateBadge={
          stateBadge
        }
        onImageClick={
          handleViewDetail
        }
      />

      <div className="product-card-body">
        <ProductCardContent
          product={product}
        />

        <ProductCardPrice
          isPreventa={
            isPreventa
          }
          hasOffer={
            hasOffer
          }
          price={
            price
          }
          originalPrice={
            originalPrice
          }
        />

        <ProductCardActions
          productTitle={
            product.title
          }
          onViewDetail={
            handleViewDetail
          }
          onWhatsApp={
            handleWhatsApp
          }
        />
      </div>
    </article>
  );
}