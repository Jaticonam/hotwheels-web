import { WHATSAPP_NUMBER } from "@/tenant/config/checkout";
import { CATEGORIES } from "@/tenant/config/catalog";

import { CATALOG_CONFIG } from "@/tenant/config/catalog";
import { CHECKOUT_CONFIG } from "@/tenant/config/checkout";


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

  identity: {
    scale: "Escala 1:64",
  },

  contact: {
    whatsapp: WHATSAPP_NUMBER,
  },

  catalog: CATALOG_CONFIG,
  checkout: CHECKOUT_CONFIG,
  productCard: {
    whatsappDefault: "Hola, quiero consultar por este auto coleccionable",
    whatsappPreventa: "Hola, quiero consultar la preventa de este auto coleccionable",
    whatsappAvailability: "Hola, quiero confirmar la disponibilidad de este auto coleccionable",
    whatsappRestock: "Hola, quiero saber si este auto coleccionable volverá a estar disponible",
  },
  search: UI_CONFIG.search,
  floating: UI_CONFIG.floating,
  activity: ACTIVITY_CONFIG,
  categories: CATEGORIES,
} as const;
