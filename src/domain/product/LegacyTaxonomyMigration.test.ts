import {
  describe,
  expect,
  it,
} from "vitest";

import {
  isAuditedMainline2026Card,
  isLegacyExploreTagId,
  resolveLegacyTaxonomyMigration,
} from "./LegacyTaxonomyMigration";

describe(
  "Legacy Taxonomy Migration",
  () => {
    it("conserva una categoría que ya es canónica", () => {
      expect(
        resolveLegacyTaxonomyMigration({
          category:
            "Premium",

          year:
            2026,

          cardNumber:
            "10/250",
        }),
      ).toEqual({
        canonicalCategory:
          "premium",

        exploreTags: [],

        reason:
          "canonical",
      });
    });

    it("migra JDM auditado a Mainline sin convertir JDM en categoría", () => {
      expect(
        resolveLegacyTaxonomyMigration({
          category:
            "JDM",

          year:
            2026,

          cardNumber:
            "60/250",
        }),
      ).toEqual({
        canonicalCategory:
          "mainline",

        exploreTags: [
          "jdm",
        ],

        reason:
          "mainline-2026-card-sequence",
      });
    });

    it("normaliza etiquetas legacy con tildes", () => {
      expect(
        resolveLegacyTaxonomyMigration({
          category:
            "Fantasía",

          year:
            2026,

          cardNumber:
            "5/250",
        }),
      ).toEqual({
        canonicalCategory:
          "mainline",

        exploreTags: [
          "fantasia",
        ],

        reason:
          "mainline-2026-card-sequence",
      });

      expect(
        resolveLegacyTaxonomyMigration({
          category:
            "Temáticos",

          year:
            2026,

          cardNumber:
            "4/250",
        }).exploreTags,
      ).toEqual([
        "tematicos",
      ]);
    });

    it("migra Mainline por evidencia del inventario y no por la etiqueta legacy", () => {
      expect(
        resolveLegacyTaxonomyMigration({
          category:
            "Etiqueta antigua desconocida",

          year:
            2026,

          cardNumber:
            "250/250",
        }),
      ).toEqual({
        canonicalCategory:
          "mainline",

        exploreTags: [],

        reason:
          "mainline-2026-card-sequence",
      });
    });

    it("no convierte x-caja u ofertas en explore tags", () => {
      expect(
        resolveLegacyTaxonomyMigration({
          category:
            "x Caja",

          year:
            2026,

          cardNumber:
            "100/250",
        }),
      ).toEqual({
        canonicalCategory:
          "mainline",

        exploreTags: [],

        reason:
          "mainline-2026-card-sequence",
      });

      expect(
        resolveLegacyTaxonomyMigration({
          category:
            "Ofertas",

          year:
            2026,

          cardNumber:
            "101/250",
        }).exploreTags,
      ).toEqual([]);
    });

    it("no extrapola automáticamente la auditoría hacia otros años", () => {
      expect(
        resolveLegacyTaxonomyMigration({
          category:
            "JDM",

          year:
            2027,

          cardNumber:
            "60/250",
        }),
      ).toEqual({
        canonicalCategory:
          null,

        exploreTags: [
          "jdm",
        ],

        reason:
          "unresolved",
      });
    });

    it("no acepta posiciones fuera del rango auditado", () => {
      expect(
        isAuditedMainline2026Card(
          2026,
          "251/250",
        ),
      ).toBe(false);

      expect(
        isAuditedMainline2026Card(
          2026,
          "0/250",
        ),
      ).toBe(false);

      expect(
        isAuditedMainline2026Card(
          2026,
          "11/10",
        ),
      ).toBe(false);
    });

    it("reconoce únicamente facetas legacy de exploración", () => {
      expect(
        isLegacyExploreTagId(
          "jdm",
        ),
      ).toBe(true);

      expect(
        isLegacyExploreTagId(
          "clasicos",
        ),
      ).toBe(true);

      expect(
        isLegacyExploreTagId(
          "x-caja",
        ),
      ).toBe(false);

      expect(
        isLegacyExploreTagId(
          "ofertas",
        ),
      ).toBe(false);

      expect(
        isLegacyExploreTagId(
          "mainline",
        ),
      ).toBe(false);
    });
  },
);
