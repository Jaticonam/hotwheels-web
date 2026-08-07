import { useEffect } from "react";

import {
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

import {
  getCatalogUrl,
  getCategoryUrl,
} from "@/app/routes/routes";

import { ProductGallery } from "@/features/gallery";

import { ProductHeader } from "@/modules/catalog/components/product/ProductHeader";
import { ProductMeta } from "@/modules/catalog/components/product/ProductMeta";
import { ProductBuyBox } from "@/modules/catalog/components/product/ProductBuyBox";
import { ProductNotFound } from "@/modules/catalog/components/product/ProductNotFound";

import {
  useProductActions,
  useProductCart,
  useProductDetail,
  useProductQuantity,
} from "@/modules/catalog/hooks";

import { useCart } from "@/modules/cart/hooks/useCart";
import { CartSidebar } from "@/modules/cart/components/CartSidebar";

import { getProductStatusPresentation } from "@/modules/catalog/mappers";

import { NotificationStack } from "@/shared/components/feedback/NotificationStack";
import { ProductSkeleton } from "@/shared/components/skeletons/ProductSkeleton";

export default function ProductPage() {
  const { id: paramId } =
    useParams<{ id: string }>();

  const [searchParams] =
    useSearchParams();

  const navigate =
    useNavigate();

  const currentCategory =
    searchParams.get("cat") || "";

  const productId =
    (
      searchParams.get("id") ||
      paramId ||
      ""
    ).trim();

  const {
    product,
    loading,
    notFound,
    available,
    originalPrice,
    finalPrice,
    hasOffer,
    productState,
  } = useProductDetail({
    productId,
  });

  const quantity =
    useProductQuantity({
      initialQty: 1,
      unitPrice: finalPrice,
    });

  const { resetQty } =
    quantity;

  const productActions =
    useProductActions({
      product,
      qty: quantity.effectiveQty,
    });

  const cart =
    useCart();

  const productCart =
    useProductCart({
      product,
      available,
      isQtyInputValid:
        quantity.isQtyInputValid,
      parsedQtyInput:
        quantity.parsedQtyInput,
      addToCart:
        cart.addToCart,
    });

  const {
    className: stockClass,
    Icon: StockIcon,
  } =
    getProductStatusPresentation(
      productState,
    );

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });

    resetQty();
  }, [
    productId,
    resetQty,
  ]);

  if (loading) {
    return <ProductSkeleton />;
  }

  if (
    notFound ||
    !product
  ) {
    return (
      <ProductNotFound
        onBack={() =>
          navigate(
            currentCategory
              ? getCategoryUrl(
                  currentCategory,
                )
              : getCatalogUrl(),
          )
        }
      />
    );
  }

  const handleAddToCart = () => {
    productCart.handleAddToCart();
    productCart.setCartOpen(true);
  };

  return (
    <div className="product-detail-page">
      <NotificationStack />

      <ProductHeader
        title={product.title}
        code={product.id}
        onBack={() =>
          navigate(-1)
        }
        onShare={
          productActions.handleShare
        }
      />

      <main className="product-detail-main">
        <section className="product-detail-experience">
          <section
            className="product-detail-configurator"
            aria-label="Producto"
          >
            <div className="product-detail-gallery">
              <ProductGallery
                product={product}
                available={available}
              />
            </div>

            <div className="product-detail-overview">
              <ProductMeta
                product={product}
                productState={
                  productState
                }
                stockClass={
                  stockClass
                }
                StockIcon={
                  StockIcon
                }
              />

              <ProductBuyBox
                finalPrice={
                  finalPrice
                }
                originalPrice={
                  originalPrice
                }
                hasOffer={
                  hasOffer
                }
                quantity={
                  quantity
                }
                available={
                  available
                }
                onAddToCart={
                  handleAddToCart
                }
                onWhatsApp={
                  productActions.handleWhatsApp
                }
              />
            </div>
          </section>
        </section>
      </main>

      <CartSidebar
        isOpen={
          productCart.cartOpen
        }
        onClose={() =>
          productCart.setCartOpen(false)
        }
        cart={
          cart.cart
        }
        totalItems={
          cart.totalItems
        }
        totalPrice={
          cart.totalPrice
        }
        savings={
          cart.savings
        }
        onRemove={
          cart.removeFromCart
        }
        onChangeQty={
          cart.changeQty
        }
        onSetQty={
          cart.setExactQty
        }
      />
    </div>
  );
}