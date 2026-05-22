import { describe, expect, it } from "vitest";
import { extractDominantColors, rgbToHex } from "../palette-extraction";

function makeImageData(pixels: Array<[number, number, number, number?]>) {
  const data = new Uint8ClampedArray(pixels.length * 4);
  pixels.forEach(([r, g, b, a = 255], i) => {
    data[i * 4] = r;
    data[i * 4 + 1] = g;
    data[i * 4 + 2] = b;
    data[i * 4 + 3] = a;
  });
  return { data, width: pixels.length, height: 1 };
}

function repeat<T>(value: T, count: number): T[] {
  return Array.from({ length: count }, () => value);
}

describe("rgbToHex", () => {
  it("formats channels as lowercase #rrggbb", () => {
    expect(rgbToHex(255, 0, 64)).toBe("#ff0040");
    expect(rgbToHex(0, 0, 0)).toBe("#000000");
    expect(rgbToHex(255, 255, 255)).toBe("#ffffff");
  });

  it("clamps out-of-range values", () => {
    expect(rgbToHex(-10, 999, 128)).toBe("#00ff80");
  });
});

describe("extractDominantColors", () => {
  it("returns N colors for N = 3, 5, 7 when there are enough distinct buckets", () => {
    const pixels: Array<[number, number, number]> = [
      ...repeat([255, 0, 0] as [number, number, number], 10),
      ...repeat([0, 255, 0] as [number, number, number], 9),
      ...repeat([0, 0, 255] as [number, number, number], 8),
      ...repeat([255, 255, 0] as [number, number, number], 7),
      ...repeat([255, 0, 255] as [number, number, number], 6),
      ...repeat([0, 255, 255] as [number, number, number], 5),
      ...repeat([255, 255, 255] as [number, number, number], 4),
    ];
    const image = makeImageData(pixels);

    expect(extractDominantColors(image, 3)).toHaveLength(3);
    expect(extractDominantColors(image, 5)).toHaveLength(5);
    expect(extractDominantColors(image, 7)).toHaveLength(7);
  });

  it("returns lowercase #rrggbb hex strings", () => {
    const image = makeImageData([
      [255, 0, 0],
      [255, 0, 0],
      [0, 255, 0],
    ]);
    const result = extractDominantColors(image, 2);
    expect(result).toHaveLength(2);
    for (const swatch of result) {
      expect(swatch).toMatch(/^#[0-9a-f]{6}$/);
    }
  });

  it("orders swatches by frequency, most dominant first", () => {
    const image = makeImageData([
      ...repeat([10, 10, 10] as [number, number, number], 2),
      ...repeat([240, 0, 0] as [number, number, number], 8),
      ...repeat([0, 240, 0] as [number, number, number], 5),
    ]);

    const palette = extractDominantColors(image, 3);
    expect(palette[0]).toBe("#f00000");
    expect(palette[1]).toBe("#00f000");
    expect(palette[2]).toBe("#0a0a0a");
  });

  it("returns an empty array for empty pixel data", () => {
    const image = { data: new Uint8ClampedArray(0), width: 0, height: 0 };
    expect(extractDominantColors(image, 5)).toEqual([]);
  });

  it("returns an empty array when k <= 0", () => {
    const image = makeImageData([[255, 0, 0]]);
    expect(extractDominantColors(image, 0)).toEqual([]);
    expect(extractDominantColors(image, -3)).toEqual([]);
  });

  it("clamps k to the number of distinct buckets when fewer exist", () => {
    const image = makeImageData([
      [255, 0, 0],
      [255, 0, 0],
      [0, 255, 0],
    ]);
    expect(extractDominantColors(image, 7)).toHaveLength(2);
  });

  it("skips fully transparent pixels", () => {
    const image = makeImageData([
      [10, 10, 10, 0],
      [10, 10, 10, 0],
      [240, 0, 0, 255],
    ]);
    expect(extractDominantColors(image, 5)).toEqual(["#f00000"]);
  });
});
