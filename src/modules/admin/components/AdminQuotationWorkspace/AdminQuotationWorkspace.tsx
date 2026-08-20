import "./AdminQuotationWorkspace.css";

import {
  ArrowLeft,
  Clock3,
  Minus,
  PackageOpen,
  Plus,
  ReceiptText,
  Save,
  Trash2,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  calculateQuotationSummary,
  createQuotationComposition,
  isQuotationCompositionReady,
  removeQuotationLine,
  updateQuotationLineQuantity,
  type QuotationComposition,
} from "@/application/quotation/QuotationComposition";

import {
  createQuotationCommercialContext,
  isQuotationCommercialContextReady,
  updateQuotationCommercialTerms,
  updateQuotationCustomer,
  type QuotationCommercialTerms,
  type QuotationCustomer,
} from "@/application/quotation/QuotationCommercialContext";

import {
  createQuotationDraft,
  updateQuotationDraft,
  type QuotationDraft,
} from "@/application/quotation/QuotationDraft";

import {
  adminCatalogSource,
} from "@/infrastructure/admin/adminCatalogSource";

import {
  quotationDraftRepository,
} from "@/infrastructure/quotation/quotationDraftRepository";

import {
  readProductSelectionSnapshot,
} from "@/modules/admin/hooks/useProductSelection";

import type {
  Product,
} from "@/shared/types/product";

interface AdminQuotationWorkspaceProps {
  onBackToCatalog:
    () => void;
}

function formatMoney(
  value: number,
): string {
  return new Intl.NumberFormat(
    "es-PE",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  ).format(value);
}

function getLocalDateValue():
string {
  const now =
    new Date();

  const year =
    now.getFullYear();

  const month =
    String(
      now.getMonth() + 1,
    ).padStart(
      2,
      "0",
    );

  const day =
    String(
      now.getDate(),
    ).padStart(
      2,
      "0",
    );

  return `${year}-${month}-${day}`;
}

function createDraftId():
string {
  const timestamp =
    new Date()
      .toISOString()
      .replace(
        /\D/g,
        "",
      )
      .slice(
        0,
        14,
      );

  const suffix =
    typeof globalThis.crypto !==
      "undefined" &&
    typeof globalThis.crypto.randomUUID ===
      "function"
      ? globalThis.crypto
          .randomUUID()
          .slice(
            0,
            8,
          )
          .toUpperCase()
      : Date.now()
          .toString(36)
          .toUpperCase();

  return `Q-${timestamp}-${suffix}`;
}

function formatDraftUpdatedAt(
  value: string,
): string {
  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return value;
  }

  return new Intl.DateTimeFormat(
    "es-PE",
    {
      dateStyle:
        "short",

      timeStyle:
        "short",
    },
  ).format(date);
}

function cloneDraftComposition(
  draft:
    QuotationDraft,
): QuotationComposition {
  return {
    ...draft.composition,

    lines:
      draft.composition.lines.map(
        (line) => ({
          ...line,
        }),
      ),
  };
}

