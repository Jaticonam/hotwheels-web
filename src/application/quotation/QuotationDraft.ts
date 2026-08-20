import {
  isQuotationCompositionReady,
  type QuotationComposition,
} from "./QuotationComposition";

import {
  isQuotationCommercialContextReady,
  normalizeQuotationCommercialContext,
  type QuotationCommercialContext,
} from "./QuotationCommercialContext";

export type QuotationDraftStatus =
  "draft";

export interface QuotationDraft {
  schemaVersion: 1;

  id:
    string;

  status:
    QuotationDraftStatus;

  createdAt:
    string;

  updatedAt:
    string;

  composition:
    QuotationComposition;

  commercialContext:
    QuotationCommercialContext;
}

export interface CreateQuotationDraftInput {
  id:
    string;

  now:
    string;

  composition:
    QuotationComposition;

  commercialContext:
    QuotationCommercialContext;
}

export interface UpdateQuotationDraftInput {
  now:
    string;

  composition:
    QuotationComposition;

  commercialContext:
    QuotationCommercialContext;
}

function normalizeRequiredText(
  value: string,
  field: string,
): string {
  const clean =
    value.trim();

  if (!clean) {
    throw new Error(
      `${field} es obligatorio.`,
    );
  }

  return clean;
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

function cloneCommercialContext(
  context:
    QuotationCommercialContext,
): QuotationCommercialContext {
  const normalized =
    normalizeQuotationCommercialContext(
      context,
    );

  return {
    schemaVersion: 1,

    customer: {
      ...normalized.customer,
    },

    terms: {
      ...normalized.terms,
    },
  };
}

export function createQuotationDraft(
  input:
    CreateQuotationDraftInput,
): QuotationDraft {
  const id =
    normalizeRequiredText(
      input.id,
      "QuotationDraft.id",
    );

  const now =
    normalizeRequiredText(
      input.now,
      "QuotationDraft.now",
    );

  return {
    schemaVersion: 1,

    id,

    status:
      "draft",

    createdAt:
      now,

    updatedAt:
      now,

    composition:
      cloneComposition(
        input.composition,
      ),

    commercialContext:
      cloneCommercialContext(
        input.commercialContext,
      ),
  };
}

export function updateQuotationDraft(
  draft:
    QuotationDraft,
  input:
    UpdateQuotationDraftInput,
): QuotationDraft {
  const now =
    normalizeRequiredText(
      input.now,
      "QuotationDraft.now",
    );

  return {
    schemaVersion: 1,

    id:
      draft.id,

    status:
      "draft",

    createdAt:
      draft.createdAt,

    updatedAt:
      now,

    composition:
      cloneComposition(
        input.composition,
      ),

    commercialContext:
      cloneCommercialContext(
        input.commercialContext,
      ),
  };
}

export function isQuotationDraftReady(
  draft:
    QuotationDraft,
): boolean {
  return (
    isQuotationCompositionReady(
      draft.composition,
    ) &&
    isQuotationCommercialContextReady(
      draft.commercialContext,
    )
  );
}