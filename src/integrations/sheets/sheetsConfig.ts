export const SHEETS_CONFIG = {
  products: {
    docId: "141vkBWAieL-IY5vcxNdmV8qtX64YFda6AYRDTsoACYs",
    gid: "223977403",
  },
} as const;

export type SheetKey =
  keyof typeof SHEETS_CONFIG;

export type SheetSource =
  (typeof SHEETS_CONFIG)[SheetKey];