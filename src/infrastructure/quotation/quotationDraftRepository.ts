import {
  LocalQuotationDraftRepository,
} from "./LocalQuotationDraftRepository";

const browserStorage =
  typeof window !==
    "undefined"
    ? window.localStorage
    : null;

/**
 * Composition root temporal para Admin 1.1.
 *
 * El workspace depende del port
 * QuotationDraftRepository y no de localStorage.
 *
 * Cuando JUNG CORE esté disponible,
 * este binding puede reemplazarse sin modificar
 * el dominio de Cotizaciones.
 */
export const quotationDraftRepository =
  new LocalQuotationDraftRepository(
    browserStorage,
  );