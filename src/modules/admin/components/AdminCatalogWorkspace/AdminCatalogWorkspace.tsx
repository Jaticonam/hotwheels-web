import "./AdminCatalogWorkspace.css";

import {
  ArrowLeft,
  Check,
  Eye,
  FileText,
  Layers3,
  ListChecks,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  createCategoryCatalogComposition,
  createCustomCatalogComposition,
  isCatalogCompositionReady,
  type CatalogCompositionResolution,
} from "@/application/catalog/CatalogComposition";

import {
  adminCatalogSource,
} from "@/infrastructure/admin/adminCatalogSource";

import {
  catalogDocumentPort,
} from "@/infrastructure/documents/catalogDocumentPort";

import {
  prepareCatalogDocumentRequest,
} from "@/application/documents/CatalogDocumentRequest";

import type {
  CatalogDocumentResult,
} from "@/application/documents/CatalogDocumentPort";

import {
  AdminCatalogPreview,
} from "@/modules/admin/components/AdminCatalogPreview/AdminCatalogPreview";

import {
  readProductSelectionSnapshot,
} from "@/modules/admin/hooks/useProductSelection";

import type {
  Product,
} from "@/shared/types/product";

import {
  CATEGORIES,
} from "@/tenant/config/catalog";

type CatalogMode =
  | "category"
  | "custom";

interface AdminCatalogWorkspaceProps {
  onBackToCatalog:
    () => void;
}

