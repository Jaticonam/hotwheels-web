import "./ProductCard.css";

import {
  useMemo,
  useState,
  type MouseEvent,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  getProductUrl,
} from "@/app/routes/routes";

import {
  sortBadges,
} from "@/tenant/config/product";

import type {
  Product,
} from "@/shared/types/product";

import {
  getOriginalProductPrice,
  getProductPrice,
  getProductState,
  hasOfferPrice,
  isProductAvailable,
} from "@/domain/product";

import {
  buildProductWhatsAppUrl,
} from "@/integrations/whatsapp/whatsapp";

import {
  showNotification,
} from "@/shared/components/feedback/NotificationStack";

import {
  ImageZoomModal,
} from "@/modules/catalog/components/overlays/ImageZoomModal";

import {
  ProductCardImage,
} from "./ProductCardImage";

import {
  ProductCardContent,
} from "./ProductCardContent";

import {
  ProductCardPrice,
} from "./ProductCardPrice";

import {
  ProductCardActions,
} from "./ProductCardActions";

import {
  getProductCardPrimaryAction,
  getProductCardStockPresentation,
} from "./ProductCard.utils";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (
    product: Product,
    qty?: number,
  ) => boolean | void;
}

const CARD_DETAIL_BLOCK_SELECTOR =
  [
    "button",
    "a",
    "input",
    "select",
    "textarea",
    '[role="button"]',
    '[data-product-card-no-detail="true"]',
  ].join(",");

export function ProductCard({
  product,
  onAddToCart,
}: ProductCardProps) {
  const navigate =
    useNavigate();

  const [
    zoomImage,
    setZoomImage,
  ] =
    useState<string | null>(
      null,
    );

  const available =
    isProductAvailable(
      product,
    );

  const productState =
    getProductState(
      product,
    );

  const isPreventa =
    productState.type ===
    "preorder";

  const price =
    getProductPrice(
      product,
    );

  const originalPrice =
    getOriginalProductPrice(
      product,
    );

  const hasOffer =
    hasOfferPrice(
      product,
    );

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

  const primaryAction =
    getProductCardPrimaryAction(
      product,
      canAddToCart,
    );

  const handleViewDetail = () => {
    navigate(
      getProductUrl(
        product,
      ),
    );
  };

  const handleImageZoom = () => {
    const image =
      product.img
        ?.trim();

    if (!image) {
      return;
    }

    setZoomImage(
      image,
    );
  };

  const handleCardClick = (
    event: MouseEvent<HTMLElement>,
  ) => {
    const target =
      event.target instanceof Element
        ? event.target
        : null;

    if (!target) {
      return;
    }

    if (
      target.closest(
        CARD_DETAIL_BLOCK_SELECTOR,
      )
    ) {
      return;
    }

    const selection =
      window.getSelection();

    if (
      selection &&
      !selection.isCollapsed &&
      selection
        .toString()
        .trim()
        .length > 0
    ) {
      const anchorInside =
        selection.anchorNode
          ? event.currentTarget.contains(
              selection.anchorNode,
            )
          : false;

      const focusInside =
        selection.focusNode
          ? event.currentTarget.contains(
              selection.focusNode,
            )
          : false;

      if (
        anchorInside ||
        focusInside
      ) {
        return;
      }
    }

    handleViewDetail();
  };

  const handleAddToCart =
    (): boolean => {
      if (
        !available ||
        !onAddToCart
      ) {
        return false;
      }

      const added =
        onAddToCart(
          product,
          1,
        );

      if (added === false) {
        showNotification(
          "Stock máximo alcanzado",
          `Ya tienes el máximo disponible de ${product.title}.`,
        );

        return false;
      }

      showNotification(
        "Agregado a Mi Box",
        `1 unidad de ${product.title} se agregó a Mi Box.`,
        "cart",
      );

      return true;
    };

  const handleWhatsApp =
    (): boolean => {
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

      return true;
    };

  const handlePrimaryAction =
    (): boolean => {
      if (
        primaryAction.type ===
        "cart"
      ) {
        return handleAddToCart();
      }

      if (
        primaryAction.type ===
        "whatsapp"
      ) {
        return handleWhatsApp();
      }

      return false;
    };

  return (
    <>
      <article
        className="product-card"
        onClick={handleCardClick}
      >
        <ProductCardImage
          product={product}
          available={available}
          isPreventa={isPreventa}
          badges={visibleBadges}
          onImageClick={
            handleImageZoom
          }
        />

        <div className="product-card-body">
          <ProductCardContent
            product={product}
          />

          <div className="product-card-commerce-block">
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

              {
                stockPresentation.label
              }
            </div>
          </div>

          <ProductCardActions
            productTitle={
              product.title
            }
            actionType={
              primaryAction.type
            }
            actionLabel={
              primaryAction.label
            }
            onAction={
              handlePrimaryAction
            }
          />
        </div>
      </article>

      <ImageZoomModal
        src={zoomImage}
        title={product.title}
        onClose={() =>
          setZoomImage(null)
        }
      />
    </>
  );
}
