import "./CategoriesSection.css";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  ArrowRight,
} from "lucide-react";

import {
  getCategoryUrl,
} from "@/app/routes/routes";

import {
  buildCatalogNavigationSnapshot,
} from "@/application/catalog/CatalogNavigationResolver";

import {
  productSource,
} from "@/infrastructure/catalog/productSource";

import type {
  Product,
} from "@/shared/types/product";

import {
  CATALOG_CATEGORY_NAVIGATION_ITEMS,
  getCategoryById,
} from "@/tenant/config/catalog";

export default function CategoriesSection() {
  const [
    products,
    setProducts,
  ] = useState<Product[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  useEffect(() => {
    let active = true;

    const loadProducts =
      async () => {
        try {
          const loadedProducts =
            await productSource
              .loadAllProducts();

          if (!active) {
            return;
          }

          setProducts(
            loadedProducts,
          );
        } catch (error) {
          console.error(
            "No se pudieron cargar las categorías del Home.",
            error,
          );

          if (active) {
            setProducts([]);
          }
        } finally {
          if (active) {
            setLoading(false);
          }
        }
      };

    void loadProducts();

    return () => {
      active = false;
    };
  }, []);

  const homeCategories =
    useMemo(() => {
      if (loading) {
        return [];
      }

      const navigation =
        buildCatalogNavigationSnapshot(
          products,
          CATALOG_CATEGORY_NAVIGATION_ITEMS,
        );

      return navigation
        .visibleItems
        .map(
          (item) => {
            const category =
              getCategoryById(
                item.id,
              );

            if (!category) {
              return null;
            }

            return {
              ...category,
              id: item.id,
              name: item.label,
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
        )
        .slice(
          0,
          4,
        );
    }, [
      loading,
      products,
    ]);
  return (
    <section
      id="categorias"
      className="home-collectibles-categories home-brand-categories"
    >
      <div className="home-collectibles-categories-inner">
        <div className="home-collectibles-categories-heading">
          <span className="home-collectibles-categories-eyebrow">
            Explora por categoría
          </span>

          <h2>
            Encuentra tu próxima pieza.
          </h2>

          <p>
            Explora nuestras categorías principales y descubre modelos para coleccionar, disfrutar o regalar.
          </p>
        </div>

        {!loading &&
          homeCategories.length > 0 && (
            <div className="home-collectibles-categories-grid">
              {homeCategories.map(
                (category) => (
                  <Link
                    key={category.id}
                    to={getCategoryUrl(
                      category.id,
                    )}
                    className="home-collectibles-category-card"
                  >
                    <div className="home-collectibles-category-card-top">
                      <span
                        className="home-collectibles-category-icon"
                        aria-hidden="true"
                      >
                        {category.icon}
                      </span>

                      <span
                        className="home-collectibles-category-arrow"
                        aria-hidden="true"
                      >
                        <ArrowRight
                          size={17}
                        />
                      </span>
                    </div>

                    <div className="home-collectibles-category-content">
                      <h3>
                        {category.name}
                      </h3>

                      <p>
                        {category.description}
                      </p>
                    </div>
                  </Link>
                ),
              )}
            </div>
          )}
      </div>
    </section>
  );
}