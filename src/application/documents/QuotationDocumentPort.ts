import type {
  QuotationDocumentRequest,
} from "@/application/documents/QuotationDocumentRequest";

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

export interface QuotationDocumentResult {
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

export interface QuotationDocumentPort {
  readonly status:
    QuotationDocumentProviderStatus;

  generate(
    request:
      QuotationDocumentRequest,
  ): Promise<QuotationDocumentResult>;
}