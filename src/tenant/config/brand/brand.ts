import { WHATSAPP_NUMBER } from "@/tenant/config/checkout";
import { CATEGORIES } from "@/tenant/config/catalog";

import { CATALOG_CONFIG } from "@/tenant/config/catalog";
import { CHECKOUT_CONFIG } from "@/tenant/config/checkout";
import { CART_CONFIG } from "@/tenant/config/checkout";

import { ASSETS_CONFIG } from "@/tenant/assets/assets";

import { UI_CONFIG } from "@/tenant/theme/ui";
import { ACTIVITY_CONFIG } from "@/tenant/config/activity";

/**
 * Configuración principal de marca.
 * Este archivo actúa como agregador central para que los componentes
 * consuman una sola fuente: BRAND_CONFIG.
 */
export const BRAND_CONFIG = {
  slug: "hotwheels",
  name: "Coleccionables",

  contact: {
    whatsapp: WHATSAPP_NUMBER,
  },

  catalog: CATALOG_CONFIG,
  checkout: CHECKOUT_CONFIG,
  cart: CART_CONFIG,
  productCard: {
    whatsappDefault: "Hola, quiero consultar por este auto coleccionable",
    whatsappPreventa: "Hola, quiero consultar la preventa de este auto coleccionable",
    whatsappRestock: "Hola, quiero saber si este auto coleccionable volverá a estar disponible",
  },
  assets: ASSETS_CONFIG,
  search: UI_CONFIG.search,
  floating: UI_CONFIG.floating,
  activity: ACTIVITY_CONFIG,
  categories: CATEGORIES,
} as const;



