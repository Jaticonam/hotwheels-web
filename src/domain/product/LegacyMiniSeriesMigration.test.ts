import {
  describe,
  expect,
  it,
} from "vitest";

import {
  hasDeterministicLegacyMiniSeriesMigration,
  resolveLegacyMiniSeriesMigration,
} from "./LegacyMiniSeriesMigration";

describe(
  "Legacy Mini Series Migration",
  () => {
    it("separa una mini_series determinística", () => {
      expect(
        resolveLegacyMiniSeriesMigration(
          "Exoticars 2/10",
        ),
      ).toEqual({
        status:
          "parsed",

        reason:
          "parsed",

        series:
          "Exoticars",

        set_number:
          "2/10",
      });
    });

    it("preserva nombres de series con espacios", () => {
      expect(
        resolveLegacyMiniSeriesMigration(
          "HW Dream Garage 4/5",
        ),
      ).toEqual({
        status:
          "parsed",

        reason:
          "parsed",

        series:
          "HW Dream Garage",

        set_number:
          "4/5",
      });
    });

    it("preserva caracteres del nombre de serie", () => {
      expect(
        resolveLegacyMiniSeriesMigration(
          "Truckin' Along 2/5",
        ),
      ).toEqual({
        status:
          "parsed",

        reason:
          "parsed",

        series:
          "Truckin' Along",

        set_number:
          "2/5",
      });
    });

    it("envía Layin' Low a review sin inventar set_number", () => {
      expect(
        resolveLegacyMiniSeriesMigration(
          "Layin' Low",
        ),
      ).toEqual({
        status:
          "review",

        reason:
          "missing-set-number",

        series:
          "Layin' Low",

        set_number:
          null,
      });
    });

    it("bloquea una posición superior al total", () => {
      expect(
        resolveLegacyMiniSeriesMigration(
          "HW J-Imports 11/10",
        ),
      ).toEqual({
        status:
          "invalid",

        reason:
          "invalid-set-number",

        series:
          "HW J-Imports",

        set_number:
          "11/10",
      });

      expect(
        resolveLegacyMiniSeriesMigration(
          "Screen Time 11/10",
        ).status,
      ).toBe(
        "invalid",
      );
    });

    it("bloquea posiciones cero", () => {
      expect(
        resolveLegacyMiniSeriesMigration(
          "Exoticars 0/10",
        ).status,
      ).toBe(
        "invalid",
      );
    });

    it("trata valor vacío como review", () => {
      expect(
        resolveLegacyMiniSeriesMigration(
          "",
        ),
      ).toEqual({
        status:
          "review",

        reason:
          "empty",

        series:
          null,

        set_number:
          null,
      });
    });

    it("expone helper solo para migraciones determinísticas", () => {
      expect(
        hasDeterministicLegacyMiniSeriesMigration(
          "Ferrari 3/5",
        ),
      ).toBe(true);

      expect(
        hasDeterministicLegacyMiniSeriesMigration(
          "Layin' Low",
        ),
      ).toBe(false);

      expect(
        hasDeterministicLegacyMiniSeriesMigration(
          "HW J-Imports 11/10",
        ),
      ).toBe(false);
    });
  },
);
