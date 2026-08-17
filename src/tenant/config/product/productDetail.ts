export const PRODUCT_DETAIL_CONFIG = {
  empty: {
    title:
      "Producto no encontrado",
    backLabel:
      "Volver al catálogo",
  },

  header: {
    fallbackTitle:
      "Producto",
  },

  price: {
    label:
      "Precio unitario",
    oldPricePrefix:
      "Antes S/",
    totalLabel:
      "Total",
  },

  quantity: {
    label:
      "Cantidad",
    invalidMessage:
      "Ingresa una cantidad válida para continuar",
  },

  actions: {
    addToCart:
      "Agregar a Mi Box",
    invalidQty:
      "Ingresa una cantidad",
    whatsappDefault:
      "Consultar por WhatsApp",
    whatsappPreorder:
      "Consultar por WhatsApp",
    whatsappSoldOut:
      "Consultar disponibilidad",
  },

  trust: {
    text:
      "Confirmamos stock y disponibilidad antes de cerrar el pedido.",
  },

  description: {
    fallback:
      "Consulta la información y disponibilidad de este modelo.",
  },

  notifications: {
    linkCopiedTitle:
      "Enlace copiado",
    linkCopiedDescription:
      "Comparte este producto",
    addedToCartTitle:
      "Agregado a Mi Box",
    addedToCartDescription:
      "El producto fue agregado a Mi Box.",
    stockLimitTitle:
      "Stock máximo alcanzado",
    stockLimitDescription:
      "Ya tienes en Mi Box todas las unidades disponibles.",
  },
} as const;