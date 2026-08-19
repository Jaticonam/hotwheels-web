import type {
  CatalogComposition,
} from "@/application/catalog/CatalogComposition";

import {
  resolveCatalogPreview,
} from "@/application/catalog/CatalogPreview";

import type {
  Product,
} from "@/shared/types/product";

import {
  getCategoryName,
} from "@/tenant/config/catalog";

export interface CatalogDocumentProductSnapshot {
  id:
    string;

  title:
    string;

  description:
    string;

  categoryId:
    string;

  categoryLabel:
    string;

  price:
    number;

  offerPrice:
    number | null;

  status:
    string;

  imageUrl:
    string;

  year:
    number | null;

  caseCode:
    string;

  cardNumber:
    string;

  miniSeries:
    string;
}

export interface CatalogDocumentPage {
  number:
    number;

  products:
    CatalogDocumentProductSnapshot[];
}

export interface CatalogDocumentRequest {
  schemaVersion: 1;

  tenantId:
    "hotwheels";

  documentType:
    "catalog";

  template: {
    id:
      "collectibles.catalog";

    version: 1;
  };

  locale:
    "es-PE";

  currency:
    "PEN";

  requestedAt:
    string;

  identity: {
    eyebrow:
      "COLECCIONABLES 1:64";

    subtitle:
      "Catálogo comercial";
  };

  composition: {
    schemaVersion: 1;

    mode:
      CatalogComposition["mode"];

    title:
      string;

    categoryIds:
      string[];

    productIds:
      string[];
  };

  content: {
    pageSize: 6;

    totalProducts:
      number;

    pages:
      CatalogDocumentPage[];
  };
}

export interface CatalogDocumentPreparation {
  request:
    CatalogDocumentRequest | null;

  missingProductIds:
    string[];
}

function productSnapshot(
  product: Product,
): CatalogDocumentProductSnapshot {
  return {
    id:
      product.id,

    title:
      product.title,

    description:
      product.description,

    categoryId:
      product.category,

    categoryLabel:
      getCategoryName(
        product.category,
      ),

    price:
      product.price,

    offerPrice:
      product.offer_price,

    status:
      product.status,

    imageUrl:
      product.img,

    year:
      product.year ?? null,

    caseCode:
      product.case_code ?? "",

    cardNumber:
      product.card_number ?? "",

    miniSeries:
      product.mini_series ?? "",
  };
}

/**
 * Prepara el payload completo que Hot Wheels
 * enviará al motor Documents de JUNG CORE.
 *
 * El payload congela un snapshot documental:
 * cambios posteriores en Sheets/CORE no deben
 * alterar retrospectivamente un documento generado.
 */
export function prepareCatalogDocumentRequest(
  composition:
    CatalogComposition,
  sourceProducts:
    readonly Product[],
  requestedAt =
    new Date().toISOString(),
): CatalogDocumentPreparation {
  const preview =
    resolveCatalogPreview(
      composition,
      sourceProducts,
      6,
    );

  if (
    preview.missingProductIds.length >
      0 ||
    preview.products.length === 0
  ) {
    return {
      request:
        null,

      missingProductIds:
        preview.missingProductIds,
    };
  }

  return {
    request: {
      schemaVersion: 1,

      tenantId:
        "hotwheels",

      documentType:
        "catalog",

      template: {
        id:
          "collectibles.catalog",

        version: 1,
      },

      locale:
        "es-PE",

      currency:
        "PEN",

      requestedAt,

      identity: {
        eyebrow:
          "COLECCIONABLES 1:64",

        subtitle:
          "Catálogo comercial",
      },

      composition: {
        schemaVersion:
          composition.schemaVersion,

        mode:
          composition.mode,

        title:
          composition.title,

        categoryIds:
          [...composition.categoryIds],

        productIds:
          [...composition.productIds],
      },

      content: {
        pageSize: 6,

        totalProducts:
          preview.products.length,

        pages:
          preview.pages.map(
            (
              page,
              index,
            ) => ({
              number:
                index + 1,

              products:
                page.map(
                  productSnapshot,
                ),
            }),
          ),
      },
    },

    missingProductIds: [],
  };
}
