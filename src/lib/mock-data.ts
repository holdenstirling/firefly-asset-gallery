import type {
  Asset,
  Collection,
  ContentType,
  GenerationParameters,
  PromptHistoryItem,
  StylePreset,
} from "./types";

const PROMPTS: { prompt: string; tags: string[]; style: StylePreset }[] = [
  {
    prompt:
      "A futuristic cityscape at golden hour, towering glass spires reflecting an orange sky, drone shot",
    tags: ["cityscape", "futuristic", "golden-hour"],
    style: "cinematic",
  },
  {
    prompt:
      "Studio product photo of a ceramic mug with steam rising, soft warm rim light, dark background",
    tags: ["product", "studio", "minimal"],
    style: "photorealistic",
  },
  {
    prompt:
      "Hand-painted watercolor illustration of a Tokyo alley in spring, cherry blossoms drifting",
    tags: ["illustration", "watercolor", "tokyo"],
    style: "watercolor",
  },
  {
    prompt:
      "Isometric 3D render of a tiny floating island with a windmill, pastel palette, soft shadows",
    tags: ["3d", "isometric", "pastel"],
    style: "3d-render",
  },
  {
    prompt:
      "Cyberpunk portrait of a woman in neon rain, electric blue and magenta highlights, shallow depth of field",
    tags: ["portrait", "cyberpunk", "neon"],
    style: "neon",
  },
  {
    prompt:
      "Minimal flat illustration of a yoga studio with morning light, sage and cream palette",
    tags: ["illustration", "minimal", "wellness"],
    style: "minimal",
  },
  {
    prompt:
      "Vintage 1970s travel poster for the California coast, sun-faded colors, hand-drawn type",
    tags: ["poster", "vintage", "travel"],
    style: "vintage",
  },
  {
    prompt:
      "Photorealistic close-up of a hummingbird mid-flight beside a hibiscus flower, macro lens",
    tags: ["nature", "macro", "photoreal"],
    style: "photorealistic",
  },
  {
    prompt:
      "Cinematic shot of a snow-covered Nordic cabin at dusk, warm window light, aurora overhead",
    tags: ["cinematic", "winter", "landscape"],
    style: "cinematic",
  },
  {
    prompt:
      "Editorial fashion shot of a model in sculptural red dress against a brutalist concrete wall",
    tags: ["fashion", "editorial", "architecture"],
    style: "photorealistic",
  },
  {
    prompt:
      "Abstract liquid metal sculpture, chrome reflections on a black mirror surface, studio lit",
    tags: ["abstract", "3d", "chrome"],
    style: "3d-render",
  },
  {
    prompt:
      "Whimsical illustration of an underwater tea party with octopus and jellyfish, soft cyan light",
    tags: ["illustration", "underwater", "whimsy"],
    style: "illustration",
  },
];

const AUTHORS = [
  { name: "Maya Chen", avatarSeed: "maya" },
  { name: "Jordan Reyes", avatarSeed: "jordan" },
  { name: "Sasha Volkov", avatarSeed: "sasha" },
  { name: "Kai Patel", avatarSeed: "kai" },
  { name: "Elena Park", avatarSeed: "elena" },
];

function pickContentType(index: number): ContentType {
  const cycle: ContentType[] = ["image", "image", "image", "vector", "3d"];
  return cycle[index % cycle.length];
}

function makeParameters(
  index: number,
  style: StylePreset
): GenerationParameters {
  const aspects = ["1:1", "4:3", "3:4", "16:9", "9:16"] as const;
  return {
    contentType: pickContentType(index),
    aspectRatio: aspects[index % aspects.length],
    stylePreset: style,
    model: "firefly-image-3",
    seed: 1000 + index * 17,
    guidance: 7.5,
    steps: 32,
  };
}

function dimensionsFor(aspect: string): { width: number; height: number } {
  switch (aspect) {
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

/**
 * Stable "now" reference for the mock dataset. Components render relative
 * timestamps against this constant so server-rendered HTML and client
 * hydration produce identical strings (no React hydration mismatch).
 */
export const MOCK_NOW = new Date("2026-05-20T12:00:00Z").getTime();

function offsetTime(hoursAgo: number): string {
  return new Date(MOCK_NOW - hoursAgo * 3_600_000).toISOString();
}

export const MOCK_ASSETS: Asset[] = PROMPTS.flatMap((p, i) => {
  const variants = 3;
  return Array.from({ length: variants }, (_, v) => {
    const idx = i * variants + v;
    const params = makeParameters(idx, p.style);
    const dims = dimensionsFor(params.aspectRatio);
    return {
      id: `asset-${idx + 1}`,
      prompt: p.prompt,
      parameters: params,
      seed: params.seed + v,
      width: dims.width,
      height: dims.height,
      createdAt: offsetTime(idx * 0.7 + 0.3),
      author: AUTHORS[idx % AUTHORS.length],
      tags: p.tags,
      favorited: idx % 5 === 0,
      collectionIds:
        idx % 4 === 0
          ? ["collection-1"]
          : idx % 4 === 1
            ? ["collection-2"]
            : [],
    } satisfies Asset;
  });
});

export const MOCK_PROMPT_HISTORY: PromptHistoryItem[] = PROMPTS.map((p, i) => ({
  id: `prompt-${i + 1}`,
  prompt: p.prompt,
  createdAt: offsetTime(i * 0.7 + 0.3),
  assetCount: 3,
  thumbnailSeed: String(1000 + i * 51),
}));

export const MOCK_COLLECTIONS: Collection[] = [
  {
    id: "collection-1",
    name: "Spring Campaign 2026",
    description:
      "Hero imagery for the Q2 brand refresh — emphasis on natural light and warm palettes.",
    assetIds: MOCK_ASSETS.filter((a) => a.collectionIds.includes("collection-1"))
      .map((a) => a.id),
    coverSeed: "spring-cover",
    createdAt: offsetTime(72),
    updatedAt: offsetTime(2),
  },
  {
    id: "collection-2",
    name: "Editorial — Issue 14",
    description: "Long-form editorial spreads exploring brutalist architecture and fashion.",
    assetIds: MOCK_ASSETS.filter((a) => a.collectionIds.includes("collection-2"))
      .map((a) => a.id),
    coverSeed: "editorial-cover",
    createdAt: offsetTime(120),
    updatedAt: offsetTime(8),
  },
  {
    id: "collection-3",
    name: "Concept Sketches",
    description: "Early-phase exploration boards for the upcoming product launch.",
    assetIds: [],
    coverSeed: "concept-cover",
    createdAt: offsetTime(200),
    updatedAt: offsetTime(48),
  },
];

export function findAssetById(id: string): Asset | undefined {
  return MOCK_ASSETS.find((a) => a.id === id);
}

export function findCollectionById(id: string): Collection | undefined {
  return MOCK_COLLECTIONS.find((c) => c.id === id);
}
