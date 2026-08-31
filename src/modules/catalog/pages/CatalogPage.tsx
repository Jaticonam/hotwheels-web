import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import {
  getCategoryUrl,
} from "@/app/routes/routes";
import {
  buildCatalogNavigationSnapshot,
} from "@/application/catalog/CatalogNavigationResolver";

import {
  productSource,
} from "@/infrastructure/catalog/productSource";

import {
  searchProducts,
} from "@/shared/lib/search";

import {
  sortByCommercialPriority,
} from "@/shared/lib/sort";

import type {
  Product,
} from "@/shared/types/product";

import {
  CATALOG_ALL_NAVIGATION_ITEM,
  CATALOG_CATEGORY_NAVIGATION_ITEMS,
  getCategoryById,
} from "@/tenant/config/catalog";
import {
  BRAND_CONFIG,
} from "@/tenant/config/brand";

import {
  CatalogTopNav,
} from "@/modules/catalog/components/catalog/CatalogTopNav";

import {
  ProductCard,
} from "@/modules/catalog/components/product/ProductCard";

import {
  SearchInput,
} from "@/modules/catalog/components/search/SearchInput";

import {
  CatalogSkeleton,
} from "@/shared/components/skeletons/CatalogSkeleton";

import {
  FloatingButtons,
} from "@/shared/components/overlays/FloatingButtons";

import {
  NotificationStack,
} from "@/shared/components/feedback/NotificationStack";

import {
  useCart,
} from "@/modules/cart/hooks/useCart";

import {
  CartSidebar,
} from "@/modules/cart/components/CartSidebar";

export default function CatalogPage() {
  const navigate =
    useNavigate();

  const cart =
    useCart();

  const [
    cartOpen,
    setCartOpen,
  ] = useState(false);

  const [
    exploreOpen,
    setExploreOpen,
  ] = useState(false);

  const [
    products,
    setProducts,
  ] = useState<Product[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();

  const searchQuery =
    searchParams.get("q") ?? "";

  const setSearchQuery = (
    value: string,
  ) => {
    const nextParams =
      new URLSearchParams(
        searchParams,
      );

    if (value.trim()) {
      nextParams.set(
        "q",
        value,
      );
    }
    else {
      nextParams.delete("q");
    }

    setSearchParams(
      nextParams,
      {
        replace: true,
      },
    );
  };

  useEffect(() => {
    let mounted = true;

    productSource
      .loadAllProducts()
      .then((loadedProducts) => {
        if (!mounted) {
          return;
        }

        setProducts(
          loadedProducts,
        );
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

  const catalogNavigation =
    useMemo(() => {
      return buildCatalogNavigationSnapshot(
        products,
        [
          CATALOG_ALL_NAVIGATION_ITEM,
          ...CATALOG_CATEGORY_NAVIGATION_ITEMS,
        ],
      );
    }, [products]);

  const categoryCounts =
    catalogNavigation.counts;

  const visibleCategories =
    catalogNavigation
      .visibleItems
      .map(
        (item) => {
          const category =
            getCategoryById(
              item.filter.kind ===
                "all"
                ? "todas"
                : item.id,
            );

          if (!category) {
            return null;
          }

          return {
            ...category,
            id:
              item.id,
            name:
              item.label,
          };
        },
      )
      .filter(
        (
          category,
        ): category is NonNullable<
          typeof category
        > =>
          Boolean(
            category,
          ),
      );

  const visibleProducts =
    useMemo(() => {
      const searched =
        searchQuery.trim()
          ? searchProducts(
              products,
              searchQuery,
            )
          : products;

      return sortByCommercialPriority(
        searched,
      );
    }, [
      products,
      searchQuery,
    ]);

  if (loading) {
    return (
      <CatalogSkeleton />
    );
  }

  return (
    <div className="catalog-page">
      <NotificationStack />

      <CatalogTopNav
        exploreOpen={
          exploreOpen
        }
        onExploreOpenChange={
          setExploreOpen
        }
        categoryItems={
          visibleCategories
        }
        activeCategory={CATALOG_ALL_NAVIGATION_ITEM.id}
        categoryCounts={
          categoryCounts
        }
        onCategorySelect={(
          categoryId,
        ) => {
          if (
            categoryId === CATALOG_ALL_NAVIGATION_ITEM.id
          ) {
            setSearchQuery("");
            return;
          }

          navigate(
            getCategoryUrl(
              categoryId,
            ),
          );
        }}
        searchSlot={
          <SearchInput
            value={
              searchQuery
            }
            onChange={
              setSearchQuery
            }
            products={
              products
            }
            placeholder={
              BRAND_CONFIG
                .search
                .placeholder
            }
          />
        }
        logoSlot={null}
      />

      <main className="catalog-main">
        <section
          className="catalog-section"
          aria-labelledby="catalog-shelf-title"
        >
          <header className="catalog-shelf-heading">
            <h1 id="catalog-shelf-title">
              {searchQuery.trim()
                ? "Resultados"
                : "Todos"}
            </h1>

            <span>
              {
                visibleProducts.length
              }{" "}
              {visibleProducts.length ===
              1
                ? "modelo"
                : "modelos"}
            </span>
          </header>

          {visibleProducts.length >
          0 ? (
            <div className="catalog-grid">
              {visibleProducts.map(
                (product) => (
                  <ProductCard
                    key={
                      product.id
                    }
                    product={
                      product
                    }
                    onAddToCart={
                      cart.addToCart
                    }
                  />
                ),
              )}
            </div>
          ) : (
            <div className="catalog-empty">
              <div className="catalog-empty-symbol">
                1:64
              </div>

              <p>
                No encontramos productos.
              </p>

              <small>
                Prueba otra búsqueda.
              </small>
            </div>
          )}
        </section>
      </main>

      {!exploreOpen && (
        <FloatingButtons
          cartCount={
            cart.totalItems
          }
          onCartClick={() =>
            setCartOpen(true)
          }
        />
      )}

      <CartSidebar
        isOpen={
          cartOpen
        }
        onClose={() =>
          setCartOpen(false)
        }
        onContinueShopping={() =>
          setCartOpen(false)
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