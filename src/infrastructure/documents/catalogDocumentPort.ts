import type {
  CatalogDocumentPort,
} from "@/application/documents/CatalogDocumentPort";

import {
  unavailableCatalogDocumentPort,
} from "./UnavailableCatalogDocumentPort";

/**
 * Composition root documental.
 *
 * HOY:
 *   unavailableCatalogDocumentPort
 *
 * FUTURO:
 *   jungCoreCatalogDocumentPort
 *
 * modules/admin no deberá cambiar cuando
 * llegue JUNG CORE.
 */
export const catalogDocumentPort:
CatalogDocumentPort =
  unavailableCatalogDocumentPort;
