import { describe, expect, it } from "vitest";
import { extractDominantColors } from "@/lib/palette-extraction";

function mockImageData(
  data: Uint8ClampedArray,
  width: number,
  height: number
): ImageData {
  return { data, width, height, colorSpace: "srgb" } as ImageData;
}

function createImageData(
  pixels: Array<[r: number, g: number, b: number, a?: number]>
): ImageData {
  const data = new Uint8ClampedArray(pixels.length * 4);

  pixels.forEach(([r, g, b, a = 255], index) => {
    const offset = index * 4;
    data[offset] = r;
    data[offset + 1] = g;
    data[offset + 2] = b;
    data[offset + 3] = a;
  });

  return mockImageData(data, pixels.length, 1);
}

function fillImageData(
  width: number,
  height: number,
  color: [number, number, number, number?]
): ImageData {
  const data = new Uint8ClampedArray(width * height * 4);

  for (let index = 0; index < width * height; index += 1) {
    const [r, g, b, a = 255] = color;
    const offset = index * 4;
    data[offset] = r;
    data[offset + 1] = g;
    data[offset + 2] = b;
    data[offset + 3] = a;
  }

  return mockImageData(data, width, height);
}

function mergeImageData(...sources: ImageData[]): ImageData {
  const totalLength = sources.reduce(
    (length, source) => length + source.data.length,
    0
  );
  const data = new Uint8ClampedArray(totalLength);
  let offset = 0;

  for (const source of sources) {
    data.set(source.data, offset);
    offset += source.data.length;
  }

  return mockImageData(data, sources[0]?.width ?? 1, sources[0]?.height ?? 1);
}

describe("extractDominantColors", () => {
  it("returns k colors when given at least k distinct buckets", () => {
    const imageData = createImageData([
      [255, 0, 0],
      [0, 255, 0],
      [0, 0, 255],
      [255, 255, 0],
      [255, 0, 255],
      [0, 255, 255],
      [128, 64, 32],
    ]);

    expect(extractDominantColors(imageData, 3)).toHaveLength(3);
    expect(extractDominantColors(imageData, 5)).toHaveLength(5);
    expect(extractDominantColors(imageData, 7)).toHaveLength(7);
  });

  it("returns lowercase #rrggbb strings", () => {
    const imageData = createImageData([[255, 128, 64]]);

    expect(extractDominantColors(imageData, 1)).toEqual(["#ff8040"]);
    expect(extractDominantColors(imageData, 1)[0]).toMatch(/^#[0-9a-f]{6}$/);
  });

  it("returns an empty array when pixel data is empty or fully transparent", () => {
    expect(
      extractDominantColors(mockImageData(new Uint8ClampedArray(4), 1, 1), 5)
    ).toEqual([]);
    expect(
      extractDominantColors(
        fillImageData(4, 4, [255, 0, 0, 0]),
        5
      )
    ).toEqual([]);
  });

  it("sorts results by frequency with the dominant color first", () => {
    const imageData = mergeImageData(
      fillImageData(10, 10, [220, 20, 20]),
      fillImageData(2, 2, [20, 180, 20]),
      fillImageData(1, 1, [20, 20, 180])
    );

    const colors = extractDominantColors(imageData, 3);

    expect(colors).toHaveLength(3);
    expect(colors[0]).toBe("#dc1414");
  });
});
