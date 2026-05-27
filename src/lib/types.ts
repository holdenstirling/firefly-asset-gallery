export type ContentType = "image" | "vector" | "3d" | "video";

export type AspectRatio = "1:1" | "4:3" | "3:4" | "16:9" | "9:16";

export type StylePreset =
  | "photorealistic"
  | "cinematic"
  | "illustration"
  | "3d-render"
  | "watercolor"
  | "neon"
  | "minimal"
  | "vintage";

export interface GenerationParameters {
  contentType: ContentType;
  aspectRatio: AspectRatio;
  stylePreset: StylePreset;
  model: "firefly-image-3" | "firefly-image-2" | "firefly-vector";
  seed: number;
  guidance: number;
  steps: number;
}

export type StylePaletteId = "firefly" | "earth" | "mono" | "candy";

export type TypographyPairId = "editorial" | "product" | "playful" | "technical";

export interface StylePalette {
  id: StylePaletteId;
  name: string;
  description: string;
  swatchClasses: [string, string, string];
  tokenValues: [string, string, string];
}

export interface TypographyPair {
  id: TypographyPairId;
  name: string;
  heading: string;
  body: string;
  description: string;
}

export interface StudioStyle {
  id: string;
  name: string;
  description: string;
  paletteId: StylePaletteId;
  typographyId: TypographyPairId;
  parameters: GenerationParameters;
  createdAt: string;
  updatedAt: string;
}

export const STYLE_PRESET_SCHEMA_VERSION = "1.0" as const;

export interface StylePresetExport {
  schemaVersion: typeof STYLE_PRESET_SCHEMA_VERSION;
  name: string;
  description: string;
  paletteId: StylePaletteId;
  typographyId: TypographyPairId;
  parameters: GenerationParameters;
}

export type StylePresetImportErrorCode =
  | "INVALID_JSON"
  | "NOT_AN_OBJECT"
  | "UNSUPPORTED_SCHEMA_VERSION"
  | "MISSING_FIELD"
  | "INVALID_FIELD_TYPE"
  | "INVALID_PALETTE_ID"
  | "INVALID_TYPOGRAPHY_ID"
  | "INVALID_PARAMETERS";

export interface StylePresetImportError {
  code: StylePresetImportErrorCode;
  message: string;
  field?: string;
}

export interface Asset {
  id: string;
  prompt: string;
  parameters: GenerationParameters;
  seed: number;
  width: number;
  height: number;
  createdAt: string;
  author: {
    name: string;
    avatarSeed: string;
  };
  tags: string[];
  favorited: boolean;
  collectionIds: string[];
}

export interface PromptHistoryItem {
  id: string;
  prompt: string;
  createdAt: string;
  assetCount: number;
  thumbnailSeed: string;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  assetIds: string[];
  coverSeed: string;
  createdAt: string;
  updatedAt: string;
}
