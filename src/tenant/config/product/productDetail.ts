export const PRODUCT_DETAIL_CONFIG = {
  empty: {
    title: "Producto no encontrado",
    backLabel: "Volver al catálogo",
  },

  header: {
    fallbackTitle: "Producto",
  },

  price: {
    label: "Precio",
    oldPricePrefix: "Antes S/",
    totalLabel: "Total",
  },

  quantity: {
    label: "Cantidad",
    invalidMessage:
      "Ingresa una cantidad válida para continuar",
  },

  actions: {
    addToCart: "Agregar al carrito",
    invalidQty: "Ingresa una cantidad",
    whatsappDefault: "Consultar por WhatsApp",
    whatsappPreorder: "Consultar por WhatsApp",
    whatsappSoldOut: "Consultar disponibilidad",
  },

  trust: {
    text:
      "Confirmamos disponibilidad antes de cerrar el pedido.",
  },

  description: {
    fallback:
      "Consulta los detalles y disponibilidad de este producto.",
  },

  notifications: {
    linkCopiedTitle: "Enlace copiado",
    linkCopiedDescription:
      "Comparte este producto",
    addedToCartTitle:
      "Agregado al carrito",
    addedToCartDescription:
      "El producto fue agregado al carrito.",
  },
} as const;