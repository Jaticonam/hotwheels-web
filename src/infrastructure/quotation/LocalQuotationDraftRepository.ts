import type {
  QuotationDraft,
} from "@/application/quotation/QuotationDraft";

import type {
  QuotationDraftRepository,
} from "@/application/quotation/QuotationDraftRepository";

export const QUOTATION_DRAFT_STORAGE_KEY =
  "hwa:admin:quotation-drafts:v1";

interface QuotationDraftStorageEnvelope {
  schemaVersion: 1;

  drafts:
    QuotationDraft[];
}

export interface QuotationDraftStorage {
  getItem(
    key: string,
  ):
    string | null;

  setItem(
    key: string,
    value: string,
  ):
    void;

  removeItem(
    key: string,
  ):
    void;
}

function isQuotationDraft(
  value: unknown,
): value is QuotationDraft {
  if (
    !value ||
    typeof value !==
      "object"
  ) {
    return false;
  }

  const candidate =
    value as
      Partial<QuotationDraft>;

  return (
    candidate.schemaVersion ===
      1 &&
    typeof candidate.id ===
      "string" &&
    candidate.status ===
      "draft" &&
    typeof candidate.createdAt ===
      "string" &&
    typeof candidate.updatedAt ===
      "string" &&
    !!candidate.composition &&
    !!candidate.commercialContext
  );
}

export class LocalQuotationDraftRepository
implements QuotationDraftRepository {
  constructor(
    private readonly storage:
      QuotationDraftStorage | null,
  ) {}

  private readEnvelope():
  QuotationDraftStorageEnvelope {
    if (!this.storage) {
      return {
        schemaVersion: 1,
        drafts: [],
      };
    }

    const raw =
      this.storage.getItem(
        QUOTATION_DRAFT_STORAGE_KEY,
      );

    if (!raw) {
      return {
        schemaVersion: 1,
        drafts: [],
      };
    }

    try {
      const parsed:
        unknown =
          JSON.parse(raw);

      if (
        !parsed ||
        typeof parsed !==
          "object"
      ) {
        return {
          schemaVersion: 1,
          drafts: [],
        };
      }

      const envelope =
        parsed as {
          schemaVersion?: unknown;
          drafts?: unknown;
        };

      if (
        envelope.schemaVersion !==
          1 ||
        !Array.isArray(
          envelope.drafts,
        )
      ) {
        return {
          schemaVersion: 1,
          drafts: [],
        };
      }

      return {
        schemaVersion: 1,

        drafts:
          envelope.drafts.filter(
            isQuotationDraft,
          ),
      };
    }
    catch {
      return {
        schemaVersion: 1,
        drafts: [],
      };
    }
  }

  private write(
    drafts:
      QuotationDraft[],
  ):
  void {
    if (!this.storage) {
      return;
    }

    const envelope:
      QuotationDraftStorageEnvelope =
        {
          schemaVersion: 1,
          drafts,
        };

    this.storage.setItem(
      QUOTATION_DRAFT_STORAGE_KEY,
      JSON.stringify(
        envelope,
      ),
    );
  }

  list():
  QuotationDraft[] {
    return [
      ...this.readEnvelope()
        .drafts,
    ].sort(
      (
        left,
        right,
      ) =>
        right.updatedAt.localeCompare(
          left.updatedAt,
        ),
    );
  }

  findById(
    id: string,
  ):
  QuotationDraft | null {
    const cleanId =
      id.trim();

    if (!cleanId) {
      return null;
    }

    return (
      this.readEnvelope()
        .drafts
        .find(
          (draft) =>
            draft.id ===
            cleanId,
        ) ??
      null
    );
  }

  save(
    draft:
      QuotationDraft,
  ):
  void {
    const current =
      this.readEnvelope()
        .drafts;

    const next = [
      draft,

      ...current.filter(
        (item) =>
          item.id !==
          draft.id,
      ),
    ];

    this.write(
      next,
    );
  }

  remove(
    id: string,
  ):
  void {
    const cleanId =
      id.trim();

    if (!cleanId) {
      return;
    }

    const current =
      this.readEnvelope()
        .drafts;

    const next =
      current.filter(
        (draft) =>
          draft.id !==
          cleanId,
      );

    if (
      next.length ===
      current.length
    ) {
      return;
    }

    if (
      next.length ===
      0
    ) {
      this.storage?.removeItem(
        QUOTATION_DRAFT_STORAGE_KEY,
      );

      return;
    }

    this.write(
      next,
    );
  }
}