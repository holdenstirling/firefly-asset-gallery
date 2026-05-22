/**
 * Brand Palette Extractor — dominant color extraction utilities.
 *
 * Pure functions, no DOM dependencies in the extractor itself. The page
 * component is responsible for loading the image and producing an ImageData
 * via an offscreen canvas — that's also where the perf constraint is enforced
 * (downsample to a max of 96×96 before bucketing so extraction stays well
 * under 100ms on a 1024×1024 source).
 */

const CHANNEL_BITS = 5;
const CHANNEL_LEVELS = 1 << CHANNEL_BITS;

interface Bucket {
  rSum: number;
  gSum: number;
  bSum: number;
  count: number;
}

/**
 * Returns the K most frequent colors in the image as lowercase `#rrggbb`
 * strings, ordered from most to least frequent.
 *
 * Uses 5-bit-per-channel histogram bucketing (32^3 = 32 768 buckets). For each
 * occupied bucket we keep a running RGB sum so the returned hex value is the
 * bucket's mean color rather than an arbitrary representative pixel.
 *
 * - Fully transparent pixels (alpha = 0) are skipped.
 * - Returns `[]` when there are no opaque pixels or when `k <= 0`.
 * - Clamps to the number of distinct buckets when `k` exceeds it.
 */
export function extractDominantColors(
  imageData: { data: Uint8ClampedArray; width: number; height: number },
  k: number
): string[] {
  if (k <= 0) return [];
  const { data } = imageData;
  if (!data || data.length === 0) return [];

  const buckets = new Map<number, Bucket>();

  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3];
    if (a === 0) continue;

    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const key =
      ((r >> (8 - CHANNEL_BITS)) * CHANNEL_LEVELS + (g >> (8 - CHANNEL_BITS))) *
        CHANNEL_LEVELS +
      (b >> (8 - CHANNEL_BITS));

    const existing = buckets.get(key);
    if (existing) {
      existing.rSum += r;
      existing.gSum += g;
      existing.bSum += b;
      existing.count += 1;
    } else {
      buckets.set(key, { rSum: r, gSum: g, bSum: b, count: 1 });
    }
  }

  if (buckets.size === 0) return [];

  const sorted = Array.from(buckets.values()).sort(
    (left, right) => right.count - left.count
  );

  const top = sorted.slice(0, Math.min(k, sorted.length));

  return top.map((bucket) =>
    rgbToHex(
      Math.round(bucket.rSum / bucket.count),
      Math.round(bucket.gSum / bucket.count),
      Math.round(bucket.bSum / bucket.count)
    )
  );
}

/**
 * Lowercase `#rrggbb` hex string for the given 0-255 RGB channels. Inputs are
 * clamped defensively so callers can pass averages without rounding first.
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (value: number) => {
    const rounded = Math.max(0, Math.min(255, Math.round(value)));
    return rounded.toString(16).padStart(2, "0");
  };
  return `#${clamp(r)}${clamp(g)}${clamp(b)}`;
}

/**
 * Draws `source` into an offscreen canvas, downsampling so the longest edge is
 * at most `maxEdge` pixels, and returns the resulting ImageData. Returns
 * `null` if the canvas context cannot be acquired (e.g. SSR) or if the image
 * is not yet loaded.
 *
 * The downsample keeps extraction bounded: on a 1024×1024 source we end up
 * iterating at most 96×96 = 9 216 pixels, which finishes well under 100ms.
 */
export function downsampleToImageData(
  source: HTMLImageElement,
  maxEdge = 96
): ImageData | null {
  if (typeof document === "undefined") return null;
  if (!source.naturalWidth || !source.naturalHeight) return null;

  const ratio = Math.min(
    1,
    maxEdge / Math.max(source.naturalWidth, source.naturalHeight)
  );
  const width = Math.max(1, Math.round(source.naturalWidth * ratio));
  const height = Math.max(1, Math.round(source.naturalHeight * ratio));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;

  ctx.drawImage(source, 0, 0, width, height);
  try {
    return ctx.getImageData(0, 0, width, height);
  } catch {
    return null;
  }
}
