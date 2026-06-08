import { describe, expect, it } from "vitest";
import { extractDominantColors } from "../palette-extraction";

function createImageData(
  width: number,
  height: number,
  fill: [number, number, number, number]
): ImageData {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let index = 0; index < data.length; index += 4) {
    data[index] = fill[0];
    data[index + 1] = fill[1];
    data[index + 2] = fill[2];
    data[index + 3] = fill[3];
  }

  return { data, width, height } as ImageData;
}

function createMixedImageData(width: number, height: number): ImageData {
  const data = new Uint8ClampedArray(width * height * 4);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = (y * width + x) * 4;
      const isRed = x < width / 2;
      data[index] = isRed ? 240 : 20;
      data[index + 1] = isRed ? 20 : 180;
      data[index + 2] = isRed ? 20 : 240;
      data[index + 3] = 255;
    }
  }

  return { data, width, height } as ImageData;
}

describe("extractDominantColors", () => {
  it("returns exactly k hex strings", () => {
    const imageData = createImageData(4, 4, [120, 80, 200, 255]);
    const colors = extractDominantColors(imageData, 5);

    expect(colors).toHaveLength(5);
    expect(colors.every((color) => /^#[0-9A-F]{6}$/.test(color))).toBe(true);
  });

  it("returns dominant bucket colors for mixed pixels", () => {
    const imageData = createMixedImageData(8, 8);
    const colors = extractDominantColors(imageData, 2);

    expect(colors).toHaveLength(2);
    expect(colors[0]).not.toBe(colors[1]);
  });

  it("returns fallback colors when pixel data is empty", () => {
    const imageData = createImageData(2, 2, [0, 0, 0, 0]);
    const colors = extractDominantColors(imageData, 3);

    expect(colors).toEqual(["#000000", "#000000", "#000000"]);
  });
});
