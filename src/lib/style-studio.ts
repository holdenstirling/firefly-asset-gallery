import type {
  Asset,
  AspectRatio,
  GenerationParameters,
  StudioStyle,
  StylePalette,
  StylePaletteId,
  TypographyPair,
  TypographyPairId,
} from "@/lib/types";

export const STYLE_PALETTES: readonly StylePalette[] = [
  {
    id: "firefly",
    name: "Firefly Glow",
    description: "Violet, magenta, and ember accents for launch moments.",
    swatchClasses: ["bg-primary", "bg-accent", "firefly-gradient"],
    tokenValues: [
      "hsl(var(--primary))",
      "hsl(var(--accent))",
      "hsl(var(--firefly-to))",
    ],
  },
  {
    id: "earth",
    name: "Natural Light",
    description: "Warm neutrals and soft contrast for editorial sets.",
    swatchClasses: ["bg-muted", "bg-secondary", "bg-card"],
    tokenValues: [
      "hsl(var(--muted))",
      "hsl(var(--secondary))",
      "hsl(var(--card))",
    ],
  },
  {
    id: "mono",
    name: "Studio Mono",
    description: "High-control grayscale for product and layout tests.",
    swatchClasses: ["bg-foreground", "bg-muted-foreground", "bg-border"],
    tokenValues: [
      "hsl(var(--foreground))",
      "hsl(var(--muted-foreground))",
      "hsl(var(--border))",
    ],
  },
  {
    id: "candy",
    name: "Candy Signal",
    description: "Bright contrast for social, event, and youth campaigns.",
    swatchClasses: ["bg-accent", "bg-primary", "bg-secondary"],
    tokenValues: [
      "hsl(var(--accent))",
      "hsl(var(--primary))",
      "hsl(var(--secondary))",
    ],
  },
];

export const TYPOGRAPHY_PAIRS: readonly TypographyPair[] = [
  {
    id: "editorial",
    name: "Editorial",
    heading: "Serif display",
    body: "Humanist sans",
    description: "Refined hierarchy for campaign landing pages.",
  },
  {
    id: "product",
    name: "Product",
    heading: "Geometric sans",
    body: "System sans",
    description: "Clean and direct for product imagery.",
  },
  {
    id: "playful",
    name: "Playful",
    heading: "Rounded display",
    body: "Friendly sans",
    description: "Approachable voice for creator and social assets.",
  },
  {
    id: "technical",
    name: "Technical",
    heading: "Condensed sans",
    body: "Mono detail",
    description: "Precise labeling for UI, charts, and explainers.",
  },
];

export const DEFAULT_GENERATION_PARAMETERS: GenerationParameters = {
  contentType: "image",
  aspectRatio: "1:1",
  stylePreset: "photorealistic",
  model: "firefly-image-3",
  seed: 1234,
  guidance: 7.5,
  steps: 32,
};

export const INITIAL_STUDIO_STYLES: readonly StudioStyle[] = [
  {
    id: "style-launch-glow",
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
    createdAt: "2026-05-20T12:00:00.000Z",
    updatedAt: "2026-05-20T12:00:00.000Z",
  },
  {
    id: "style-natural-editorial",
    name: "Natural Editorial",
    description: "Soft, warm, publication-ready art direction.",
    paletteId: "earth",
    typographyId: "editorial",
    parameters: {
      ...DEFAULT_GENERATION_PARAMETERS,
      aspectRatio: "4:3",
      stylePreset: "photorealistic",
      guidance: 6.5,
      seed: 6060,
    },
    createdAt: "2026-05-20T12:00:00.000Z",
    updatedAt: "2026-05-20T12:00:00.000Z",
  },
];

interface BuildStudioStyleInput {
  name: string;
  description: string;
  paletteId: StylePaletteId;
  typographyId: TypographyPairId;
  parameters: GenerationParameters;
  existingId?: string;
  now?: string;
}

export function getStylePalette(id: StylePaletteId): StylePalette {
  return STYLE_PALETTES.find((palette) => palette.id === id) ?? STYLE_PALETTES[0];
}

export function getTypographyPair(id: TypographyPairId): TypographyPair {
  return TYPOGRAPHY_PAIRS.find((pair) => pair.id === id) ?? TYPOGRAPHY_PAIRS[0];
}

export function dimensionsForAspectRatio(
  aspectRatio: AspectRatio
): { width: number; height: number } {
  switch (aspectRatio) {
    case "16:9":
      return { width: 1280, height: 720 };
    case "9:16":
      return { width: 720, height: 1280 };
    case "4:3":
      return { width: 1024, height: 768 };
    case "3:4":
      return { width: 768, height: 1024 };
    default:
      return { width: 1024, height: 1024 };
  }
}

export function buildStudioStyle({
  name,
  description,
  paletteId,
  typographyId,
  parameters,
  existingId,
  now = new Date().toISOString(),
}: BuildStudioStyleInput): StudioStyle {
  const trimmedName = name.trim() || "Untitled Style";

  return {
    id: existingId ?? createStyleId(trimmedName, now),
    name: trimmedName,
    description: description.trim(),
    paletteId,
    typographyId,
    parameters,
    createdAt: now,
    updatedAt: now,
  };
}

export function styleToJsonTokens(style: StudioStyle): string {
  const palette = getStylePalette(style.paletteId);
  const typography = getTypographyPair(style.typographyId);
  const tokens = {
    name: style.name,
    palette: {
      primary: palette.tokenValues[0],
      secondary: palette.tokenValues[1],
      accent: palette.tokenValues[2],
    },
    typography: {
      heading: typography.heading,
      body: typography.body,
    },
    generation: style.parameters,
  };

  return JSON.stringify(tokens, null, 2);
}

export function styleToCssTokens(style: StudioStyle): string {
  const palette = getStylePalette(style.paletteId);
  const typography = getTypographyPair(style.typographyId);
  const tokenPrefix = slugify(style.name);

  return [
    `:root {`,
    `  --style-${tokenPrefix}-color-primary: ${palette.tokenValues[0]};`,
    `  --style-${tokenPrefix}-color-secondary: ${palette.tokenValues[1]};`,
    `  --style-${tokenPrefix}-color-accent: ${palette.tokenValues[2]};`,
    `  --style-${tokenPrefix}-font-heading: ${typography.heading};`,
    `  --style-${tokenPrefix}-font-body: ${typography.body};`,
    `}`,
  ].join("\n");
}

export function createGeneratedAsset({
  prompt,
  parameters,
  count,
  now = new Date().toISOString(),
}: {
  prompt: string;
  parameters: GenerationParameters;
  count: number;
  now?: string;
}): Asset {
  const dimensions = dimensionsForAspectRatio(parameters.aspectRatio);
  const seed = parameters.seed + count;

  return {
    id: `generated-${Date.parse(now)}-${count}`,
    prompt: prompt.trim(),
    parameters,
    seed,
    width: dimensions.width,
    height: dimensions.height,
    createdAt: now,
    author: {
      name: "You",
      avatarSeed: "current-user",
    },
    tags: tagsFromPrompt(prompt, parameters),
    favorited: false,
    collectionIds: [],
  };
}

function createStyleId(name: string, now: string): string {
  return `style-${slugify(name)}-${Date.parse(now).toString(36)}`;
}

function slugify(value: string): string {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "untitled";
}

function tagsFromPrompt(
  prompt: string,
  parameters: GenerationParameters
): string[] {
  const words = prompt
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 3)
    .slice(0, 2);

  return Array.from(
    new Set([parameters.stylePreset, parameters.contentType, ...words])
  );
}
