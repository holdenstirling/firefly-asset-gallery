"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AlertCircle, Check, Copy, Pipette, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { extractDominantColors } from "@/lib/palette-extraction";
import { picsumUrl } from "@/lib/picsum";
import { useStyleStudioStore } from "@/lib/store";

const DEFAULT_IMAGE_URL = picsumUrl({
  seed: "brand-palette",
  width: 800,
  height: 600,
});

const SWATCH_OPTIONS = [3, 5, 7] as const;
const MAX_CANVAS_DIMENSION = 400;

type ExtractStatus = "idle" | "loading" | "ready" | "error";

function scaleToFit(
  width: number,
  height: number,
  maxDimension: number
): { width: number; height: number } {
  const largestSide = Math.max(width, height);
  if (largestSide <= maxDimension) {
    return { width, height };
  }

  const scale = maxDimension / largestSide;
  return {
    width: Math.round(width * scale),
    height: Math.round(height * scale),
  };
}

type ExtractResult =
  | { ok: true; colors: string[]; previewUrl: string }
  | { ok: false; message: string };

async function loadAndExtract(
  url: string,
  count: number,
  canvas: HTMLCanvasElement | null
): Promise<ExtractResult> {
  return new Promise((resolve) => {
    const image = new window.Image();
    image.crossOrigin = "anonymous";

    image.onload = () => {
      try {
        if (!canvas) {
          throw new Error("Canvas is unavailable.");
        }

        const context = canvas.getContext("2d");
        if (!context) {
          throw new Error("Canvas context is unavailable.");
        }

        const dimensions = scaleToFit(
          image.naturalWidth,
          image.naturalHeight,
          MAX_CANVAS_DIMENSION
        );

        canvas.width = dimensions.width;
        canvas.height = dimensions.height;
        context.clearRect(0, 0, dimensions.width, dimensions.height);
        context.drawImage(image, 0, 0, dimensions.width, dimensions.height);

        const imageData = context.getImageData(
          0,
          0,
          dimensions.width,
          dimensions.height
        );

        resolve({
          ok: true,
          colors: extractDominantColors(imageData, count),
          previewUrl: url,
        });
      } catch {
        resolve({
          ok: false,
          message:
            "Could not read pixel data from this image. It may be blocked by CORS.",
        });
      }
    };

    image.onerror = () => {
      resolve({
        ok: false,
        message:
          "Image failed to load. Check the URL or try a Picsum image that allows cross-origin access.",
      });
    };

    image.src = url;
  });
}

