import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { productSource } from "@/infrastructure/catalog/productSource";
import { productBelongsToCategory } from "@/domain/product/categories";
import { searchProducts } from "@/shared/lib/search";
import { sortByCommercialPriority } from "@/shared/lib/sort";

import type { Product } from "@/shared/types/product";

import { BRAND_CONFIG } from "@/tenant/config/brand";
import { BrandLockup } from "@/shared/components/brand/BrandLockup";

import { ProductCard } from "@/modules/catalog/components/product/ProductCard";
import { CatalogTopNav } from "@/modules/catalog/components/catalog/CatalogTopNav";
import { SearchInput } from "@/modules/catalog/components/search/SearchInput";

import { CatalogSkeleton } from "@/shared/components/skeletons/CatalogSkeleton";
import { FloatingButtons } from "@/shared/components/overlays/FloatingButtons";
import { NotificationStack } from "@/shared/components/feedback/NotificationStack";
import { useCart } from "@/modules/cart/hooks/useCart";
import { CartSidebar } from "@/modules/cart/components/CartSidebar";

export default function CatalogPage() {
  const cart = useCart();

  const [
    cartOpen,
    setCartOpen,
  ] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("todas");

  useEffect(() => {
    let mounted = true;

    productSource.loadAllProducts()
      .then((loadedProducts) => {
        if (!mounted) {
          return;
        }

        setProducts(loadedProducts);
      })
      .catch((error) => {
        console.error(
          "Error cargando productos:",
          error,
        );

        if (mounted) {
          setProducts([]);
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const categoryCounts = useMemo(() => {
    return products.reduce<Record<string, number>>(
      (counts, product) => {
        counts.todas = (counts.todas ?? 0) + 1;

        const categoryIds = Array.from(
          new Set(
            [
              product.category,
              ...product.categories,
            ].filter(Boolean),
          ),
        );

        categoryIds.forEach((categoryId) => {
          counts[categoryId] =
            (counts[categoryId] ?? 0) + 1;
        });

        return counts;
      },
      {},
    );
  }, [products]);

  const visibleProducts = useMemo(() => {
    const categoryProducts =
      activeCategory === "todas"
        ? products
        : products.filter((product) =>
            productBelongsToCategory(
              product,
              activeCategory,
            ),
          );

    const searchedProducts =
      searchQuery.trim()
        ? searchProducts(
            categoryProducts,
            searchQuery,
          )
        : categoryProducts;

    return sortByCommercialPriority(
      searchedProducts,
    );
  }, [
    products,
    activeCategory,
    searchQuery,
  ]);

  const visibleCategories =
    BRAND_CONFIG.categories.filter(
      (category) =>
        category.id === "todas" ||
        (categoryCounts[category.id] ?? 0) > 0,
    );

  if (loading) {
    return <CatalogSkeleton />;
  }

  return (
    <div className="catalog-page">
      <NotificationStack />

      <CatalogTopNav
        categoryItems={visibleCategories}
        activeCategory={activeCategory}
        categoryCounts={categoryCounts}
        onCategorySelect={(categoryId) => {
          setActiveCategory(categoryId);
          setSearchQuery("");
        }}
        logoSlot={
          <button
            type="button"
            className="catalog-top-nav-brand"
            onClick={() => {
              window.location.href = "/";
            }}
            aria-label="Ir al inicio"
          >
            <BrandLockup align="center" size="compact" />
          </button>
        }
        searchSlot={
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            products={products}
            placeholder={
              BRAND_CONFIG.search.placeholder
            }
          />
        }
      />

      <main className="catalog-main">
        <section className="catalog-hero">
          <p className="catalog-kicker">
            {BRAND_CONFIG.catalog.kicker}
          </p>

          <h1>
            {BRAND_CONFIG.catalog.title}
          </h1>

          <p className="catalog-hero-description">
            {BRAND_CONFIG.catalog.description}
          </p>

          <div
            className="catalog-hero-meta"
            aria-label="Datos del catálogo"
          >
            <span className="catalog-hero-stat">
              <strong>
                {products.length}
              </strong>

              <small>
                {products.length === 1
                  ? "modelo disponible"
                  : "modelos disponibles"}
              </small>
            </span>

            <span className="catalog-hero-stat catalog-hero-stat-collector">
              <strong>
                x1
              </strong>

              <small>
                Compra por unidad
              </small>
            </span>
          </div>
        </section>

        {visibleProducts.length > 0 ? (
          <section className="catalog-section">
            <div className="catalog-results-header">
              <div>
                <span>
                  Selección actual
                </span>

                <strong>
                  {visibleProducts.length}{" "}
                  {visibleProducts.length === 1
                    ? "producto"
                    : "productos"}
                </strong>
              </div>
            </div>

            <div className="catalog-grid">
              {visibleProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={
                    cart.addToCart
                  }
                />
              ))}
            </div>
          </section>
        ) : (
          <div className="catalog-empty">
            <div className="catalog-empty-symbol">
              1:64
            </div>

            <p>
              No encontramos productos.
            </p>

            <small>
              Prueba otra búsqueda o categoría.
            </small>
          </div>
        )}
      </main>

      <FloatingButtons
        cartCount={
          cart.totalItems
        }
        onCartClick={() =>
          setCartOpen(true)
        }
      />

      <CartSidebar
        isOpen={cartOpen}
        onClose={() =>
          setCartOpen(false)
        }
        onContinueShopping={() =>
          setCartOpen(false)
        }
        cart={cart.cart}
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