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