export default function PaletteExtractorPage() {
  const addStyleFromPalette = useStyleStudioStore((s) => s.addStyleFromPalette);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [imageUrl, setImageUrl] = useState(DEFAULT_IMAGE_URL);
  const [activeUrl, setActiveUrl] = useState(DEFAULT_IMAGE_URL);
  const [swatchCount, setSwatchCount] = useState<(typeof SWATCH_OPTIONS)[number]>(5);
  const [status, setStatus] = useState<ExtractStatus>("loading");
  const [colors, setColors] = useState<string[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [saveOpen, setSaveOpen] = useState(false);
  const [styleName, setStyleName] = useState("Extracted Style");
  const [savedStyleName, setSavedStyleName] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void loadAndExtract(activeUrl, swatchCount, canvasRef.current).then(
      (result) => {
        if (cancelled) return;

        setSavedStyleName(null);
        if (result.ok) {
          setColors(result.colors);
          setPreviewUrl(result.previewUrl);
          setStatus("ready");
          setErrorMessage(null);
          return;
        }

        setColors([]);
        setPreviewUrl(null);
        setStatus("error");
        setErrorMessage(result.message);
      }
    );

    return () => {
      cancelled = true;
    };
  }, [activeUrl, swatchCount]);

  const handleExtract = () => {
    const trimmed = imageUrl.trim();
    if (!trimmed) {
      setStatus("error");
      setErrorMessage("Enter an image URL before extracting.");
      return;
    }

    setStatus("loading");
    setActiveUrl(trimmed);
  };

  const handleSwatchCountChange = (value: string) => {
    setStatus("loading");
    setSwatchCount(Number(value) as (typeof SWATCH_OPTIONS)[number]);
  };

  const handleCopyColor = async (color: string) => {
    await navigator.clipboard.writeText(color);
    setCopiedColor(color);
    window.setTimeout(() => setCopiedColor(null), 1500);
  };

  const handleSaveStyle = () => {
    const trimmedName = styleName.trim();
    if (!trimmedName || colors.length === 0) return;

    addStyleFromPalette({ name: trimmedName, palette: colors });
    setSavedStyleName(trimmedName);
    setSaveOpen(false);
  };

  return (
    <div className="flex h-screen flex-col">
      <header className="flex shrink-0 items-center justify-between border-b border-border px-6 py-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            <Pipette className="mr-2 inline h-5 w-5 text-primary" />
            Palette Extractor
            <span className="ml-2 rounded-full firefly-gradient px-2 py-0.5 align-middle text-[10px] font-semibold uppercase tracking-wider text-white">
              HOL-7
            </span>
          </h1>
          <p className="text-xs text-muted-foreground">
            Pull dominant colors from a reference image and save them as a Style
            preset.
          </p>
        </div>
        <Button
          variant="gradient"
          size="sm"
          disabled={status !== "ready" || colors.length === 0}
          onClick={() => setSaveOpen(true)}
        >
          <Save className="h-4 w-4" />
          Save as Style
        </Button>
      </header>

      <div className="flex-1 overflow-y-auto scrollbar-thin px-6 py-5">
        <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto] lg:items-end">
            <div className="flex flex-col gap-2">
              <label htmlFor="image-url" className="text-sm font-medium">
                Image URL
              </label>
              <Input
                id="image-url"
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
                placeholder="https://picsum.photos/seed/brand-palette/800/600"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="swatch-count" className="text-sm font-medium">
                Swatch count
              </label>
              <Select
                value={String(swatchCount)}
                onValueChange={handleSwatchCountChange}
              >
                <SelectTrigger id="swatch-count" className="w-full lg:w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SWATCH_OPTIONS.map((option) => (
                    <SelectItem key={option} value={String(option)}>
                      {option} swatches
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" onClick={handleExtract}>
              Extract palette
            </Button>
          </div>
        </section>

        {status === "error" && errorMessage ? (
          <div
            role="alert"
            className="mt-4 flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{errorMessage}</p>
          </div>
        ) : null}

        {savedStyleName ? (
          <div
            aria-live="polite"
            className="mt-4 rounded-xl border border-border bg-secondary/40 px-4 py-3 text-sm"
          >
            Saved <span className="font-medium">{savedStyleName}</span> to Style
            Studio.{" "}
            <Link href="/style-studio" className="text-primary underline-offset-4 hover:underline">
              Open Style Studio
            </Link>
          </div>
        ) : null}

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-sm font-semibold">Reference image</h2>
            <div className="mt-4 overflow-hidden rounded-lg border border-border bg-background/40">
              {status === "loading" ? (
                <div
                  aria-live="polite"
                  className="aspect-[4/3] animate-pulse bg-muted"
                />
              ) : previewUrl ? (
                <div className="relative aspect-[4/3]">
                  <Image
                    src={previewUrl}
                    alt="Reference image for palette extraction"
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              ) : (
                <div className="flex aspect-[4/3] items-center justify-center text-sm text-muted-foreground">
                  No image loaded
                </div>
              )}
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-sm font-semibold">Extracted palette</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {status === "loading"
                ? "Extracting dominant colors…"
                : `${colors.length} colors ranked by frequency`}
            </p>

            <div className="mt-4 flex flex-col gap-3">
              {status === "loading"
                ? Array.from({ length: swatchCount }).map((_, index) => (
                    <div
                      key={`skeleton-${index}`}
                      className="flex items-center gap-3 rounded-lg border border-border p-3"
                    >
                      <div className="h-10 w-10 animate-pulse rounded-md bg-muted" />
                      <div className="h-4 flex-1 animate-pulse rounded bg-muted" />
                    </div>
                  ))
                : colors.map((color) => (
                    <div
                      key={color}
                      className="flex items-center gap-3 rounded-lg border border-border bg-background/40 p-3"
                    >
                      <span
                        aria-label={`Color swatch ${color}`}
                        className="h-10 w-10 shrink-0 rounded-md border border-border"
                        style={{ backgroundColor: color }}
                      />
                      <span className="flex-1 font-mono text-sm">{color}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        aria-label={`Copy ${color} to clipboard`}
                        onClick={() => void handleCopyColor(color)}
                      >
                        {copiedColor === color ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                        {copiedColor === color ? "Copied" : "Copy"}
                      </Button>
                    </div>
                  ))}
            </div>
          </section>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

      <Dialog open={saveOpen} onOpenChange={setSaveOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Save as Style</DialogTitle>
            <DialogDescription>
              Name this extracted palette. It will appear in Style Studio
              immediately.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <label htmlFor="style-name" className="text-sm font-medium">
              Style name
            </label>
            <Input
              id="style-name"
              value={styleName}
              onChange={(event) => setStyleName(event.target.value)}
              placeholder="Campaign palette"
            />
            <Button
              variant="gradient"
              disabled={!styleName.trim() || colors.length === 0}
              onClick={handleSaveStyle}
            >
              Save style
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
