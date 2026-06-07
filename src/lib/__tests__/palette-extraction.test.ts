import { describe, expect, it } from "vitest";
import {
  extractDominantColors,
  getDownsampleDimensions,
} from "@/lib/palette-extraction";

class MockImageData implements ImageData {
  readonly colorSpace: PredefinedColorSpace = "srgb";
  readonly data: Uint8ClampedArray;
  readonly height: number;
  readonly width: number;

  constructor(data: Uint8ClampedArray, width: number, height: number) {
    this.data = data;
    this.width = width;
    this.height = height;
  }
}

function createImageData(
  width: number,
  height: number,
  fill: (index: number) => [number, number, number, number]
): ImageData {
  const data = new Uint8ClampedArray(width * height * 4);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = y * width + x;
      const offset = index * 4;
      const [r, g, b, a] = fill(index);
      data[offset] = r;
      data[offset + 1] = g;
      data[offset + 2] = b;
      data[offset + 3] = a;
    }
  }

  return new MockImageData(data, width, height);
}

describe("extractDominantColors", () => {
  it("returns exactly K colors", () => {
    const imageData = createImageData(4, 4, () => [200, 100, 50, 255]);
    expect(extractDominantColors(imageData, 5)).toHaveLength(5);
    expect(extractDominantColors(imageData, 3)).toHaveLength(3);
    expect(extractDominantColors(imageData, 7)).toHaveLength(7);
  });

  it("returns valid hex strings", () => {
    const imageData = createImageData(2, 2, () => [34, 170, 255, 255]);
    const colors = extractDominantColors(imageData, 3);

    for (const color of colors) {
      expect(color).toMatch(/^#[0-9A-F]{6}$/);
    }
  });

  it("returns the most frequent color first", () => {
    const imageData = createImageData(4, 4, (index) =>
      index < 12 ? [240, 16, 32, 255] : [16, 32, 240, 255]
    );

    expect(extractDominantColors(imageData, 1)[0]).toBe("#E00020");
  });

  it("handles empty pixel data gracefully", () => {
    const empty = new MockImageData(new Uint8ClampedArray(0), 0, 0);
    const transparent = createImageData(2, 2, () => [255, 0, 0, 0]);

    expect(extractDominantColors(empty, 5)).toEqual([
      "#000000",
      "#000000",
      "#000000",
      "#000000",
      "#000000",
    ]);
    expect(extractDominantColors(transparent, 3)).toEqual([
      "#000000",
      "#000000",
      "#000000",
    ]);
  });
});

describe("getDownsampleDimensions", () => {
  it("caps the longest edge at 96 pixels", () => {
    expect(getDownsampleDimensions(1024, 768)).toEqual({ width: 96, height: 72 });
    expect(getDownsampleDimensions(400, 400)).toEqual({ width: 96, height: 96 });
  });
});
