import type {
  CatalogDocumentPort,
} from "@/application/documents/CatalogDocumentPort";

/**
 * Provider vigente mientras JUNG CORE
 * todavía no haya sido incorporado.
 *
 * No simula generación.
 * No crea archivos.
 * No devuelve resultados falsos.
 */
export const unavailableCatalogDocumentPort:
CatalogDocumentPort = {
  status: {
    state:
      "unavailable",

    provider:
      "jung-core",

    message:
      "JUNG CORE pendiente de integración",
  },

  async generate() {
    throw new Error(
      "JUNG CORE Documents todavía no está disponible.",
    );
  },
};
