import type {
  QuotationDocumentPort,
} from "@/application/documents/QuotationDocumentPort";

import {
  unavailableQuotationDocumentPort,
} from "./UnavailableQuotationDocumentPort";

export const quotationDocumentPort:
QuotationDocumentPort =
  unavailableQuotationDocumentPort;