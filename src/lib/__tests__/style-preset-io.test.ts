import { describe, expect, it } from "vitest";
import { buildStudioStyle } from "@/lib/style-studio";
import {
  DEFAULT_GENERATION_PARAMETERS,
  exportStylePreset,
  exportStylePresetFilename,
  exportStylePresetToString,
  importStudioStyleFromString,
  importStylePreset,
  resolveImportedPresetName,
} from "@/lib/style-preset-io";
import { STYLE_PRESET_SCHEMA_VERSION } from "@/lib/types";

const baseStyle = buildStudioStyle({
  name: "Launch Glow",
  description: "High-energy hero images for campaign launches.",
  paletteId: "firefly",
  typographyId: "product",
  parameters: {
    ...DEFAULT_GENERATION_PARAMETERS,
    aspectRatio: "16:9",
    stylePreset: "cinematic",
    guidance: 8.5,
    seed: 4242,
  },
  now: "2026-05-27T19:00:00.000Z",
});

describe("style preset I/O", () => {
  describe("exportStylePreset", () => {
    it("strips identity fields so import regenerates them", () => {
      const exported = exportStylePreset(baseStyle);
      expect(exported.schemaVersion).toBe(STYLE_PRESET_SCHEMA_VERSION);
      expect(exported.name).toBe("Launch Glow");
      expect(exported.paletteId).toBe("firefly");
      expect(exported.typographyId).toBe("product");
      expect(exported.parameters.aspectRatio).toBe("16:9");
      expect(exported).not.toHaveProperty("id");
      expect(exported).not.toHaveProperty("createdAt");
      expect(exported).not.toHaveProperty("updatedAt");
    });

    it("derives a slug-cased filename from the preset name", () => {
      expect(exportStylePresetFilename(baseStyle)).toBe(
        "launch-glow.style.json",
      );
    });

    it("falls back to 'untitled.style.json' when the name is non-alphanumeric", () => {
      const decorative = {
        ...baseStyle,
        name: "??? !!!",
      };
      expect(exportStylePresetFilename(decorative)).toBe(
        "untitled.style.json",
      );
    });
  });

  describe("importStylePreset", () => {
    it("round-trips a valid preset", () => {
      const source = exportStylePresetToString(baseStyle);
      const result = importStylePreset(source);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.name).toBe(baseStyle.name);
        expect(result.value.paletteId).toBe(baseStyle.paletteId);
        expect(result.value.parameters).toEqual(baseStyle.parameters);
      }
    });

    it("returns INVALID_JSON for malformed input", () => {
      const result = importStylePreset("{not json");
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.code).toBe("INVALID_JSON");
      }
    });

    it("returns NOT_AN_OBJECT for a top-level array", () => {
      const result = importStylePreset("[1, 2, 3]");
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.code).toBe("NOT_AN_OBJECT");
      }
    });

    it("returns UNSUPPORTED_SCHEMA_VERSION for future schemas", () => {
      const result = importStylePreset(
        JSON.stringify({ ...exportStylePreset(baseStyle), schemaVersion: "9.9" }),
      );
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.code).toBe("UNSUPPORTED_SCHEMA_VERSION");
        expect(result.error.field).toBe("schemaVersion");
      }
    });

    it("returns MISSING_FIELD when a top-level string field is absent", () => {
      const exported = exportStylePreset(baseStyle) as Partial<
        ReturnType<typeof exportStylePreset>
      >;
      delete exported.description;
      const result = importStylePreset(JSON.stringify(exported));
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.code).toBe("MISSING_FIELD");
        expect(result.error.field).toBe("description");
      }
    });

    it("returns INVALID_PALETTE_ID for a paletteId outside the closed enum", () => {
      const result = importStylePreset(
        JSON.stringify({
          ...exportStylePreset(baseStyle),
          paletteId: "space",
        }),
      );
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.code).toBe("INVALID_PALETTE_ID");
        expect(result.error.field).toBe("paletteId");
      }
    });

    it("returns INVALID_TYPOGRAPHY_ID for a typographyId outside the closed enum", () => {
      const result = importStylePreset(
        JSON.stringify({
          ...exportStylePreset(baseStyle),
          typographyId: "blackletter",
        }),
      );
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.code).toBe("INVALID_TYPOGRAPHY_ID");
      }
    });

    it("returns INVALID_PARAMETERS for an invalid model id", () => {
      const result = importStylePreset(
        JSON.stringify({
          ...exportStylePreset(baseStyle),
          parameters: {
            ...exportStylePreset(baseStyle).parameters,
            model: "firefly-image-99",
          },
        }),
      );
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.code).toBe("INVALID_PARAMETERS");
        expect(result.error.field).toBe("parameters.model");
      }
    });

    it("returns INVALID_PARAMETERS for a non-finite seed", () => {
      const result = importStylePreset(
        JSON.stringify({
          ...exportStylePreset(baseStyle),
          parameters: {
            ...exportStylePreset(baseStyle).parameters,
            seed: "not-a-number",
          },
        }),
      );
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.code).toBe("INVALID_PARAMETERS");
        expect(result.error.field).toBe("parameters.seed");
      }
    });
  });

  describe("resolveImportedPresetName", () => {
    it("returns the desired name when not taken", () => {
      expect(resolveImportedPresetName("Launch Glow", [])).toBe("Launch Glow");
    });

    it("appends ' (imported)' on the first collision", () => {
      expect(
        resolveImportedPresetName("Launch Glow", ["Launch Glow"]),
      ).toBe("Launch Glow (imported)");
    });

    it("appends a numeric suffix when ' (imported)' is also taken", () => {
      expect(
        resolveImportedPresetName("Launch Glow", [
          "Launch Glow",
          "Launch Glow (imported)",
        ]),
      ).toBe("Launch Glow (imported 2)");
    });
  });

  describe("importStudioStyleFromString", () => {
    it("materializes a new StudioStyle with regenerated identity fields", () => {
      const source = exportStylePresetToString(baseStyle);
      const result = importStudioStyleFromString(
        source,
        [],
        "2026-06-01T00:00:00.000Z",
      );
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.id).not.toBe(baseStyle.id);
        expect(result.value.createdAt).toBe("2026-06-01T00:00:00.000Z");
        expect(result.value.updatedAt).toBe("2026-06-01T00:00:00.000Z");
        expect(result.value.name).toBe("Launch Glow");
        expect(result.value.parameters).toEqual(baseStyle.parameters);
      }
    });

    it("suffixes the name on a collision so the user's existing preset is untouched", () => {
      const source = exportStylePresetToString(baseStyle);
      const result = importStudioStyleFromString(source, ["Launch Glow"]);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.name).toBe("Launch Glow (imported)");
      }
    });

    it("propagates the validation error code", () => {
      const result = importStudioStyleFromString("{not json", []);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.code).toBe("INVALID_JSON");
      }
    });
  });
});