export function AdminQuotationWorkspace({
  onBackToCatalog,
}: AdminQuotationWorkspaceProps) {
  const [
    products,
    setProducts,
  ] =
    useState<Product[]>([]);

  const [
    composition,
    setComposition,
  ] =
    useState<
      QuotationComposition | null
    >(
      null,
    );

  const [
    excludedProductIds,
    setExcludedProductIds,
  ] =
    useState<string[]>([]);

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
    commercialContext,
    setCommercialContext,
  ] =
    useState(
      () =>
        createQuotationCommercialContext(
          getLocalDateValue(),
        ),
    );

  const [
    drafts,
    setDrafts,
  ] =
    useState<QuotationDraft[]>(
      () =>
        quotationDraftRepository
          .list(),
    );

  const [
    activeDraftId,
    setActiveDraftId,
  ] =
    useState<string | null>(
      null,
    );

  const [
    draftNotice,
    setDraftNotice,
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

          const selectedIds =
            readProductSelectionSnapshot();

          const resolution =
            createQuotationComposition(
              data,
              selectedIds,
              "Cotización Hot Wheels",
            );

          setProducts(
            data,
          );

          setComposition(
            resolution.composition,
          );

          setExcludedProductIds(
            resolution.excludedProductIds,
          );
        }
        catch (loadError) {
          console.error(
            "No se pudo preparar Cotizaciones:",
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

  const summary =
    useMemo(
      () =>
        composition
          ? calculateQuotationSummary(
              composition,
            )
          : null,
      [composition],
    );

  const compositionReady =
    composition
      ? isQuotationCompositionReady(
          composition,
        )
      : false;

  const commercialReady =
    isQuotationCommercialContextReady(
      commercialContext,
    );

  const ready =
    compositionReady &&
    commercialReady;

  const refreshDrafts =
    () => {
      setDrafts(
        quotationDraftRepository
          .list(),
      );
    };

  const updateCustomerField =
    (
      field:
        keyof QuotationCustomer,
      value: string,
    ) => {
      setCommercialContext(
        (current) =>
          updateQuotationCustomer(
            current,
            {
              [field]:
                value,
            },
          ),
      );

      setDraftNotice(
        null,
      );
    };

  const updateTermsField =
    (
      field:
        keyof QuotationCommercialTerms,
      value: string,
    ) => {
      setCommercialContext(
        (current) =>
          updateQuotationCommercialTerms(
            current,
            {
              [field]:
                value,
            },
          ),
      );

      setDraftNotice(
        null,
      );
    };

  const updateQuantity =
    (
      productId: string,
      quantity: number,
    ) => {
      setComposition(
        (current) =>
          current
            ? updateQuotationLineQuantity(
                current,
                productId,
                quantity,
              )
            : current,
      );

      setDraftNotice(
        null,
      );
    };

  const removeLine =
    (
      productId: string,
    ) => {
      setComposition(
        (current) =>
          current
            ? removeQuotationLine(
                current,
                productId,
              )
            : current,
      );

      setDraftNotice(
        null,
      );
    };

  const saveDraft =
    () => {
      if (!composition) {
        return;
      }

      try {
        const now =
          new Date()
            .toISOString();

        const existing =
          activeDraftId
            ? quotationDraftRepository
                .findById(
                  activeDraftId,
                )
            : null;

        const draft =
          existing
            ? updateQuotationDraft(
                existing,
                {
                  now,
                  composition,
                  commercialContext,
                },
              )
            : createQuotationDraft({
                id:
                  createDraftId(),

                now,

                composition,

                commercialContext,
              });

        quotationDraftRepository
          .save(
            draft,
          );

        setActiveDraftId(
          draft.id,
        );

        refreshDrafts();

        setDraftNotice(
          existing
            ? "Borrador actualizado."
            : "Borrador guardado.",
        );
      }
      catch (saveError) {
        console.error(
          "No se pudo guardar el borrador:",
          saveError,
        );

        setDraftNotice(
          "No se pudo guardar el borrador.",
        );
      }
    };

  const loadDraft =
    (
      id: string,
    ) => {
      const draft =
        quotationDraftRepository
          .findById(
            id,
          );

      if (!draft) {
        refreshDrafts();

        setDraftNotice(
          "El borrador ya no existe.",
        );

        return;
      }

      setComposition(
        cloneDraftComposition(
          draft,
        ),
      );

      setCommercialContext({
        schemaVersion: 1,

        customer: {
          ...draft
            .commercialContext
            .customer,
        },

        terms: {
          ...draft
            .commercialContext
            .terms,
        },
      });

      setExcludedProductIds(
        [],
      );

      setActiveDraftId(
        draft.id,
      );

      setDraftNotice(
        "Borrador recuperado.",
      );
    };

  const deleteDraft =
    (
      id: string,
    ) => {
      try {
        quotationDraftRepository
          .remove(
            id,
          );

        if (
          activeDraftId ===
          id
        ) {
          setActiveDraftId(
            null,
          );
        }

        refreshDrafts();

        setDraftNotice(
          "Borrador eliminado.",
        );
      }
      catch (removeError) {
        console.error(
          "No se pudo eliminar el borrador:",
          removeError,
        );

        setDraftNotice(
          "No se pudo eliminar el borrador.",
        );
      }
    };

  return (
    <section className="hwa-quotation-workspace">
      <header className="hwa-quotation-header">
        <div>
          <button
            type="button"
            className="hwa-quotation-back"
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
            Quotation Builder
          </p>

          <h1>
            Nueva cotización
          </h1>

          <p className="hwa-quotation-copy">
            Ajusta cantidades y revisa el valor comercial de la selección.
          </p>
        </div>

        <div className="hwa-quotation-stage">
          <span>
            <ReceiptText
              size={17}
              aria-hidden="true"
            />
          </span>

          <div>
            <strong>
              Composición
            </strong>

            <small>
              Admin 1.1 · Q4
            </small>
          </div>
        </div>
      </header>

      {
        loading
          ? (
              <div className="hwa-quotation-state">
                Preparando cotización...
              </div>
            )
          : error
            ? (
                <div className="hwa-quotation-state hwa-quotation-state-error">
                  {error}
                </div>
              )
            : !composition
              ? (
                  <div className="hwa-quotation-state">
                    No se pudo construir la cotización.
                  </div>
                )
              : (
                  <>
                    <section className="hwa-quotation-meta">
                      <label className="hwa-quotation-title-field">
                        <span>
                          Título
                        </span>

                        <input
                          value={
                            composition.title
                          }
                          onChange={
                            (event) => {
                              setComposition({
                                ...composition,

                                title:
                                  event.target.value,
                              });

                              setDraftNotice(
                                null,
                              );
                            }
                          }
                          placeholder="Nombre de la cotización"
                        />
                      </label>

                      <div className="hwa-quotation-origin">
                        <span>
                          Selección origen
                        </span>

                        <strong>
                          {
                            composition.lines.length +
                            excludedProductIds.length
                          } productos
                        </strong>

                        {
                          excludedProductIds.length >
                            0 &&
                          (
                            <small>
                              {
                                excludedProductIds.length
                              } no cotizables fueron excluidos
                            </small>
                          )
                        }
                      </div>
                    </section>

                    <section className="hwa-quotation-drafts-panel">
                      <div className="hwa-quotation-drafts-heading">
                        <div className="hwa-quotation-drafts-title">
                          <span>
                            <Save
                              size={15}
                              aria-hidden="true"
                            />
                          </span>

                          <div>
                            <strong>
                              Borradores
                            </strong>

                            <small>
                              Guarda manualmente el estado completo de la cotización.
                            </small>
                          </div>
                        </div>

                        <div className="hwa-quotation-drafts-actions">
                          {
                            activeDraftId &&
                            (
                              <span className="hwa-quotation-active-draft">
                                Editando borrador
                              </span>
                            )
                          }

                          <button
                            type="button"
                            className="hwa-quotation-save-draft"
                            onClick={
                              saveDraft
                            }
                          >
                            <Save
                              size={14}
                              aria-hidden="true"
                            />

                            {
                              activeDraftId
                                ? "Actualizar borrador"
                                : "Guardar borrador"
                            }
                          </button>
                        </div>
                      </div>

                      {
                        draftNotice &&
                        (
                          <div className="hwa-quotation-draft-notice">
                            {
                              draftNotice
                            }
                          </div>
                        )
                      }

                      {
                        drafts.length ===
                        0
                          ? (
                              <div className="hwa-quotation-drafts-empty">
                                Aún no hay borradores guardados.
                              </div>
                            )
                          : (
                              <div className="hwa-quotation-drafts-list">
                                {
                                  drafts.map(
                                    (draft) => {
                                      const isActive =
                                        draft.id ===
                                        activeDraftId;

                                      return (
                                        <article
                                          key={
                                            draft.id
                                          }
                                          className={[
                                            "hwa-quotation-draft-item",
                                            isActive
                                              ? "hwa-quotation-draft-item-active"
                                              : "",
                                          ].join(" ")}
                                        >
                                          <button
                                            type="button"
                                            className="hwa-quotation-draft-open"
                                            onClick={() =>
                                              loadDraft(
                                                draft.id,
                                              )
                                            }
                                          >
                                            <div>
                                              <strong>
                                                {
                                                  draft
                                                    .composition
                                                    .title
                                                }
                                              </strong>

                                              <span>
                                                {
                                                  draft
                                                    .commercialContext
                                                    .customer
                                                    .name ||
                                                  "Cliente pendiente"
                                                }
                                              </span>
                                            </div>

                                            <small>
                                              <Clock3
                                                size={11}
                                                aria-hidden="true"
                                              />

                                              {
                                                formatDraftUpdatedAt(
                                                  draft.updatedAt,
                                                )
                                              }
                                            </small>
                                          </button>

                                          <button
                                            type="button"
                                            className="hwa-quotation-draft-delete"
                                            onClick={() =>
                                              deleteDraft(
                                                draft.id,
                                              )
                                            }
                                            aria-label={`Eliminar borrador ${draft.composition.title}`}
                                          >
                                            <Trash2
                                              size={14}
                                              aria-hidden="true"
                                            />
                                          </button>
                                        </article>
                                      );
                                    },
                                  )
                                }
                              </div>
                            )
                      }
                    </section>

                    <section className="hwa-quotation-context-grid">
                      <div className="hwa-quotation-context-panel">
                        <div className="hwa-quotation-context-heading">
                          <span>
                            01
                          </span>

                          <div>
                            <strong>
                              Cliente
                            </strong>

                            <small>
                              Identifica a quién está dirigida la cotización.
                            </small>
                          </div>
                        </div>

                        <div className="hwa-quotation-customer-fields">
                          <label className="hwa-quotation-context-field hwa-quotation-context-field-wide">
                            <span>
                              Nombre / empresa *
                            </span>

                            <input
                              value={
                                commercialContext
                                  .customer
                                  .name
                              }
                              onChange={
                                (event) =>
                                  updateCustomerField(
                                    "name",
                                    event.target.value,
                                  )
                              }
                              placeholder="Ej. Colecciones Tacna"
                            />
                          </label>

                          <label className="hwa-quotation-context-field">
                            <span>
                              WhatsApp
                            </span>

                            <input
                              value={
                                commercialContext
                                  .customer
                                  .whatsapp
                              }
                              onChange={
                                (event) =>
                                  updateCustomerField(
                                    "whatsapp",
                                    event.target.value,
                                  )
                              }
                              placeholder="+51 999 999 999"
                            />
                          </label>

                          <label className="hwa-quotation-context-field">
                            <span>
                              DNI / RUC
                            </span>

                            <input
                              value={
                                commercialContext
                                  .customer
                                  .document
                              }
                              onChange={
                                (event) =>
                                  updateCustomerField(
                                    "document",
                                    event.target.value,
                                  )
                              }
                              placeholder="Opcional"
                            />
                          </label>
                        </div>
                      </div>

                      <div className="hwa-quotation-context-panel">
                        <div className="hwa-quotation-context-heading">
                          <span>
                            02
                          </span>

                          <div>
                            <strong>
                              Condiciones
                            </strong>

                            <small>
                              Referencias comerciales de la cotización.
                            </small>
                          </div>
                        </div>

                        <div className="hwa-quotation-terms-fields">
                          <label className="hwa-quotation-context-field">
                            <span>
                              Fecha de emisión *
                            </span>

                            <input
                              type="date"
                              value={
                                commercialContext
                                  .terms
                                  .issuedOn
                              }
                              onChange={
                                (event) =>
                                  updateTermsField(
                                    "issuedOn",
                                    event.target.value,
                                  )
                              }
                            />
                          </label>

                          <label className="hwa-quotation-context-field">
                            <span>
                              Válida hasta
                            </span>

                            <input
                              type="date"
                              min={
                                commercialContext
                                  .terms
                                  .issuedOn
                              }
                              value={
                                commercialContext
                                  .terms
                                  .validUntil
                              }
                              onChange={
                                (event) =>
                                  updateTermsField(
                                    "validUntil",
                                    event.target.value,
                                  )
                              }
                            />
                          </label>

                          <label className="hwa-quotation-context-field hwa-quotation-context-field-wide">
                            <span>
                              Observaciones
                            </span>

                            <textarea
                              rows={2}
                              value={
                                commercialContext
                                  .terms
                                  .notes
                              }
                              onChange={
                                (event) =>
                                  updateTermsField(
                                    "notes",
                                    event.target.value,
                                  )
                              }
                              placeholder="Condiciones, referencias o notas para el cliente..."
                            />
                          </label>
                        </div>
                      </div>
                    </section>

                    {
                      composition.lines.length ===
                      0
                        ? (
                            <section className="hwa-quotation-empty">
                              <span>
                                <PackageOpen
                                  size={26}
                                  aria-hidden="true"
                                />
                              </span>

                              <div>
                                <strong>
                                  No hay productos cotizables
                                </strong>

                                <p>
                                  Selecciona productos publicados o en preventa con precio válido.
                                </p>
                              </div>

                              <button
                                type="button"
                                onClick={
                                  onBackToCatalog
                                }
                              >
                                Editar selección
                              </button>
                            </section>
                          )
                        : (
                            <div className="hwa-quotation-layout">
                              <section className="hwa-quotation-lines">
                                <div className="hwa-quotation-lines-heading">
                                  <div>
                                    <strong>
                                      Productos
                                    </strong>

                                    <span>
                                      {
                                        composition.lines.length
                                      } modelos en la cotización
                                    </span>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={
                                      onBackToCatalog
                                    }
                                  >
                                    Editar selección
                                  </button>
                                </div>

                                <div className="hwa-quotation-table-head">
                                  <span>
                                    Producto
                                  </span>

                                  <span>
                                    Precio
                                  </span>

                                  <span>
                                    Cantidad
                                  </span>

                                  <span>
                                    Subtotal
                                  </span>

                                  <span aria-hidden="true" />
                                </div>

                                {
                                  composition.lines.map(
                                    (line) => {
                                      const atStockLimit =
                                        line.stockSnapshot !==
                                          null &&
                                        line.quantity >=
                                          line.stockSnapshot;

                                      return (
                                        <article
                                          key={
                                            line.productId
                                          }
                                          className="hwa-quotation-line"
                                        >
                                          <div className="hwa-quotation-product">
                                            <div className="hwa-quotation-image">
                                              <img
                                                src={
                                                  line.imageUrl ||
                                                  "/placeholder.svg"
                                                }
                                                alt={
                                                  line.title
                                                }
                                              />
                                            </div>

                                            <div>
                                              <small>
                                                ID {
                                                  line.productId
                                                }
                                              </small>

                                              <strong>
                                                {
                                                  line.title
                                                }
                                              </strong>

                                              <div className="hwa-quotation-product-meta">
                                                <span>
                                                  {
                                                    line.status
                                                  }
                                                </span>

                                                <span>
                                                  {
                                                    line.stockSnapshot ===
                                                    null
                                                      ? "Stock sin límite conocido"
                                                      : `Stock ${line.stockSnapshot}`
                                                  }
                                                </span>
                                              </div>
                                            </div>
                                          </div>

                                          <div className="hwa-quotation-price">
                                            {
                                              line.originalUnitPrice >
                                                line.unitPrice &&
                                              (
                                                <small>
                                                  S/ {
                                                    formatMoney(
                                                      line.originalUnitPrice,
                                                    )
                                                  }
                                                </small>
                                              )
                                            }

                                            <strong>
                                              S/ {
                                                formatMoney(
                                                  line.unitPrice,
                                                )
                                              }
                                            </strong>

                                            <span>
                                              c/u
                                            </span>
                                          </div>

                                          <div className="hwa-quotation-qty">
                                            <button
                                              type="button"
                                              onClick={() =>
                                                updateQuantity(
                                                  line.productId,
                                                  line.quantity -
                                                    1,
                                                )
                                              }
                                              disabled={
                                                line.quantity <=
                                                1
                                              }
                                              aria-label={`Disminuir cantidad de ${line.title}`}
                                            >
                                              <Minus
                                                size={14}
                                                aria-hidden="true"
                                              />
                                            </button>

                                            <input
                                              type="number"
                                              min={1}
                                              max={
                                                line.stockSnapshot ??
                                                undefined
                                              }
                                              value={
                                                line.quantity
                                              }
                                              onChange={
                                                (event) => {
                                                  const next =
                                                    Number.parseInt(
                                                      event.target.value,
                                                      10,
                                                    );

                                                  if (
                                                    Number.isNaN(
                                                      next,
                                                    )
                                                  ) {
                                                    return;
                                                  }

                                                  updateQuantity(
                                                    line.productId,
                                                    next,
                                                  );
                                                }
                                              }
                                              aria-label={`Cantidad de ${line.title}`}
                                            />

                                            <button
                                              type="button"
                                              onClick={() =>
                                                updateQuantity(
                                                  line.productId,
                                                  line.quantity +
                                                    1,
                                                )
                                              }
                                              disabled={
                                                atStockLimit
                                              }
                                              aria-label={`Aumentar cantidad de ${line.title}`}
                                            >
                                              <Plus
                                                size={14}
                                                aria-hidden="true"
                                              />
                                            </button>
                                          </div>

                                          <strong className="hwa-quotation-subtotal">
                                            S/ {
                                              formatMoney(
                                                line.subtotal,
                                              )
                                            }
                                          </strong>

                                          <button
                                            type="button"
                                            className="hwa-quotation-remove"
                                            onClick={() =>
                                              removeLine(
                                                line.productId,
                                              )
                                            }
                                            aria-label={`Retirar ${line.title}`}
                                          >
                                            <Trash2
                                              size={15}
                                              aria-hidden="true"
                                            />
                                          </button>
                                        </article>
                                      );
                                    },
                                  )
                                }
                              </section>

                              <aside className="hwa-quotation-summary">
                                <p>
                                  Resumen comercial
                                </p>

                                <div className="hwa-quotation-summary-row">
                                  <span>
                                    Cliente
                                  </span>

                                  <strong className="hwa-quotation-summary-client">
                                    {
                                      commercialContext
                                        .customer
                                        .name
                                        .trim() ||
                                      "Pendiente"
                                    }
                                  </strong>
                                </div>

                                <div className="hwa-quotation-summary-row">
                                  <span>
                                    Productos
                                  </span>

                                  <strong>
                                    {
                                      summary?.products ??
                                      0
                                    }
                                  </strong>
                                </div>

                                <div className="hwa-quotation-summary-row">
                                  <span>
                                    Unidades
                                  </span>

                                  <strong>
                                    {
                                      summary?.units ??
                                      0
                                    }
                                  </strong>
                                </div>

                                {
                                  (
                                    summary?.savings ??
                                    0
                                  ) > 0 &&
                                  (
                                    <div className="hwa-quotation-summary-row hwa-quotation-summary-saving">
                                      <span>
                                        Ahorro por ofertas
                                      </span>

                                      <strong>
                                        S/ {
                                          formatMoney(
                                            summary?.savings ??
                                            0,
                                          )
                                        }
                                      </strong>
                                    </div>
                                  )
                                }

                                <div className="hwa-quotation-summary-total">
                                  <span>
                                    Total
                                  </span>

                                  <strong>
                                    <small>
                                      S/
                                    </small>

                                    {
                                      formatMoney(
                                        summary?.total ??
                                        0,
                                      )
                                    }
                                  </strong>
                                </div>

                                <div
                                  className={[
                                    "hwa-quotation-readiness",
                                    ready
                                      ? "hwa-quotation-readiness-ready"
                                      : "",
                                  ].join(" ")}
                                >
                                  <span />

                                  <div>
                                    <strong>
                                      {
                                        ready
                                          ? "Cotización preparada"
                                          : "Cotización incompleta"
                                      }
                                    </strong>

                                    <small>
                                      {
                                        ready
                                          ? "Cliente y composición completos."
                                          : "Completa cliente y productos para continuar."
                                      }
                                    </small>
                                  </div>
                                </div>
                              </aside>
                            </div>
                          )
                    }
                  </>
                )
      }

      <span className="hwa-quotation-products-loaded">
        {
          products.length
        } productos disponibles en la fuente
      </span>
    </section>
  );
}