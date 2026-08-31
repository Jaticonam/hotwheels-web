import {
  describe,
  expect,
  it,
} from "vitest";

import {
  hasDeterministicLegacyRarity,
  resolveLegacyRarityMigration,
} from "./LegacyRarityMigration";

describe(
  "Legacy Rarity Migration",
  () => {
    it("resuelve Treasure Hunt desde descripción", () => {
      expect(
        resolveLegacyRarityMigration(
          "Modelo especial Treasure Hunt de la colección 2026.",
        ),
      ).toEqual({
        status:
          "resolved",

        reason:
          "treasure-hunt",

        rarity:
          "treasure-hunt",
      });
    });

    it("resuelve Super Treasure Hunt sin duplicarlo como TH", () => {
      expect(
        resolveLegacyRarityMigration(
          "Edición Super Treasure Hunt con acabado especial.",
        ),
      ).toEqual({
        status:
          "resolved",

        reason:
          "super-treasure-hunt",

        rarity:
          "super-treasure-hunt",
      });
    });

    it("es case insensitive para las frases completas", () => {
      expect(
        resolveLegacyRarityMigration(
          "SUPER TREASURE HUNT",
        ).rarity,
      ).toBe(
        "super-treasure-hunt",
      );

      expect(
        resolveLegacyRarityMigration(
          "treasure hunt",
        ).rarity,
      ).toBe(
        "treasure-hunt",
      );
    });

    it("tolera espacios múltiples dentro de la frase", () => {
      expect(
        resolveLegacyRarityMigration(
          "Super   Treasure   Hunt",
        ).rarity,
      ).toBe(
        "super-treasure-hunt",
      );
    });

    it("no infiere regular cuando no existe señal", () => {
      expect(
        resolveLegacyRarityMigration(
          "Hot Wheels Mainline 2026.",
        ),
      ).toEqual({
        status:
          "none",

        reason:
          "no-signal",

        rarity:
          null,
      });
    });

    it("no interpreta aliases TH o STH en el contrato legacy", () => {
      expect(
        resolveLegacyRarityMigration(
          "STH",
        ).rarity,
      ).toBeNull();

      expect(
        resolveLegacyRarityMigration(
          "TH",
        ).rarity,
      ).toBeNull();
    });

    it("bloquea descripciones con ambas señales independientes", () => {
      expect(
        resolveLegacyRarityMigration(
          "Treasure Hunt y también Super Treasure Hunt.",
        ),
      ).toEqual({
        status:
          "conflict",

        reason:
          "conflicting-signals",

        rarity:
          null,
      });
    });

    it("trata descripción vacía como ausencia de señal", () => {
      expect(
        resolveLegacyRarityMigration(
          "",
        ),
      ).toEqual({
        status:
          "none",

        reason:
          "no-signal",

        rarity:
          null,
      });
    });

    it("expone helper solo para señales determinísticas", () => {
      expect(
        hasDeterministicLegacyRarity(
          "Treasure Hunt",
        ),
      ).toBe(true);

      expect(
        hasDeterministicLegacyRarity(
          "Super Treasure Hunt",
        ),
      ).toBe(true);

      expect(
        hasDeterministicLegacyRarity(
          "Regular Mainline",
        ),
      ).toBe(false);

      expect(
        hasDeterministicLegacyRarity(
          "Treasure Hunt y Super Treasure Hunt",
        ),
      ).toBe(false);
    });
  },
);
