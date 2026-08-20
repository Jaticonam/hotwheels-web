import {
  describe,
  expect,
  it,
} from "vitest";

import {
  createQuotationDraft,
  type QuotationDraft,
} from "@/application/quotation/QuotationDraft";

import {
  LocalQuotationDraftRepository,
  QUOTATION_DRAFT_STORAGE_KEY,
  type QuotationDraftStorage,
} from "./LocalQuotationDraftRepository";

class MemoryStorage
implements QuotationDraftStorage {
  private values =
    new Map<
      string,
      string
    >();

  getItem(
    key: string,
  ):
  string | null {
    return (
      this.values.get(
        key,
      ) ??
      null
    );
  }

  setItem(
    key: string,
    value: string,
  ):
  void {
    this.values.set(
      key,
      value,
    );
  }

  removeItem(
    key: string,
  ):
  void {
    this.values.delete(
      key,
    );
  }
}

function draft(
  id: string,
  updatedAt: string,
): QuotationDraft {
  return createQuotationDraft({
    id,

    now:
      updatedAt,

    composition: {
      schemaVersion: 1,

      title:
        `Cotización ${id}`,

      currency:
        "PEN",

      lines: [
        {
          productId:
            "HWC001",

          title:
            "Auto prueba",

          imageUrl:
            "",

          status:
            "Publicado",

          stockSnapshot:
            5,

          quantity:
            1,

          unitPrice:
            20,

          originalUnitPrice:
            20,

          subtotal:
            20,
        },
      ],
    },

    commercialContext: {
      schemaVersion: 1,

      customer: {
        name:
          "Cliente",

        whatsapp:
          "",

        document:
          "",
      },

      terms: {
        issuedOn:
          "2026-08-19",

        validUntil:
          "",

        notes:
          "",
      },
    },
  });
}

describe(
  "LocalQuotationDraftRepository",
  () => {
    it(
      "guarda y recupera borradores",
      () => {
        const storage =
          new MemoryStorage();

        const repository =
          new LocalQuotationDraftRepository(
            storage,
          );

        repository.save(
          draft(
            "Q-001",
            "2026-08-19T22:00:00-05:00",
          ),
        );

        expect(
          repository.findById(
            "Q-001",
          )?.id,
        ).toBe(
          "Q-001",
        );

        expect(
          repository.list(),
        ).toHaveLength(
          1,
        );
      },
    );

    it(
      "actualiza por id sin duplicar",
      () => {
        const storage =
          new MemoryStorage();

        const repository =
          new LocalQuotationDraftRepository(
            storage,
          );

        repository.save(
          draft(
            "Q-001",
            "2026-08-19T22:00:00-05:00",
          ),
        );

        repository.save(
          draft(
            "Q-001",
            "2026-08-19T23:00:00-05:00",
          ),
        );

        expect(
          repository.list(),
        ).toHaveLength(
          1,
        );

        expect(
          repository.findById(
            "Q-001",
          )?.updatedAt,
        ).toBe(
          "2026-08-19T23:00:00-05:00",
        );
      },
    );

    it(
      "ordena por actualización más reciente",
      () => {
        const storage =
          new MemoryStorage();

        const repository =
          new LocalQuotationDraftRepository(
            storage,
          );

        repository.save(
          draft(
            "OLD",
            "2026-08-19T20:00:00-05:00",
          ),
        );

        repository.save(
          draft(
            "NEW",
            "2026-08-19T22:00:00-05:00",
          ),
        );

        expect(
          repository
            .list()
            .map(
              (item) =>
                item.id,
            ),
        ).toEqual([
          "NEW",
          "OLD",
        ]);
      },
    );

    it(
      "elimina borradores y limpia storage cuando queda vacío",
      () => {
        const storage =
          new MemoryStorage();

        const repository =
          new LocalQuotationDraftRepository(
            storage,
          );

        repository.save(
          draft(
            "Q-001",
            "2026-08-19T22:00:00-05:00",
          ),
        );

        repository.remove(
          "Q-001",
        );

        expect(
          repository.list(),
        ).toEqual([]);

        expect(
          storage.getItem(
            QUOTATION_DRAFT_STORAGE_KEY,
          ),
        ).toBeNull();
      },
    );

    it(
      "tolera contenido corrupto",
      () => {
        const storage =
          new MemoryStorage();

        storage.setItem(
          QUOTATION_DRAFT_STORAGE_KEY,
          "{corrupt",
        );

        const repository =
          new LocalQuotationDraftRepository(
            storage,
          );

        expect(
          repository.list(),
        ).toEqual([]);
      },
    );
  },
);