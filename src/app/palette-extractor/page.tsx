"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Copy, Pipette, Save } from "lucide-react";
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
import {
  extractDominantColors,
  getDownsampleDimensions,
} from "@/lib/palette-extraction";
import { picsumUrl } from "@/lib/picsum";
import { useStyleStudioStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const DEFAULT_IMAGE_URL = picsumUrl({
  seed: "palette-extractor",
  width: 800,
  height: 600,
});

const SWATCH_COUNTS = [3, 5, 7] as const;

type ExtractionStatus = "idle" | "loading" | "success" | "error";

export default function PaletteExtractorPage() {
  const addStyleFromPalette = useStyleStudioStore((s) => s.addStyleFromPalette);
  const [imageUrl, setImageUrl] = useState(DEFAULT_IMAGE_URL);
  const [swatchCount, setSwatchCount] = useState<(typeof SWATCH_COUNTS)[number]>(5);
  const [status, setStatus] = useState<ExtractionStatus>("idle");
  const [colors, setColors] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [saveOpen, setSaveOpen] = useState(false);
  const [styleName, setStyleName] = useState("Extracted Palette");
  const [savedStyleId, setSavedStyleId] = useState<string | null>(null);

  const loaderRef = useRef<HTMLImageElement | null>(null);
  const requestIdRef = useRef(0);

  const extractFromImage = useCallback(
    async (url: string, count: number) => {
      const trimmedUrl = url.trim();
      if (!trimmedUrl) {
        setStatus("error");
        setErrorMessage("Enter a valid image URL to extract a palette.");
        setColors([]);
        return;
      }

      const requestId = requestIdRef.current + 1;
      requestIdRef.current = requestId;
      setStatus("loading");
      setErrorMessage(null);
      setColors([]);
      setSavedStyleId(null);

      let loaded = false;

      try {
        await new Promise<void>((resolve, reject) => {
          const image = new window.Image();
          image.crossOrigin = "anonymous";
          loaderRef.current = image;

          image.onload = () => resolve();
          image.onerror = () =>
            reject(
              new Error(
                "Could not load the image. Check the URL or try another source that allows cross-origin reads."
              )
            );
          image.src = trimmedUrl;
        });
        loaded = true;
      } catch (error) {
        if (requestIdRef.current !== requestId) return;
        setStatus("error");
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "The image failed to load. It may be blocked by CORS."
        );
        return;
      }

      if (!loaded || requestIdRef.current !== requestId || !loaderRef.current) return;

      try {
        const image = loaderRef.current;
        const { width, height } = getDownsampleDimensions(
          image.naturalWidth,
          image.naturalHeight
        );
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext("2d");
        if (!context) {
          throw new Error("Canvas is not available in this browser.");
        }

        context.drawImage(image, 0, 0, width, height);
        const imageData = context.getImageData(0, 0, width, height);
        const extracted = extractDominantColors(imageData, count);

        if (requestIdRef.current !== requestId) return;

        setColors(extracted);
        setStatus("success");
      } catch (error) {
        if (requestIdRef.current !== requestId) return;
        setStatus("error");
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Palette extraction failed. The image may be blocked by CORS."
        );
      }
    },
    []
  );

  useEffect(() => {
    queueMicrotask(() => {
      void extractFromImage(DEFAULT_IMAGE_URL, 5);
    });
  }, [extractFromImage]);

  const handleExtract = () => {
    void extractFromImage(imageUrl, swatchCount);
  };

  const handleCopy = async (hex: string) => {
    await navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    window.setTimeout(() => setCopiedHex(null), 1500);
  };

  const handleSave = () => {
    const trimmedName = styleName.trim();
    if (!trimmedName || colors.length === 0) return;

    const style = addStyleFromPalette({ name: trimmedName, palette: colors });
    setSavedStyleId(style.id);
    setSaveOpen(false);
  };

  const showPreview = status === "success" || status === "loading";
  const canSave = status === "success" && colors.length > 0;

  return (
    <div className="flex h-screen flex-col">
      <header className="flex shrink-0 items-center justify-between border-b border-border px-6 py-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Palette Extractor</h1>
          <p className="text-xs text-muted-foreground">
            Turn any reference image into a reusable Style preset.
          </p>
        </div>
        <Button
          variant="gradient"
          size="sm"
          disabled={!canSave}
          onClick={() => setSaveOpen(true)}
        >
          <Save className="h-4 w-4" />
          Save as Style
        </Button>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-5 scrollbar-thin">
        <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
              <Pipette className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold">Extract from image URL</h2>
              <p className="text-xs text-muted-foreground">
                Paste a moodboard, campaign photo, or Picsum URL. Extraction runs
                client-side.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_10rem_auto]">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="palette-image-url"
                className="text-[11px] uppercase tracking-wider text-muted-foreground"
              >
                Image URL
              </label>
              <Input
                id="palette-image-url"
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
                placeholder="https://picsum.photos/seed/..."
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="palette-swatch-count"
                className="text-[11px] uppercase tracking-wider text-muted-foreground"
              >
                Swatches
              </label>
              <Select
                value={String(swatchCount)}
                onValueChange={(value) =>
                  setSwatchCount(Number.parseInt(value, 10) as (typeof SWATCH_COUNTS)[number])
                }
              >
                <SelectTrigger id="palette-swatch-count">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SWATCH_COUNTS.map((count) => (
                    <SelectItem key={count} value={String(count)}>
                      {count} swatches
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button className="w-full lg:w-auto" onClick={handleExtract}>
                Extract palette
              </Button>
            </div>
          </div>
        </section>

        {status === "error" && errorMessage && (
          <div
            role="alert"
            className="mt-4 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            {errorMessage}
          </div>
        )}

        {savedStyleId && (
          <div className="mt-4 rounded-xl border border-border bg-secondary/40 px-4 py-3 text-sm">
            Style saved.{" "}
            <Link
              href="/style-studio"
              className="font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Open Style Studio
            </Link>{" "}
            to apply it.
          </div>
        )}

        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_24rem]">
          <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-sm font-semibold">Source image</h2>
            <div className="relative mt-4 aspect-[4/3] overflow-hidden rounded-xl border border-border bg-background/50">
              {status === "loading" && (
                <div className="absolute inset-0 animate-pulse bg-muted" />
              )}
              {showPreview && (
                <Image
                  src={imageUrl}
                  alt="Reference image for palette extraction"
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                  unoptimized
                />
              )}
              {status === "idle" && (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  Enter an image URL and extract a palette.
                </div>
              )}
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-sm font-semibold">Extracted palette</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Dominant colors sorted by frequency.
            </p>

            <div className="mt-4 flex flex-col gap-3">
              {status === "loading" &&
                Array.from({ length: swatchCount }).map((_, index) => (
                  <div
                    key={`skeleton-${index}`}
                    className="flex items-center gap-3 rounded-lg border border-border p-3"
                  >
                    <div className="h-12 w-12 animate-pulse rounded-md bg-muted" />
                    <div className="h-4 flex-1 animate-pulse rounded bg-muted" />
                  </div>
                ))}

              {status === "success" &&
                colors.map((hex, index) => (
                  <div
                    key={`${hex}-${index}`}
                    className="flex items-center gap-3 rounded-lg border border-border bg-background/40 p-3"
                  >
                    <div
                      className="h-12 w-12 shrink-0 rounded-md border border-border"
                      style={{ backgroundColor: hex }}
                      aria-hidden="true"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-sm">{hex}</p>
                    </div>
                    <button
                      type="button"
                      aria-label={`Copy ${hex}`}
                      onClick={() => void handleCopy(hex)}
                      className={cn(
                        "inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:text-foreground",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      )}
                    >
                      {copiedHex === hex ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                ))}

              {status === "idle" && (
                <p className="text-sm text-muted-foreground">
                  Extract a palette to preview swatches here.
                </p>
              )}
            </div>
          </section>
        </div>
      </div>

      <Dialog open={saveOpen} onOpenChange={setSaveOpen}>
        <DialogContent className="max-w-md p-6">
          <DialogHeader>
            <DialogTitle>Save as Style</DialogTitle>
            <DialogDescription>
              Name this palette. It will appear in Style Studio immediately.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="palette-style-name"
                className="text-[11px] uppercase tracking-wider text-muted-foreground"
              >
                Style name
              </label>
              <Input
                id="palette-style-name"
                value={styleName}
                onChange={(event) => setStyleName(event.target.value)}
                placeholder="Campaign palette"
              />
            </div>

            <div className="flex gap-2">
              {colors.slice(0, 5).map((hex) => (
                <span
                  key={`preview-${hex}`}
                  className="h-8 flex-1 rounded-md border border-border"
                  style={{ backgroundColor: hex }}
                  aria-hidden="true"
                />
              ))}
            </div>

            <Button
              variant="gradient"
              disabled={!styleName.trim() || colors.length === 0}
              onClick={handleSave}
            >
              <Save className="h-4 w-4" />
              Save style
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
