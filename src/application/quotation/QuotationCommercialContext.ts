export interface QuotationCustomer {
  name: string;
  whatsapp: string;
  document: string;
}

export interface QuotationCommercialTerms {
  issuedOn: string;
  validUntil: string;
  notes: string;
}

export interface QuotationCommercialContext {
  schemaVersion: 1;

  customer:
    QuotationCustomer;

  terms:
    QuotationCommercialTerms;
}

function normalizeText(
  value: string,
): string {
  return value.trim();
}

function isDateOnly(
  value: string,
): boolean {
  const clean =
    value.trim();

  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(
      clean,
    )
  ) {
    return false;
  }

  const parts =
    clean
      .split("-")
      .map(Number);

  const year =
    parts[0];

  const month =
    parts[1];

  const day =
    parts[2];

  const date =
    new Date(
      Date.UTC(
        year,
        month - 1,
        day,
      ),
    );

  return (
    date.getUTCFullYear() ===
      year &&
    date.getUTCMonth() ===
      month - 1 &&
    date.getUTCDate() ===
      day
  );
}

export function createQuotationCommercialContext(
  issuedOn: string,
): QuotationCommercialContext {
  return {
    schemaVersion: 1,

    customer: {
      name: "",
      whatsapp: "",
      document: "",
    },

    terms: {
      issuedOn:
        issuedOn.trim(),

      validUntil: "",

      notes: "",
    },
  };
}

export function updateQuotationCustomer(
  context:
    QuotationCommercialContext,
  patch:
    Partial<QuotationCustomer>,
): QuotationCommercialContext {
  return {
    ...context,

    customer: {
      ...context.customer,
      ...patch,
    },
  };
}

export function updateQuotationCommercialTerms(
  context:
    QuotationCommercialContext,
  patch:
    Partial<QuotationCommercialTerms>,
): QuotationCommercialContext {
  return {
    ...context,

    terms: {
      ...context.terms,
      ...patch,
    },
  };
}

export function normalizeQuotationCommercialContext(
  context:
    QuotationCommercialContext,
): QuotationCommercialContext {
  return {
    schemaVersion: 1,

    customer: {
      name:
        normalizeText(
          context.customer.name,
        ),

      whatsapp:
        normalizeText(
          context.customer.whatsapp,
        ),

      document:
        normalizeText(
          context.customer.document,
        ),
    },

    terms: {
      issuedOn:
        normalizeText(
          context.terms.issuedOn,
        ),

      validUntil:
        normalizeText(
          context.terms.validUntil,
        ),

      notes:
        context.terms.notes.trim(),
    },
  };
}

export function isQuotationCommercialContextReady(
  context:
    QuotationCommercialContext,
): boolean {
  const normalized =
    normalizeQuotationCommercialContext(
      context,
    );

  if (
    normalized.customer.name.length ===
    0
  ) {
    return false;
  }

  if (
    !isDateOnly(
      normalized.terms.issuedOn,
    )
  ) {
    return false;
  }

  if (
    normalized.terms.validUntil.length ===
    0
  ) {
    return true;
  }

  if (
    !isDateOnly(
      normalized.terms.validUntil,
    )
  ) {
    return false;
  }

  return (
    normalized.terms.validUntil >=
    normalized.terms.issuedOn
  );
}