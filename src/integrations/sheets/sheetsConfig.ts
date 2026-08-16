export const SHEETS_CONFIG = {
  products: {
    docId: "1tUmp1X1LXVk_qbvwonAZEuBcaWCWJUxHrASU7MR5DL4",
    gid: "1632634680",
  },
} as const;

export type SheetKey =
  keyof typeof SHEETS_CONFIG;

export type SheetSource =
  (typeof SHEETS_CONFIG)[SheetKey];