/**
 * Lorem Picsum URL builder.
 *
 * We use picsum.photos as a stand-in for Firefly-generated assets so the demo
 * runs without API keys. Seeded URLs are deterministic — the same seed always
 * returns the same image, which makes the gallery feel like a real generation
 * history instead of a random shuffle on every reload.
 */

export interface PicsumOptions {
  seed: string | number;
  width: number;
  height: number;
  blur?: number;
  grayscale?: boolean;
}

export function picsumUrl({
  seed,
  width,
  height,
  blur,
  grayscale,
}: PicsumOptions): string {
  const params = new URLSearchParams();
  if (blur && blur > 0 && blur <= 10) params.set("blur", String(blur));
  if (grayscale) params.set("grayscale", "");

  const query = params.toString();
  const base = `https://picsum.photos/seed/${encodeURIComponent(
    String(seed)
  )}/${width}/${height}`;
  return query ? `${base}?${query}` : base;
}

export function avatarUrl(seed: string, size = 64): string {
  return picsumUrl({ seed: `avatar-${seed}`, width: size, height: size });
}
