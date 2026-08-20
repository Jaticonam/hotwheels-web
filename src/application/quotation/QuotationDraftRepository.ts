import type {
  QuotationDraft,
} from "./QuotationDraft";

export interface QuotationDraftRepository {
  list():
    QuotationDraft[];

  findById(
    id: string,
  ):
    QuotationDraft | null;

  save(
    draft:
      QuotationDraft,
  ):
    void;

  remove(
    id: string,
  ):
    void;
}