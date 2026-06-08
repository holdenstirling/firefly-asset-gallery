const BUCKET_BITS = 5;
const BUCKET_SIZE = 256 / (1 << BUCKET_BITS);
const ALPHA_THRESHOLD = 128;

interface Bucket {
  count: number;
  rSum: number;
  gSum: number;
  bSum: number;
}

function quantizeChannel(value: number): number {
  return Math.floor(value / BUCKET_SIZE) * BUCKET_SIZE;
}

function formatHex(r: number, g: number, b: number): string {
  const toHex = (channel: number) =>
    Math.round(channel).toString(16).padStart(2, "0");

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function extractDominantColors(imageData: ImageData, k: number): string[] {
  if (k <= 0 || imageData.data.length === 0) {
    return [];
  }

  const buckets = new Map<string, Bucket>();

  for (let index = 0; index < imageData.data.length; index += 4) {
    const r = imageData.data[index];
    const g = imageData.data[index + 1];
    const b = imageData.data[index + 2];
    const a = imageData.data[index + 3];

    if (a < ALPHA_THRESHOLD) {
      continue;
    }

    const bucketR = quantizeChannel(r);
    const bucketG = quantizeChannel(g);
    const bucketB = quantizeChannel(b);
    const key = `${bucketR}|${bucketG}|${bucketB}`;

    const existing = buckets.get(key);
    if (existing) {
      existing.count += 1;
      existing.rSum += r;
      existing.gSum += g;
      existing.bSum += b;
    } else {
      buckets.set(key, {
        count: 1,
        rSum: r,
        gSum: g,
        bSum: b,
      });
    }
  }

  return [...buckets.values()]
    .sort((left, right) => right.count - left.count)
    .slice(0, k)
    .map((bucket) =>
      formatHex(
        bucket.rSum / bucket.count,
        bucket.gSum / bucket.count,
        bucket.bSum / bucket.count
      )
    );
}
