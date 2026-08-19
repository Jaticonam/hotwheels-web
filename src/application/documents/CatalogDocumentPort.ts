import type {
  CatalogDocumentRequest,
} from "@/application/documents/CatalogDocumentRequest";

export type CatalogDocumentProviderState =
  | "ready"
  | "unavailable";

export interface CatalogDocumentProviderStatus {
  state:
    CatalogDocumentProviderState;

  provider:
    "jung-core";

  message:
    string;
}

export interface CatalogDocumentResult {
  documentId:
    string;

  assetId:
    string;

  url:
    string;

  version:
    number;

  generatedAt:
    string;
}

/**
 * Puerto definitivo de generación documental.
 *
 * Hot Wheels no conoce:
 * - HTTP
 * - NestJS
 * - Prisma
 * - storage
 * - filesystem
 * - proveedor cloud
 *
 * JUNG CORE implementará este contrato
 * mediante un adapter de infraestructura.
 */
export interface CatalogDocumentPort {
  readonly status:
    CatalogDocumentProviderStatus;

  generate(
    request:
      CatalogDocumentRequest,
  ): Promise<CatalogDocumentResult>;
}
