import "./AdminProductExplorer.css";

import {
  CheckSquare2,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";

import {
  CATEGORIES,
} from "@/tenant/config/catalog";

import {
  AdminProductCard,
} from "@/modules/admin/components/AdminProductCard/AdminProductCard";

import {
  type AdminProductStatusFilter,
  useAdminProducts,
} from "@/modules/admin/hooks/useAdminProducts";

import {
  useProductSelection,
} from "@/modules/admin/hooks/useProductSelection";

const STATUS_OPTIONS: {
  id: AdminProductStatusFilter;
  label: string;
}[] = [
  {
    id: "todos",
    label: "Todos",
  },
  {
    id: "publicado",
    label: "Publicado",
  },
  {
    id: "preventa",
    label: "Preventa",
  },
  {
    id: "agotado",
    label: "Agotado",
  },
  {
    id: "oculto",
    label: "Oculto",
  },
  {
    id: "borrador",
    label: "Borrador",
  },
];

function formatSyncTime(
  value: string | null,
): string {
  if (!value) {
    return "Sin sincronización";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "Sin sincronización";
  }

  return new Intl.DateTimeFormat(
    "es-PE",
    {
      dateStyle: "short",
      timeStyle: "short",
    },
  ).format(date);
}

interface AdminProductExplorerProps {
  onPrepareCatalog?:
    () => void;
}

export function AdminProductExplorer({
  onPrepareCatalog,
}: AdminProductExplorerProps) {
  const {
    products,
    filteredProducts,

    loading,
    syncing,
    error,

    query,
    setQuery,

    category,
    setCategory,

    status,
    setStatus,

    statusCounts,

    syncResult,
    lastSyncedAt,

    sync,
  } =
    useAdminProducts();

  const productIds =
    products.map(
      (product) =>
        product.id,
    );

  const visibleProductIds =
    filteredProducts.map(
      (product) =>
        product.id,
    );

  const {
    selectedSet,
    selectedCount,

    toggleProduct,
    toggleProducts,

    areAllSelected,

    clearSelection,
  } =
    useProductSelection(
      productIds,
    );

  const allVisibleSelected =
    areAllSelected(
      visibleProductIds,
    );

  const syncChanges =
    syncResult
      ? syncResult.added.length +
        syncResult.updated.length +
        syncResult.removed.length
      : 0;

  return (
    <section className="hwa-explorer">
      <div className="hwa-explorer-heading">
        <div>
          <p className="hwa-eyebrow">
            Product Explorer
          </p>

          <h1>
            Catálogo
          </h1>

          <p className="hwa-explorer-copy">
            Busca, filtra, selecciona y revisa el catálogo comercial desde un solo workspace.
          </p>
        </div>

        <div className="hwa-source-status">
          <span className="hwa-source-dot" />

          <div>
            <strong>
              Google Sheets
            </strong>

            <span>
              Última sync · {
                formatSyncTime(
                  lastSyncedAt,
                )
              }
            </span>
          </div>
        </div>
      </div>

      <div className="hwa-explorer-toolbar">
        <label className="hwa-search">
          <Search
            size={18}
            aria-hidden="true"
          />

          <input
            value={query}
            onChange={(event) =>
              setQuery(
                event.target.value,
              )
            }
            placeholder="Buscar modelo, ID, serie, case..."
            aria-label="Buscar productos"
          />

          {
            query &&
            (
              <button
                type="button"
                onClick={() =>
                  setQuery("")
                }
              >
                Limpiar
              </button>
            )
          }
        </label>

        <button
          type="button"
          className="hwa-refresh-button"
          onClick={() =>
            void sync()
          }
          disabled={
            loading ||
            syncing
          }
        >
          <RefreshCw
            size={17}
            className={
              syncing
                ? "hwa-spin"
                : undefined
            }
          />

          {
            syncing
              ? "Sincronizando..."
              : "Sincronizar"
          }
        </button>
      </div>

      {
        syncResult &&
        (
          <div
            className={[
              "hwa-sync-summary",
              syncChanges === 0
                ? "hwa-sync-summary-clean"
                : "",
            ].join(" ")}
          >
            <div className="hwa-sync-summary-copy">
              <strong>
                {
                  syncChanges === 0
                    ? "Catálogo al día"
                    : "Sincronización completada"
                }
              </strong>

              <span>
                {
                  syncResult.totalCurrent
                } productos leídos desde Google Sheets
              </span>
            </div>

            <div className="hwa-sync-metrics">
              <span>
                <strong>
                  +{
                    syncResult.added.length
                  }
                </strong>
                nuevos
              </span>

              <span>
                <strong>
                  ~{
                    syncResult.updated.length
                  }
                </strong>
                modificados
              </span>

              <span>
                <strong>
                  -{
                    syncResult.removed.length
                  }
                </strong>
                retirados
              </span>

              <span>
                <strong>
                  {
                    syncResult.unchanged
                  }
                </strong>
                sin cambios
              </span>
            </div>
          </div>
        )
      }

      <div className="hwa-filter-group">
        <div className="hwa-category-row">
          {
            CATEGORIES.map(
              (item) => (
                <button
                  key={item.id}
                  type="button"
                  className={
                    category ===
                    item.id
                      ? "hwa-filter-chip hwa-filter-chip-active"
                      : "hwa-filter-chip"
                  }
                  onClick={() =>
                    setCategory(
                      item.id,
                    )
                  }
                >
                  <span>
                    {item.icon}
                  </span>

                  {item.name}
                </button>
              ),
            )
          }
        </div>

        <div className="hwa-status-row">
          {
            STATUS_OPTIONS.map(
              (item) => (
                <button
                  key={item.id}
                  type="button"
                  className={
                    status ===
                    item.id
                      ? "hwa-status-chip hwa-status-chip-active"
                      : "hwa-status-chip"
                  }
                  onClick={() =>
                    setStatus(
                      item.id,
                    )
                  }
                >
                  {item.label}

                  <span>
                    {
                      statusCounts[
                        item.id
                      ]
                    }
                  </span>
                </button>
              ),
            )
          }
        </div>
      </div>

      <div className="hwa-result-bar">
        <div className="hwa-result-count">
          <strong>
            {
              filteredProducts.length
            }
          </strong>

          <span>
            de {products.length} productos
          </span>
        </div>

        {
          filteredProducts.length > 0 &&
          (
            <button
              type="button"
              className="hwa-select-visible-button"
              onClick={() =>
                toggleProducts(
                  visibleProductIds,
                )
              }
            >
              <CheckSquare2
                size={15}
                aria-hidden="true"
              />

              {
                allVisibleSelected
                  ? "Quitar visibles"
                  : "Seleccionar visibles"
              }
            </button>
          )
        }
      </div>

      {
        loading
          ? (
              <div className="hwa-state">
                Cargando catálogo...
              </div>
            )
          : error
            ? (
                <div className="hwa-state hwa-state-error">
                  <strong>
                    No se pudo cargar el catálogo.
                  </strong>

                  <span>
                    {error}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      void sync()
                    }
                  >
                    Reintentar
                  </button>
                </div>
              )
            : filteredProducts.length === 0
              ? (
                  <div className="hwa-state">
                    No hay productos que coincidan con estos filtros.
                  </div>
                )
              : (
                  <div className="hwa-product-grid">
                    {
                      filteredProducts.map(
                        (product) => (
                          <AdminProductCard
                            key={
                              product.id
                            }
                            product={
                              product
                            }
                            selected={
                              selectedSet.has(
                                product.id,
                              )
                            }
                            onToggleSelection={
                              () =>
                                toggleProduct(
                                  product.id,
                                )
                            }
                          />
                        ),
                      )
                    }
                  </div>
                )
      }

      {
        selectedCount > 0 &&
        (
          <div className="hwa-selection-bar">
            <div className="hwa-selection-bar-count">
              <span className="hwa-selection-bar-icon">
                <CheckSquare2
                  size={17}
                  aria-hidden="true"
                />
              </span>

              <div>
                <strong>
                  {
                    selectedCount
                  } {
                    selectedCount === 1
                      ? "producto seleccionado"
                      : "productos seleccionados"
                  }
                </strong>

                <span>
                  La selección se conserva al cambiar filtros.
                </span>
              </div>
            </div>

            <div className="hwa-selection-actions">
              <button
                type="button"
                className="hwa-clear-selection"
                onClick={
                  clearSelection
                }
              >
                <Trash2
                  size={15}
                  aria-hidden="true"
                />

                Limpiar selección
              </button>

              {
                onPrepareCatalog &&
                (
                  <button
                    type="button"
                    className="hwa-prepare-catalog"
                    onClick={
                      onPrepareCatalog
                    }
                  >
                    Preparar catálogo
                  </button>
                )
              }
            </div>
          </div>
        )
      }
    </section>
  );
}
