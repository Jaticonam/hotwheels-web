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
  ArrowLeft,
  SearchX,
} from "lucide-react";

import { BRAND_CONFIG } from "@/tenant/config/brand";

import { loadAllProducts } from "@/integrations/sheets/fetchSheets";
import { productBelongsToCategory } from "@/domain/product/categories";
import { searchProducts } from "@/shared/lib/search";
import { sortByCommercialPriority } from "@/shared/lib/sort";

import type { Product } from "@/shared/types/product";

import { CategoryFilter } from "@/modules/catalog/components/filters/CategoryFilter";
import { ProductCard } from "@/modules/catalog/components/product/ProductCard";
import { SearchInput } from "@/modules/catalog/components/search/SearchInput";

import { FloatingButtons } from "@/shared/components/overlays/FloatingButtons";
import { CategorySkeleton } from "@/shared/components/skeletons/CategorySkeleton";

export default function CategoryPage() {
  const {
    id: paramCategoryId,
  } =
    useParams<{
      id: string;
    }>();

  const [searchParams] =
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

    loadAllProducts()
      .then((data) => {
        if (!mounted) return;

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
      "todas"
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
    BRAND_CONFIG.categories.find(
      (category) =>
        category.id ===
        activeCategory,
    );

  const visibleCategories =
    useMemo(() => {
      return BRAND_CONFIG
        .categories
        .filter(
          (category) => {
            if (
              category.id ===
              "todas"
            ) {
              return true;
            }

            return products.some(
              (product) =>
                productBelongsToCategory(
                  product,
                  category.id,
                ),
            );
          },
        );
    }, [products]);

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
          "todas"
        ) {
          navigate(
            "/catalogo",
          );

          return;
        }

        navigate(
          `/catalogo/categoria.html?cat=${encodeURIComponent(id)}`,
        );
      },
      [navigate],
    );

  const hasSearch =
    categorySearch
      .trim()
      .length > 0;

  return (
    <div className="category-page">
      <header className="category-page-header">
        <div className="category-page-header-inner">
          <div className="category-page-header-row">
            <div className="category-page-title-wrap">
              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/catalogo",
                  )
                }
                className="category-page-back"
                aria-label="Volver al catálogo"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div>
                <h1>
                  {categoryInfo
                    ? `${
                        categoryInfo
                          .icon
                      } ${
                        categoryInfo
                          .name
                      }`
                    : "Categoría"}
                </h1>

                <p>
                  {
                    categoryInfo
                      ?.description
                  }
                </p>

                <span>
                  {
                    filteredProducts.length
                  }{" "}
                  producto
                  {filteredProducts.length ===
                  1
                    ? ""
                    : "s"}
                </span>
              </div>
            </div>

            <div className="category-page-search">
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

              {hasSearch && (
                <button
                  type="button"
                  onClick={() =>
                    setCategorySearch(
                      "",
                    )
                  }
                  aria-label="Limpiar búsqueda"
                >
                  <SearchX className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="category-page-main">
        <CategoryFilter
          categories={
            visibleCategories
          }
          active={
            activeCategory
          }
          onSelect={
            handleCategorySelect
          }
        />

        {loading ? (
          <CategorySkeleton />
        ) : filteredProducts.length ===
          0 ? (
          <div className="category-page-empty">
            <SearchX className="w-10 h-10" />

            <p>
              No hay productos
              para mostrar.
            </p>

            <small>
              Prueba otra categoría
              o búsqueda.
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
                />
              ),
            )}
          </div>
        )}
      </main>

      <FloatingButtons />
    </div>
  );
}