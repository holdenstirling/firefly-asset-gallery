import { describe, expect, it } from "vitest";
import {
  buildStudioStyle,
  buildStudioStyleFromPalette,
  createGeneratedAsset,
  DEFAULT_GENERATION_PARAMETERS,
  styleToCssTokens,
  styleToJsonTokens,
} from "@/lib/style-studio";

describe("style studio helpers", () => {
  it("builds a normalized studio style", () => {
    const style = buildStudioStyle({
      name: "  Launch Kit  ",
      description: "  Brand hero defaults  ",
      paletteId: "firefly",
      typographyId: "product",
      parameters: DEFAULT_GENERATION_PARAMETERS,
      now: "2026-05-20T12:00:00.000Z",
    });

    expect(style.id).toMatch(/^style-launch-kit-/);
    expect(style.name).toBe("Launch Kit");
    expect(style.description).toBe("Brand hero defaults");
    expect(style.parameters).toEqual(DEFAULT_GENERATION_PARAMETERS);
  });

  it("exports styles as JSON and CSS token bundles", () => {
    const style = buildStudioStyle({
      name: "Launch Kit",
      description: "",
      paletteId: "firefly",
      typographyId: "product",
      parameters: DEFAULT_GENERATION_PARAMETERS,
      now: "2026-05-20T12:00:00.000Z",
    });

    expect(JSON.parse(styleToJsonTokens(style))).toMatchObject({
      name: "Launch Kit",
      generation: DEFAULT_GENERATION_PARAMETERS,
    });
    expect(styleToCssTokens(style)).toContain(
      "--style-launch-kit-color-primary"
    );
  });

  it("round-trips a custom palette onto the stored style", () => {
    const style = buildStudioStyle({
      name: "Extracted Hero",
      description: "From a reference image",
      paletteId: "firefly",
      typographyId: "product",
      parameters: DEFAULT_GENERATION_PARAMETERS,
      customPalette: ["#101010", "#aa3322", "#f0e0d0"],
      now: "2026-05-20T12:00:00.000Z",
    });

    expect(style.customPalette).toEqual(["#101010", "#aa3322", "#f0e0d0"]);
  });

  it("omits customPalette when none is supplied", () => {
    const style = buildStudioStyle({
      name: "Launch Kit",
      description: "",
      paletteId: "firefly",
      typographyId: "product",
      parameters: DEFAULT_GENERATION_PARAMETERS,
      now: "2026-05-20T12:00:00.000Z",
    });
    expect(style.customPalette).toBeUndefined();
  });

  it("builds a studio style from an extracted palette", () => {
    const style = buildStudioStyleFromPalette({
      name: "Sunset Brand",
      palette: ["#ff7755", "#221133", "#fff8e0"],
      now: "2026-05-20T12:00:00.000Z",
    });

    expect(style.name).toBe("Sunset Brand");
    expect(style.customPalette).toEqual(["#ff7755", "#221133", "#fff8e0"]);
    expect(style.description).toBe("Extracted palette — 3 swatches");
    expect(style.parameters).toEqual(DEFAULT_GENERATION_PARAMETERS);
  });

  it("creates generated assets from prompt and parameters", () => {
    const asset = createGeneratedAsset({
      prompt: "Cinematic launch hero with glowing product",
      parameters: {
        ...DEFAULT_GENERATION_PARAMETERS,
        aspectRatio: "16:9",
        stylePreset: "cinematic",
      },
      count: 2,
      now: "2026-05-20T12:00:00.000Z",
    });

    expect(asset.id).toBe("generated-1779278400000-2");
    expect(asset.width).toBe(1280);
    expect(asset.height).toBe(720);
    expect(asset.tags).toEqual([
      "cinematic",
      "image",
      "launch",
      "hero",
    ]);
  });
});
