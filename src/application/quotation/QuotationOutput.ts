import {
  calculateQuotationSummary,
  isQuotationCompositionReady,
  type QuotationComposition,
  type QuotationSummary,
} from "./QuotationComposition";

import {
  isQuotationCommercialContextReady,
  normalizeQuotationCommercialContext,
  type QuotationCommercialContext,
} from "./QuotationCommercialContext";

export type QuotationOutputKind =
  | "whatsapp"
  | "pdf"
  | "cart"
  | "share-link";

export type QuotationOutputState =
  | "ready"
  | "blocked"
  | "unavailable";

export type QuotationOutputReason =
  | "composition-not-ready"
  | "commercial-context-not-ready"
  | "customer-whatsapp-missing"
  | "requires-core";

export type QuotationCartPricingPolicy =
  "quotation-snapshot";

export interface QuotationOutputSnapshot {
  schemaVersion: 1;

  quotationId:
    string | null;

  composition:
    QuotationComposition;

  commercialContext:
    QuotationCommercialContext;

  summary:
    QuotationSummary;
}

export interface QuotationOutputCapability {
  kind:
    QuotationOutputKind;

  state:
    QuotationOutputState;

  reasons:
    QuotationOutputReason[];
}

export interface QuotationOutputCapabilities {
  whatsapp:
    QuotationOutputCapability;

  pdf:
    QuotationOutputCapability;

  cart:
    QuotationOutputCapability;

  "share-link":
    QuotationOutputCapability;
}

export interface QuotationOutputPlan {
  schemaVersion: 1;

  snapshot:
    QuotationOutputSnapshot;

  capabilities:
    QuotationOutputCapabilities;
}

export interface QuotationWhatsAppOutputRequest {
  kind: "whatsapp";

  snapshot:
    QuotationOutputSnapshot;
}

export interface QuotationPdfOutputRequest {
  kind: "pdf";

  snapshot:
    QuotationOutputSnapshot;
}

export interface QuotationCartOutputRequest {
  kind: "cart";

  pricingPolicy:
    QuotationCartPricingPolicy;

  snapshot:
    QuotationOutputSnapshot;
}

export type QuotationOutputRequest =
  | QuotationWhatsAppOutputRequest
  | QuotationPdfOutputRequest
  | QuotationCartOutputRequest;

export interface CreateQuotationOutputPlanInput {
  quotationId?:
    string | null;

  composition:
    QuotationComposition;

  commercialContext:
    QuotationCommercialContext;
}

function normalizeOptionalId(
  value:
    string | null | undefined,
): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized =
    value.trim();

  return normalized.length > 0
    ? normalized
    : null;
}

function cloneComposition(
  composition:
    QuotationComposition,
): QuotationComposition {
  return {
    schemaVersion: 1,

    title:
      composition.title,

    currency:
      composition.currency,

    lines:
      composition.lines.map(
        (line) => ({
          ...line,
        }),
      ),
  };
}

function createCapability(
  kind:
    QuotationOutputKind,
  state:
    QuotationOutputState,
  reasons:
    QuotationOutputReason[] = [],
): QuotationOutputCapability {
  return {
    kind,
    state,
    reasons:
      [...reasons],
  };
}

function createBlockedCapability(
  kind:
    QuotationOutputKind,
  reasons:
    QuotationOutputReason[],
): QuotationOutputCapability {
  return createCapability(
    kind,
    reasons.length > 0
      ? "blocked"
      : "ready",
    reasons,
  );
}

export function createQuotationOutputPlan(
  input:
    CreateQuotationOutputPlanInput,
): QuotationOutputPlan {
  const composition =
    cloneComposition(
      input.composition,
    );

  const commercialContext =
    normalizeQuotationCommercialContext(
      input.commercialContext,
    );

  const compositionReady =
    isQuotationCompositionReady(
      composition,
    );

  const commercialReady =
    isQuotationCommercialContextReady(
      commercialContext,
    );

  const hasCustomerWhatsApp =
    commercialContext.customer.whatsapp
      .trim()
      .length > 0;

  const whatsappReasons:
    QuotationOutputReason[] = [];

  if (!compositionReady) {
    whatsappReasons.push(
      "composition-not-ready",
    );
  }

  if (!commercialReady) {
    whatsappReasons.push(
      "commercial-context-not-ready",
    );
  }

  if (!hasCustomerWhatsApp) {
    whatsappReasons.push(
      "customer-whatsapp-missing",
    );
  }

  const pdfReasons:
    QuotationOutputReason[] = [];

  if (!compositionReady) {
    pdfReasons.push(
      "composition-not-ready",
    );
  }

  if (!commercialReady) {
    pdfReasons.push(
      "commercial-context-not-ready",
    );
  }

  const cartReasons:
    QuotationOutputReason[] = [];

  if (!compositionReady) {
    cartReasons.push(
      "composition-not-ready",
    );
  }

  const snapshot:
    QuotationOutputSnapshot = {
      schemaVersion: 1,

      quotationId:
        normalizeOptionalId(
          input.quotationId,
        ),

      composition,

      commercialContext,

      summary:
        calculateQuotationSummary(
          composition,
        ),
    };

  return {
    schemaVersion: 1,

    snapshot,

    capabilities: {
      whatsapp:
        createBlockedCapability(
          "whatsapp",
          whatsappReasons,
        ),

      pdf:
        createBlockedCapability(
          "pdf",
          pdfReasons,
        ),

      cart:
        createBlockedCapability(
          "cart",
          cartReasons,
        ),

      "share-link":
        createCapability(
          "share-link",
          "unavailable",
          [
            "requires-core",
          ],
        ),
    },
  };
}

export function createQuotationOutputRequest(
  plan:
    QuotationOutputPlan,
  kind:
    "whatsapp",
):
  QuotationWhatsAppOutputRequest | null;

export function createQuotationOutputRequest(
  plan:
    QuotationOutputPlan,
  kind:
    "pdf",
):
  QuotationPdfOutputRequest | null;

export function createQuotationOutputRequest(
  plan:
    QuotationOutputPlan,
  kind:
    "cart",
):
  QuotationCartOutputRequest | null;

export function createQuotationOutputRequest(
  plan:
    QuotationOutputPlan,
  kind:
    "share-link",
):
  null;

export function createQuotationOutputRequest(
  plan:
    QuotationOutputPlan,
  kind:
    QuotationOutputKind,
):
  QuotationOutputRequest | null {
  const capability =
    plan.capabilities[kind];

  if (
    capability.state !==
    "ready"
  ) {
    return null;
  }

  switch (kind) {
    case "whatsapp":
      return {
        kind:
          "whatsapp",

        snapshot:
          plan.snapshot,
      };

    case "pdf":
      return {
        kind:
          "pdf",

        snapshot:
          plan.snapshot,
      };

    case "cart":
      return {
        kind:
          "cart",

        pricingPolicy:
          "quotation-snapshot",

        snapshot:
          plan.snapshot,
      };

    case "share-link":
      return null;
  }
}