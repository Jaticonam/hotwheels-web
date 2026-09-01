import type {
  QuotationDocumentPort,
} from "@/application/documents/QuotationDocumentPort";

export const unavailableQuotationDocumentPort:
QuotationDocumentPort = {
  status: {
    state:
      "unavailable",

    provider:
      "jung-core",

    message:
      "JUNG CORE Documents pendiente de integración",
  },

  async generate() {
    throw new Error(
      "JUNG CORE Documents todavía no está disponible.",
    );
  },
};