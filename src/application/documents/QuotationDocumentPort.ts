import type {
  QuotationDocumentRequest,
} from "@/application/documents/QuotationDocumentRequest";

import type {
  CommercialPublicationResult,
  PublicAssetReference,
} from "@/application/publishing/CommercialPublication";

export type QuotationDocumentProviderState =
  | "ready"
  | "unavailable";

export interface QuotationDocumentProviderStatus {
  state:
    QuotationDocumentProviderState;

  provider:
    "jung-core";

  message:
    string;
}

/**
 * Resultado neutral consumido por Hot Wheels.
 *
 * El adapter futuro podrá resolver estos datos
 * mediante JUNG CORE Commercial Publishing.
 *
 * Hot Wheels no conoce el proveedor físico de
 * almacenamiento o distribución.
 */
export interface QuotationDocumentResult
  extends CommercialPublicationResult {
  documentId:
    string;

  pdf:
    PublicAssetReference;

  generatedAt:
    string;
}

export interface QuotationDocumentPort {
  readonly status:
    QuotationDocumentProviderStatus;

  generate(
    request:
      QuotationDocumentRequest,
  ): Promise<QuotationDocumentResult>;
}