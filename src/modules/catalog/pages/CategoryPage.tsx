import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

import {
  SearchX,
} from "lucide-react";

import {
  CATALOG_ALL_NAVIGATION_ITEM,
  CATALOG_CATEGORY_NAVIGATION_ITEMS,
  getCategoryById,
} from "@/tenant/config/catalog";

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
  productBelongsToCategory,
} from "@/domain/product/categories";

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
  CatalogTopNav,
} from "@/modules/catalog/components/catalog/CatalogTopNav";

import {
  ProductCard,
} from "@/modules/catalog/components/product/ProductCard";

import {
  SearchInput,
} from "@/modules/catalog/components/search/SearchInput";

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

import {
  CategorySkeleton,
} from "@/shared/components/skeletons/CategorySkeleton";

export default function CategoryPage() {
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

  const {
    id: paramCategoryId,
  } =
    useParams<{
      id: string;
    }>();

  const [
    searchParams,
  ] =
    useSearchParams();

  const navigate =
    useNavigate();

  const categoryId =
    searchParams.get("cat") ||
    paramCategoryId;

  const [
    products,
    setProducts,
  ] = useState<Product[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    categorySearch,
    setCategorySearch,
  ] = useState("");

  useEffect(() => {
    let mounted = true;

    productSource
      .loadAllProducts()
      .then((data) => {
        if (!mounted) {
          return;
        }

        setProducts(data);
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

  useEffect(() => {
    if (
      categoryId ===
        "todas" ||
      categoryId ===
        CATALOG_ALL_NAVIGATION_ITEM.id
    ) {
      navigate(
        "/catalogo",
        {
          replace: true,
        },
      );
    }
  }, [
    categoryId,
    navigate,
  ]);

  useEffect(() => {
    setCategorySearch("");
  }, [categoryId]);

  const activeCategory =
    categoryId ||
    "todas";

  const categoryInfo =
    getCategoryById(
      activeCategory,
    );

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

  const categoryProducts =
    useMemo(() => {
      return products.filter(
        (product) =>
          productBelongsToCategory(
            product,
            activeCategory,
          ),
      );
    }, [
      products,
      activeCategory,
    ]);

  const filteredProducts =
    useMemo(() => {
      const term =
        categorySearch.trim();

      if (!term) {
        return sortByCommercialPriority(
          categoryProducts,
        );
      }

      return sortByCommercialPriority(
        searchProducts(
          categoryProducts,
          term,
        ),
      );
    }, [
      categoryProducts,
      categorySearch,
    ]);

  const handleCategorySelect =
    useCallback(
      (id: string) => {
        if (
          id ===
            "todas" ||
          id ===
            CATALOG_ALL_NAVIGATION_ITEM.id
        ) {
          navigate(
            "/catalogo",
          );

          return;
        }

        navigate(
          getCategoryUrl(id),
        );
      },
      [navigate],
    );

  return (
    <div className="category-page">
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
        activeCategory={
          activeCategory ===
            "todas"
            ? CATALOG_ALL_NAVIGATION_ITEM.id
            : activeCategory
        }
        categoryCounts={
          categoryCounts
        }
        onCategorySelect={
          handleCategorySelect
        }
        searchSlot={
          <SearchInput
            value={
              categorySearch
            }
            onChange={
              setCategorySearch
            }
            products={
              categoryProducts
            }
            placeholder="Buscar en esta categoría..."
          />
        }
        logoSlot={null}
      />

      <main className="category-page-main">
        <section
          className="category-page-section"
          aria-labelledby="category-shelf-title"
        >
          <header className="category-page-shelf-heading">
            <h1 id="category-shelf-title">
              {categoryInfo?.icon && (
                <span
                  aria-hidden="true"
                >
                  {
                    categoryInfo.icon
                  }
                </span>
              )}

              {categoryInfo?.name ??
                "Categoría"}
            </h1>

            <span>
              {loading
                ? "Cargando..."
                : `${
                    filteredProducts.length
                  } ${
                    filteredProducts.length ===
                    1
                      ? "modelo"
                      : "modelos"
                  }`}
            </span>
          </header>

          {loading ? (
            <CategorySkeleton />
          ) : filteredProducts.length ===
            0 ? (
            <div className="category-page-empty">
              <SearchX className="w-10 h-10" />

              <p>
                No hay productos para mostrar.
              </p>

              <small>
                Prueba otra búsqueda o categoría.
              </small>
            </div>
          ) : (
            <div className="category-page-grid">
              {filteredProducts.map(
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