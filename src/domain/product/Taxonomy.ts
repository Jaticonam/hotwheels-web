export const HOT_WHEELS_CATEGORY_IDS = [
  "mainline",
  "silver-series",
  "premium",
  "collector",
] as const;

export type HotWheelsCategoryId =
  (typeof HOT_WHEELS_CATEGORY_IDS)[number];

export const HOT_WHEELS_FORMAT_IDS = [
  "single",
  "2-pack",
  "3-pack",
  "5-pack",
  "6-pack",
  "multipack",
  "team-transport",
  "display-set",
  "case",
] as const;

export type HotWheelsFormatId =
  (typeof HOT_WHEELS_FORMAT_IDS)[number];

export const HOT_WHEELS_RARITY_IDS = [
  "regular",
  "treasure-hunt",
  "super-treasure-hunt",
  "chase",
] as const;

export type HotWheelsRarityId =
  (typeof HOT_WHEELS_RARITY_IDS)[number];

/**
 * Clasificación canónica de un collectible Hot Wheels.
 *
 * No contiene estados comerciales como oferta, stock o precio.
 * Tampoco contiene estados de usuario como garaje, wishlist,
 * intercambio o publicación en marketplace.
 */
export interface HotWheelsTaxonomy {
  category: HotWheelsCategoryId;

  series?: string;
  collection?: string;

  format: HotWheelsFormatId;
  rarity?: HotWheelsRarityId;

  manufacturer?: string;
  franchise?: string;
  style?: string;
}

export function isHotWheelsCategoryId(
  value: string,
): value is HotWheelsCategoryId {
  return (
    HOT_WHEELS_CATEGORY_IDS as readonly string[]
  ).includes(value);
}

export function isHotWheelsFormatId(
  value: string,
): value is HotWheelsFormatId {
  return (
    HOT_WHEELS_FORMAT_IDS as readonly string[]
  ).includes(value);
}

export function isHotWheelsRarityId(
  value: string,
): value is HotWheelsRarityId {
  return (
    HOT_WHEELS_RARITY_IDS as readonly string[]
  ).includes(value);
}
