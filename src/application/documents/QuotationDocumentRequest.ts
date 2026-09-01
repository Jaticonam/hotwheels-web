import type {
  QuotationOutputSnapshot,
  QuotationPdfOutputRequest,
} from "@/application/quotation/QuotationOutput";

export interface QuotationDocumentRequest {
  schemaVersion: 1;

  tenantId:
    "hotwheels";

  documentType:
    "quotation";

  template: {
    id:
      "collectibles.quotation";

    version: 1;
  };

  locale:
    "es-PE";

  currency:
    "PEN";

  requestedAt:
    string;

  snapshot:
    QuotationOutputSnapshot;
}

function cloneQuotationOutputSnapshot(
  snapshot:
    QuotationOutputSnapshot,
): QuotationOutputSnapshot {
  return {
    schemaVersion: 1,

    quotationId:
      snapshot.quotationId,

    composition: {
      schemaVersion:
        snapshot.composition
          .schemaVersion,

      title:
        snapshot.composition
          .title,

      currency:
        snapshot.composition
          .currency,

      lines:
        snapshot.composition
          .lines
          .map(
            (line) => ({
              ...line,
            }),
          ),
    },

    commercialContext: {
      schemaVersion: 1,

      customer: {
        ...snapshot
          .commercialContext
          .customer,
      },

      terms: {
        ...snapshot
          .commercialContext
          .terms,
      },
    },

    summary: {
      ...snapshot.summary,
    },
  };
}

export function prepareQuotationDocumentRequest(
  output:
    QuotationPdfOutputRequest,
  requestedAt =
    new Date().toISOString(),
): QuotationDocumentRequest {
  return {
    schemaVersion: 1,

    tenantId:
      "hotwheels",

    documentType:
      "quotation",

    template: {
      id:
        "collectibles.quotation",

      version: 1,
    },

    locale:
      "es-PE",

    currency:
      output.snapshot
        .composition
        .currency,

    requestedAt:
      requestedAt.trim(),

    snapshot:
      cloneQuotationOutputSnapshot(
        output.snapshot,
      ),
  };
}