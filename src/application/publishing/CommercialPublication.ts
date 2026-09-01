export type PublicAssetKind =
  | "image"
  | "og-image"
  | "pdf";

export type PublicAssetStatus =
  | "ready"
  | "pending"
  | "unavailable";

export interface PublicAssetReference {
  assetId:
    string;

  kind:
    PublicAssetKind;

  status:
    PublicAssetStatus;

  /**
   * URL pública resuelta por la capa transversal
   * de publicación.
   *
   * La app no conoce proveedor físico, storage,
   * credenciales ni detalles de entrega.
   */
  url:
    string | null;

  mimeType:
    string;

  version:
    number;
}

export type CommercialPublicationStatus =
  | "ready"
  | "processing"
  | "partial"
  | "failed";

export interface CommercialPublicationResult {
  publicationId:
    string;

  version:
    number;

  status:
    CommercialPublicationStatus;

  /**
   * URL pública de la experiencia comercial.
   *
   * La resolución final pertenece a la capa
   * transversal de publicación.
   */
  publicUrl:
    string | null;

  /**
   * Asset visual Open Graph.
   *
   * Su producción y distribución pertenecen a
   * servicios transversales, no a la app.
   */
  ogImage:
    PublicAssetReference | null;

  publishedAt:
    string | null;
}

export function getReadyPublicAssetUrl(
  asset:
    PublicAssetReference | null | undefined,
): string | null {
  if (
    !asset ||
    asset.status !==
      "ready"
  ) {
    return null;
  }

  const url =
    asset.url?.trim();

  return url
    ? url
    : null;
}