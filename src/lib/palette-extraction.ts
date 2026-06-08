const BUCKET_SHIFT = 4;
const ALPHA_THRESHOLD = 128;
const FALLBACK_COLOR = "#000000";

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (channel: number) =>
    Math.max(0, Math.min(255, channel)).toString(16).padStart(2, "0");

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

function bucketChannel(channel: number): number {
  return channel >> BUCKET_SHIFT;
}

function bucketKey(r: number, g: number, b: number): number {
  return (
    (bucketChannel(r) << (BUCKET_SHIFT * 2)) |
    (bucketChannel(g) << BUCKET_SHIFT) |
    bucketChannel(b)
  );
}

function bucketCenter(value: number): number {
  const bucket = bucketChannel(value);
  const min = bucket << BUCKET_SHIFT;
  const max = min + ((1 << BUCKET_SHIFT) - 1);
  return Math.round((min + max) / 2);
}

function keyToHex(key: number): string {
  const r = (key >> (BUCKET_SHIFT * 2)) & ((1 << BUCKET_SHIFT) - 1);
  const g = (key >> BUCKET_SHIFT) & ((1 << BUCKET_SHIFT) - 1);
  const b = key & ((1 << BUCKET_SHIFT) - 1);

  return rgbToHex(
    bucketCenter(r << BUCKET_SHIFT),
    bucketCenter(g << BUCKET_SHIFT),
    bucketCenter(b << BUCKET_SHIFT)
  );
}

/**
 * Extracts the top-K dominant colors from raw canvas pixel data using RGB
 * histogram bucketing.
 */
export function extractDominantColors(
  imageData: ImageData,
  k: number
): string[] {
  const count = Math.max(1, Math.floor(k));
  const buckets = new Map<number, number>();

  for (let index = 0; index < imageData.data.length; index += 4) {
    const alpha = imageData.data[index + 3];
    if (alpha < ALPHA_THRESHOLD) continue;

    const r = imageData.data[index];
    const g = imageData.data[index + 1];
    const b = imageData.data[index + 2];
    const key = bucketKey(r, g, b);
    buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }

  if (buckets.size === 0) {
    return Array.from({ length: count }, () => FALLBACK_COLOR);
  }

  const ranked = [...buckets.entries()]
    .sort((left, right) => right[1] - left[1])
    .map(([key]) => keyToHex(key));

  const colors: string[] = [];
  for (const color of ranked) {
    if (!colors.includes(color)) {
      colors.push(color);
    }
    if (colors.length >= count) break;
  }

  while (colors.length < count) {
    colors.push(colors[colors.length - 1] ?? FALLBACK_COLOR);
  }

  return colors;
}