export function AdminCatalogWorkspace({
  onBackToCatalog,
}: AdminCatalogWorkspaceProps) {
  const [
    products,
    setProducts,
  ] =
    useState<Product[]>([]);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null,
    );

  const [
    mode,
    setMode,
  ] =
    useState<CatalogMode>(
      "category",
    );

  const [
    title,
    setTitle,
  ] =
    useState(
      "Catálogo Hot Wheels",
    );

  const [
    categoryIds,
    setCategoryIds,
  ] =
    useState<string[]>([
      "todas",
    ]);

  const [
    customProductIds,
    setCustomProductIds,
  ] =
    useState<string[]>(
      () =>
        readProductSelectionSnapshot(),
    );

  const [
    resolution,
    setResolution,
  ] =
    useState<
      CatalogCompositionResolution | null
    >(
      null,
    );

  const [
    previewOpen,
    setPreviewOpen,
  ] =
    useState(false);

  const [
    generatingDocument,
    setGeneratingDocument,
  ] =
    useState(false);

  const [
    generatedDocument,
    setGeneratedDocument,
  ] =
    useState<
      CatalogDocumentResult | null
    >(
      null,
    );

  const [
    documentError,
    setDocumentError,
  ] =
    useState<string | null>(
      null,
    );

  useEffect(
    () => {
      let active = true;

      async function load() {
        setLoading(true);
        setError(null);

        try {
          const data =
            await adminCatalogSource
              .loadAllProducts();

          if (!active) {
            return;
          }

          setProducts(
            data,
          );

          setCustomProductIds(
            readProductSelectionSnapshot(),
          );
        }
        catch (loadError) {
          console.error(
            "No se pudo preparar Catálogos:",
            loadError,
          );

          if (active) {
            setError(
              "No se pudo cargar el catálogo administrativo.",
            );
          }
        }
        finally {
          if (active) {
            setLoading(false);
          }
        }
      }

      void load();

      return () => {
        active = false;
      };
    },
    [],
  );

  useEffect(
    () => {
      setResolution(
        null,
      );

      setPreviewOpen(
        false,
      );

      setGeneratedDocument(
        null,
      );

      setDocumentError(
        null,
      );
    },
    [
      mode,
      title,
      categoryIds,
      customProductIds,
    ],
  );

  const categories =
    useMemo(
      () =>
        CATEGORIES.filter(
          (category) =>
            category.id !==
              "todas",
        ),
      [],
    );

  const toggleCategory =
    (
      categoryId: string,
    ) => {
      if (
        categoryId === "todas"
      ) {
        setCategoryIds([
          "todas",
        ]);

        return;
      }

      setCategoryIds(
        (current) => {
          const withoutAll =
            current.filter(
              (id) =>
                id !== "todas",
            );

          if (
            withoutAll.includes(
              categoryId,
            )
          ) {
            return withoutAll.filter(
              (id) =>
                id !==
                categoryId,
            );
          }

          return [
            ...withoutAll,
            categoryId,
          ];
        },
      );
    };

  const prepareCatalog =
    () => {
      const next =
        mode === "category"
          ? createCategoryCatalogComposition(
              products,
              categoryIds,
              title,
            )
          : createCustomCatalogComposition(
              products,
              customProductIds,
              title,
            );

      setResolution(
        next,
      );
    };

  const modeInputCount =
    mode === "category"
      ? categoryIds.length
      : customProductIds.length;

  const canPrepare =
    !loading &&
    !error &&
    title.trim().length > 0 &&
    modeInputCount > 0;

  const compositionReady =
    resolution
      ? isCatalogCompositionReady(
          resolution.composition,
        )
      : false;

  const documentPreparation =
    useMemo(
      () => {
        if (
          !resolution ||
          !compositionReady
        ) {
          return null;
        }

        return prepareCatalogDocumentRequest(
          resolution.composition,
          products,
        );
      },
      [
        resolution,
        compositionReady,
        products,
      ],
    );

  const documentProviderReady =
    catalogDocumentPort.status
      .state === "ready";

  const canGenerateDocument =
    documentProviderReady &&
    documentPreparation?.request !==
      null &&
    documentPreparation?.request !==
      undefined &&
    !generatingDocument;

  const generateDocument =
    async () => {
      const request =
        documentPreparation
          ?.request;

      if (
        !request ||
        !documentProviderReady
      ) {
        return;
      }

      setGeneratingDocument(
        true,
      );

      setGeneratedDocument(
        null,
      );

      setDocumentError(
        null,
      );

      try {
        const result =
          await catalogDocumentPort
            .generate(
              request,
            );

        setGeneratedDocument(
          result,
        );
      }
      catch (error) {
        console.error(
          "No se pudo generar el catálogo:",
          error,
        );

        setDocumentError(
          "No se pudo generar el documento.",
        );
      }
      finally {
        setGeneratingDocument(
          false,
        );
      }
    };

  return (
    <section className="hwa-catalog-workspace">
      <div className="hwa-catalog-header">
        <div>
          <button
            type="button"
            className="hwa-catalog-back"
            onClick={
              onBackToCatalog
            }
          >
            <ArrowLeft
              size={15}
              aria-hidden="true"
            />

            Volver al catálogo
          </button>

          <p className="hwa-eyebrow">
            Catalog Builder
          </p>

          <h1>
            Nuevo catálogo
          </h1>

          <p>
            Define qué productos formarán parte del documento comercial.
          </p>
        </div>

        <div className="hwa-catalog-stage">
          <span>
            {
              compositionReady
                ? "2"
                : "1"
            }
          </span>

          <div>
            <strong>
              {
                compositionReady
                  ? "Vista previa"
                  : "Composición"
              }
            </strong>

            <small>
              {
                compositionReady
                  ? "Revisar documento"
                  : "Preparar contenido"
              }
            </small>
          </div>
        </div>
      </div>

      {
        loading
          ? (
              <div className="hwa-catalog-state">
                Cargando productos...
              </div>
            )
          : error
            ? (
                <div className="hwa-catalog-state hwa-catalog-state-error">
                  {error}
                </div>
              )
            : (
                <>
                  <div className="hwa-catalog-builder">
                    <section className="hwa-catalog-panel">
                      <div className="hwa-catalog-panel-heading">
                        <span>
                          01
                        </span>

                        <div>
                          <strong>
                            Tipo de catálogo
                          </strong>

                          <small>
                            Elige cómo construir la selección.
                          </small>
                        </div>
                      </div>

                      <div className="hwa-mode-grid">
                        <button
                          type="button"
                          className={[
                            "hwa-mode-card",
                            mode ===
                              "category"
                              ? "hwa-mode-card-active"
                              : "",
                          ].join(" ")}
                          onClick={() =>
                            setMode(
                              "category",
                            )
                          }
                        >
                          <Layers3
                            size={21}
                            aria-hidden="true"
                          />

                          <strong>
                            Por categorías
                          </strong>

                          <span>
                            Construye el catálogo automáticamente desde una o más categorías.
                          </span>
                        </button>

                        <button
                          type="button"
                          className={[
                            "hwa-mode-card",
                            mode ===
                              "custom"
                              ? "hwa-mode-card-active"
                              : "",
                          ].join(" ")}
                          onClick={() => {
                            setCustomProductIds(
                              readProductSelectionSnapshot(),
                            );

                            setMode(
                              "custom",
                            );
                          }}
                        >
                          <ListChecks
                            size={21}
                            aria-hidden="true"
                          />

                          <strong>
                            Personalizado
                          </strong>

                          <span>
                            Usa exactamente los productos seleccionados en Product Explorer.
                          </span>

                          <small>
                            {
                              customProductIds.length
                            } seleccionados
                          </small>
                        </button>
                      </div>
                    </section>

                    <section className="hwa-catalog-panel">
                      <div className="hwa-catalog-panel-heading">
                        <span>
                          02
                        </span>

                        <div>
                          <strong>
                            Contenido
                          </strong>

                          <small>
                            Define la selección comercial.
                          </small>
                        </div>
                      </div>

                      {
                        mode === "category"
                          ? (
                              <div className="hwa-catalog-categories">
                                <button
                                  type="button"
                                  className={[
                                    "hwa-catalog-category",
                                    categoryIds.includes(
                                      "todas",
                                    )
                                      ? "hwa-catalog-category-active"
                                      : "",
                                  ].join(" ")}
                                  onClick={() =>
                                    toggleCategory(
                                      "todas",
                                    )
                                  }
                                >
                                  <span>
                                    {
                                      categoryIds.includes(
                                        "todas",
                                      )
                                        ? "✓"
                                        : "▦"
                                    }
                                  </span>

                                  Todas
                                </button>

                                {
                                  categories.map(
                                    (category) => {
                                      const active =
                                        categoryIds.includes(
                                          category.id,
                                        );

                                      return (
                                        <button
                                          key={
                                            category.id
                                          }
                                          type="button"
                                          className={[
                                            "hwa-catalog-category",
                                            active
                                              ? "hwa-catalog-category-active"
                                              : "",
                                          ].join(" ")}
                                          onClick={() =>
                                            toggleCategory(
                                              category.id,
                                            )
                                          }
                                        >
                                          <span>
                                            {
                                              active
                                                ? "✓"
                                                : category.icon
                                            }
                                          </span>

                                          {
                                            category.name
                                          }
                                        </button>
                                      );
                                    },
                                  )
                                }
                              </div>
                            )
                          : (
                              <div className="hwa-custom-selection">
                                <div>
                                  <strong>
                                    {
                                      customProductIds.length
                                    }
                                  </strong>

                                  <span>
                                    productos seleccionados
                                  </span>
                                </div>

                                {
                                  customProductIds.length === 0
                                    ? (
                                        <p>
                                          Vuelve a Product Explorer y selecciona los autos que deseas incluir.
                                        </p>
                                      )
                                    : (
                                        <p>
                                          La composición respetará el orden de la selección guardada.
                                        </p>
                                      )
                                }

                                <button
                                  type="button"
                                  onClick={
                                    onBackToCatalog
                                  }
                                >
                                  Editar selección
                                </button>
                              </div>
                            )
                      }
                    </section>

                    <section className="hwa-catalog-panel">
                      <div className="hwa-catalog-panel-heading">
                        <span>
                          03
                        </span>

                        <div>
                          <strong>
                            Identidad
                          </strong>

                          <small>
                            Nombre comercial del catálogo.
                          </small>
                        </div>
                      </div>

                      <label className="hwa-catalog-field">
                        <span>
                          Título
                        </span>

                        <input
                          value={
                            title
                          }
                          onChange={
                            (event) =>
                              setTitle(
                                event.target.value,
                              )
                          }
                          placeholder="Ej. Premium Agosto 2026"
                        />
                      </label>
                    </section>
                  </div>

                  <div className="hwa-catalog-actionbar">
                    <div>
                      <FileText
                        size={18}
                        aria-hidden="true"
                      />

                      <span>
                        {
                          mode === "category"
                            ? `${
                                categoryIds.includes(
                                  "todas",
                                )
                                  ? "Todas las categorías"
                                  : `${categoryIds.length} categorías`
                              }`
                            : `${customProductIds.length} productos seleccionados`
                        }
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={
                        prepareCatalog
                      }
                      disabled={
                        !canPrepare
                      }
                    >
                      Preparar catálogo
                    </button>
                  </div>

                  {
                    resolution &&
                    (
                      <section className="hwa-composition-preview">
                        <div className="hwa-composition-success">
                          <span>
                            <Check
                              size={18}
                              strokeWidth={3}
                              aria-hidden="true"
                            />
                          </span>

                          <div>
                            <strong>
                              Composición preparada
                            </strong>

                            <small>
                              Lista para revisar el documento comercial.
                            </small>
                          </div>

                          {
                            compositionReady &&
                            (
                              <button
                                type="button"
                                className="hwa-open-preview"
                                onClick={() =>
                                  setPreviewOpen(
                                    true,
                                  )
                                }
                              >
                                <Eye
                                  size={15}
                                  aria-hidden="true"
                                />

                                Vista previa
                              </button>
                            )
                          }
                        </div>

                        <div className="hwa-composition-grid">
                          <div>
                            <span>
                              Título
                            </span>

                            <strong>
                              {
                                resolution
                                  .composition
                                  .title
                              }
                            </strong>
                          </div>

                          <div>
                            <span>
                              Tipo
                            </span>

                            <strong>
                              {
                                resolution
                                  .composition
                                  .mode ===
                                "category"
                                  ? "Por categorías"
                                  : "Personalizado"
                              }
                            </strong>
                          </div>

                          <div>
                            <span>
                              Productos
                            </span>

                            <strong>
                              {
                                resolution
                                  .composition
                                  .productIds
                                  .length
                              }
                            </strong>
                          </div>

                          <div>
                            <span>
                              Excluidos
                            </span>

                            <strong>
                              {
                                resolution
                                  .excludedProductIds
                                  .length
                              }
                            </strong>
                          </div>
                        </div>

                        {
                          !compositionReady &&
                          (
                            <p className="hwa-composition-warning">
                              La composición todavía no contiene productos comerciales válidos.
                            </p>
                          )
                        }

                        {
                          compositionReady &&
                          (
                            <div className="hwa-document-readiness">
                              <div className="hwa-document-provider">
                                <span
                                  className={[
                                    "hwa-document-provider-dot",
                                    documentProviderReady
                                      ? "hwa-document-provider-dot-ready"
                                      : "",
                                  ].join(" ")}
                                />

                                <div>
                                  <strong>
                                    Motor documental
                                  </strong>

                                  <small>
                                    {
                                      catalogDocumentPort
                                        .status
                                        .message
                                    }
                                  </small>
                                </div>
                              </div>

                              <button
                                type="button"
                                className="hwa-generate-document"
                                onClick={() =>
                                  void generateDocument()
                                }
                                disabled={
                                  !canGenerateDocument
                                }
                                title={
                                  documentProviderReady
                                    ? "Generar catálogo"
                                    : "Disponible cuando JUNG CORE Documents esté conectado"
                                }
                              >
                                {
                                  generatingDocument
                                    ? "Generando..."
                                    : "Generar PDF"
                                }
                              </button>
                            </div>
                          )
                        }

                        {
                          documentPreparation &&
                          documentPreparation
                            .missingProductIds
                            .length > 0 &&
                          (
                            <p className="hwa-composition-warning">
                              La composición cambió: hay productos que ya no existen en la fuente actual.
                            </p>
                          )
                        }

                        {
                          documentError &&
                          (
                            <p className="hwa-document-error">
                              {
                                documentError
                              }
                            </p>
                          )
                        }

                        {
                          generatedDocument &&
                          (
                            <a
                              className="hwa-generated-document"
                              href={
                                generatedDocument.url
                              }
                              target="_blank"
                              rel="noreferrer"
                            >
                              Abrir documento generado
                            </a>
                          )
                        }
                      </section>
                    )
                  }

                  {
                    previewOpen &&
                    resolution &&
                    compositionReady &&
                    (
                      <AdminCatalogPreview
                        composition={
                          resolution.composition
                        }
                        products={
                          products
                        }
                        onClose={() =>
                          setPreviewOpen(
                            false,
                          )
                        }
                      />
                    )
                  }
                </>
              )
      }
    </section>
  );
}
