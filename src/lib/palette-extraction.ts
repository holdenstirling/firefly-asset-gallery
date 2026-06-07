const BUCKET_SIZE = 32;
const MAX_SAMPLE_DIMENSION = 96;

/**
 * Downsample image data dimensions for histogram analysis.
 * Exported for page-level downsampling before calling extractDominantColors.
 */
export function getDownsampleDimensions(
  width: number,
  height: number,
  maxDimension = MAX_SAMPLE_DIMENSION
): { width: number; height: number } {
  const longest = Math.max(width, height, 1);
  const scale = Math.min(1, maxDimension / longest);
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

/**
 * Extract the top-K dominant colors from image pixel data using RGB histogram bucketing.
 */
export function extractDominantColors(imageData: ImageData, k: number): string[] {
  const safeK = Math.max(1, Math.floor(k));
  const { data, width, height } = imageData;

  if (width === 0 || height === 0 || data.length === 0) {
    return Array.from({ length: safeK }, () => "#000000");
  }

  const counts = new Map<string, { r: number; g: number; b: number; count: number }>();

  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3];
    if (alpha < 128) continue;

    const r = bucketChannel(data[i]);
    const g = bucketChannel(data[i + 1]);
    const b = bucketChannel(data[i + 2]);
    const key = `${r},${g},${b}`;
    const existing = counts.get(key);

    if (existing) {
      existing.count += 1;
    } else {
      counts.set(key, { r, g, b, count: 1 });
    }
  }

  if (counts.size === 0) {
    return Array.from({ length: safeK }, () => "#000000");
  }

  const sorted = [...counts.values()].sort((a, b) => b.count - a.count);
  const colors: string[] = [];

  for (const bucket of sorted) {
    colors.push(rgbToHex(bucket.r, bucket.g, bucket.b));
    if (colors.length >= safeK) break;
  }

  while (colors.length < safeK) {
    colors.push(colors[colors.length - 1] ?? "#000000");
  }

  return colors;
}

function bucketChannel(channel: number): number {
  const clamped = Math.max(0, Math.min(255, channel));
  return Math.floor(clamped / BUCKET_SIZE) * BUCKET_SIZE;
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function toHex(channel: number): string {
  return channel.toString(16).padStart(2, "0").toUpperCase();
}
