
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
  exploreOpen = false,
  onExploreOpenChange,
  searchSlot,
}: CatalogTopNavProps) {

  const handleCategorySelect = (
    id: string,
  ) => {
    onCategorySelect?.(id);
    onExploreOpenChange?.(false);
  };

  return (
    <>
      <header className="catalog-top-nav">
        <div className="catalog-top-nav-inner">
          <nav
            className="catalog-top-nav-categories"
            aria-label="Categorías del catálogo"
          >
            {categoryItems.map((item) => {
              const isActive =
                activeCategory === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  className={[
                    "catalog-category-chip",
                    isActive ? "active" : "",
                  ].join(" ")}
                  onClick={() =>
                    handleCategorySelect(
                      item.id,
                    )
                  }
                  aria-pressed={isActive}
                >
                  {item.icon && (
                    <span
                      className="catalog-category-icon"
                      aria-hidden="true"
                    >
                      {item.icon}
                    </span>
                  )}

                  <span>
                    {item.name}
                  </span>

                  {categoryCounts[item.id] !==
                    undefined && (
                    <small>
                      {
                        categoryCounts[
                          item.id
                        ]
                      }
                    </small>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="catalog-top-nav-search-tools">
            <div className="catalog-top-nav-search-row">
              {searchSlot}
            </div>

            {!exploreOpen && (
              <button
                type="button"
                className="catalog-explore-trigger"
                onClick={() =>
                  onExploreOpenChange?.(true)
                }
                aria-label="Explorar catálogo"
                title="Explorar catálogo"
              >
                <Compass
                  className="w-[18px] h-[18px]"
                  aria-hidden="true"
                />
              </button>
            )}
          </div>
        </div>
      </header>

      {exploreOpen && (
        <div className="catalog-explore-overlay">
          <button
            type="button"
            className="catalog-explore-backdrop"
            onClick={() =>
              onExploreOpenChange?.(false)
            }
            aria-label="Cerrar explorar"
          />

          <div
            className="catalog-explore-sheet"
            role="dialog"
            aria-modal="true"
            aria-label="Explorar catálogo"
          >
            <div className="catalog-explore-header">
              <div>
                <span>
                  Explorar catálogo
                </span>

                <h3>
                  Categorías
                </h3>
              </div>

              <button
                type="button"
                className="catalog-explore-close"
                onClick={() =>
                  onExploreOpenChange?.(false)
                }
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="catalog-explore-group">
              <p>
                Selecciona una categoría
              </p>

              <div className="catalog-explore-list">
                {categoryItems.map((item) => {
                  const isActive =
                    activeCategory ===
                    item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={[
                        "catalog-explore-chip",
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
                        <span
                          aria-hidden="true"
                        >
                          {item.icon}
                        </span>
                      )}

                      <strong>
                        {item.name}
                      </strong>

                      {categoryCounts[
                        item.id
                      ] !== undefined && (
                        <small>
                          {
                            categoryCounts[
                              item.id
                            ]
                          }
                        </small>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}