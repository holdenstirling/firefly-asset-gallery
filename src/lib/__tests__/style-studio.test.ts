import { describe, expect, it } from "vitest";
import {
  buildStudioStyle,
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
