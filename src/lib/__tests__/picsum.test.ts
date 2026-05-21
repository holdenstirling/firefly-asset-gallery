import { describe, expect, it } from "vitest";
import { picsumUrl, avatarUrl } from "../picsum";

describe("picsumUrl", () => {
  it("builds a deterministic URL from seed and dimensions", () => {
    expect(picsumUrl({ seed: "alpha", width: 400, height: 300 })).toBe(
      "https://picsum.photos/seed/alpha/400/300"
    );
  });

  it("URL-encodes string seeds with special characters", () => {
    expect(picsumUrl({ seed: "spring campaign", width: 200, height: 200 })).toBe(
      "https://picsum.photos/seed/spring%20campaign/200/200"
    );
  });

  it("appends blur within the allowed 1-10 range", () => {
    expect(picsumUrl({ seed: 1, width: 100, height: 100, blur: 5 })).toBe(
      "https://picsum.photos/seed/1/100/100?blur=5"
    );
  });

  it("ignores out-of-range blur values", () => {
    expect(picsumUrl({ seed: 1, width: 100, height: 100, blur: 0 })).toBe(
      "https://picsum.photos/seed/1/100/100"
    );
    expect(picsumUrl({ seed: 1, width: 100, height: 100, blur: 11 })).toBe(
      "https://picsum.photos/seed/1/100/100"
    );
  });

  it("appends grayscale flag when enabled", () => {
    const url = picsumUrl({
      seed: "x",
      width: 50,
      height: 50,
      grayscale: true,
    });
    expect(url).toContain("grayscale");
  });
});

describe("avatarUrl", () => {
  it("namespaces avatar seeds to keep them stable across renders", () => {
    expect(avatarUrl("maya")).toContain("avatar-maya");
    expect(avatarUrl("maya")).toBe(avatarUrl("maya"));
  });

  it("uses a default size of 64x64", () => {
    expect(avatarUrl("kai")).toBe(
      "https://picsum.photos/seed/avatar-kai/64/64"
    );
  });

  it("respects an explicit size override", () => {
    expect(avatarUrl("kai", 128)).toBe(
      "https://picsum.photos/seed/avatar-kai/128/128"
    );
  });
});
