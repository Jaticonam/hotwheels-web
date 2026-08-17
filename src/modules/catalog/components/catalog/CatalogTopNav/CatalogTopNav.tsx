import { useState } from "react";
import {
  Compass,
  X,
} from "lucide-react";

import "./CatalogTopNav.css";

import type {
  CatalogTopNavProps,
} from "./CatalogTopNav.types";

export function CatalogTopNav({
  categoryItems,
  activeCategory = "todas",
  categoryCounts = {},
  onCategorySelect,
  searchSlot,
  logoSlot,
}: CatalogTopNavProps) {
  const [
    exploreOpen,
    setExploreOpen,
  ] = useState(false);

  const handleCategorySelect = (
    id: string,
  ) => {
    onCategorySelect?.(id);
    setExploreOpen(false);
  };

  return (
    <>
      <header className="catalog-top-nav">
        <div className="catalog-top-nav-brand-row">
          {logoSlot}
        </div>

        <nav
          className="catalog-top-nav-categories"
          aria-label="Categorías"
        >
          {categoryItems.map(
            (item) => {
              const isActive =
                activeCategory ===
                item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  className={[
                    "catalog-category-chip",
                    isActive
                      ? "active"
                      : "",
                  ].join(" ")}
                  onClick={() =>
                    handleCategorySelect(
                      item.id,
                    )
                  }
                >
                  {item.icon && (
                    <span className="catalog-category-icon">
                      {item.icon}
                    </span>
                  )}

                  <span>
                    {item.name}
                  </span>

                  {categoryCounts[
                    item.id
                  ] !== undefined && (
                    <small>
                      (
                      {
                        categoryCounts[
                          item.id
                        ]
                      }
                      )
                    </small>
                  )}
                </button>
              );
            },
          )}
        </nav>

        <div className="catalog-top-nav-search-row">
          {searchSlot}
        </div>
      </header>

      <button
        type="button"
        className="catalog-explore-fab"
        onClick={() =>
          setExploreOpen(true)
        }
      >
        <Compass className="w-4 h-4" />
        Explorar
      </button>

      {exploreOpen && (
        <div className="catalog-explore-overlay">
          <button
            type="button"
            className="catalog-explore-backdrop"
            onClick={() =>
              setExploreOpen(false)
            }
            aria-label="Cerrar explorar"
          />

          <div className="catalog-explore-sheet">
            <div className="catalog-explore-header">
              <div>
                <span>
                  Explorar catálogo
                </span>

                <h3>
                  Selecciona una categoría
                </h3>
              </div>

              <button
                type="button"
                onClick={() =>
                  setExploreOpen(false)
                }
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="catalog-explore-group">
              <p>Categorías</p>

              <div className="catalog-explore-list">
                {categoryItems.map(
                  (item) => {
                    const isActive =
                      activeCategory ===
                        item.id;

                    return (
                      <button
                        key={
                          item.id
                        }
                        type="button"
                        className={[
                          "catalog-explore-chip",
                          isActive
                            ? "active"
                            : "",
                        ].join(
                          " ",
                        )}
                        onClick={() =>
                          handleCategorySelect(
                            item.id,
                          )
                        }
                      >
                        <span>
                          {item.icon}
                        </span>

                        {item.name}

                        {categoryCounts[
                          item.id
                        ] !==
                          undefined && (
                          <small>
                            (
                            {
                              categoryCounts[
                                item.id
                              ]
                            }
                            )
                          </small>
                        )}
                      </button>
                    );
                  },
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}