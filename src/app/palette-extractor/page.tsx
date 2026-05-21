"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Copy, Palette, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { extractDominantColors } from "@/lib/palette-extraction";
import { picsumUrl } from "@/lib/picsum";
import { useStyleStudioStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const DEFAULT_IMAGE_URL = picsumUrl({
  seed: "palette-extractor-hero",
  width: 1024,
  height: 768,
});
const SWATCH_COUNTS = [3, 5, 7] as const;

type LoadStatus = "idle" | "loading" | "ready" | "error";

export default function PaletteExtractorPage() {
  const addStyleFromPalette = useStyleStudioStore((s) => s.addStyleFromPalette);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [url, setUrl] = useState(DEFAULT_IMAGE_URL);
  const [swatchCount, setSwatchCount] = useState<(typeof SWATCH_COUNTS)[number]>(5);
  const [status, setStatus] = useState<LoadStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [swatches, setSwatches] = useState<string[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [styleName, setStyleName] = useState("Extracted Palette");
  const [savedStyleId, setSavedStyleId] = useState<string | null>(null);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const extractPalette = useCallback(
    async (
      nextUrl: string,
      nextSwatchCount: (typeof SWATCH_COUNTS)[number]
    ) => {
      const trimmedUrl = nextUrl.trim();
      if (!trimmedUrl) {
        setStatus("error");
        setErrorMessage("Enter an image URL to extract a palette.");
        setSwatches([]);
        setPreviewUrl(null);
        return;
      }

      setStatus("loading");
      setErrorMessage("");
      setSwatches([]);
      setPreviewUrl(null);
      setSavedStyleId(null);

      await new Promise<void>((resolve) => {
        const image = new window.Image();
        image.crossOrigin = "anonymous";

        image.onload = () => {
          try {
            const canvas = canvasRef.current;
            if (!canvas) {
              setStatus("error");
              setErrorMessage("Canvas is unavailable. Reload the page and try again.");
              resolve();
              return;
            }

            canvas.width = image.naturalWidth;
            canvas.height = image.naturalHeight;

            const context = canvas.getContext("2d");
            if (!context) {
              setStatus("error");
              setErrorMessage("Canvas is unavailable. Reload the page and try again.");
              resolve();
              return;
            }

            context.drawImage(image, 0, 0);
            const imageData = context.getImageData(
              0,
              0,
              image.naturalWidth,
              image.naturalHeight
            );
            const extracted = extractDominantColors(imageData, nextSwatchCount);

            setSwatches(extracted);
            setPreviewUrl(trimmedUrl);
            setStatus("ready");
          } catch {
            setStatus("error");
            setErrorMessage(
              "Could not read pixel data from this image. It may be blocked by CORS."
            );
          }

          resolve();
        };

        image.onerror = () => {
          setStatus("error");
          setErrorMessage("Could not load this image URL. Check the link and try again.");
          resolve();
        };

        image.src = trimmedUrl;
      });
    },
    []
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void extractPalette(DEFAULT_IMAGE_URL, 5);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [extractPalette]);

  const handleCopy = async (hex: string) => {
    await navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    window.setTimeout(() => setCopiedHex(null), 1500);
  };

  const handleSave = () => {
    if (swatches.length === 0) {
      return;
    }

    const style = addStyleFromPalette({ name: styleName, swatches });
    setSavedStyleId(style.id);
  };

  const isLoading = status === "loading";

  return (
    <div className="flex h-screen flex-col">
      <header className="flex shrink-0 items-center justify-between border-b border-border px-6 py-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Palette Extractor
            <span className="ml-2 rounded-full firefly-gradient px-2 py-0.5 align-middle text-[10px] font-semibold uppercase tracking-wider text-white">
              HOL-7
            </span>
          </h1>
          <p className="text-xs text-muted-foreground">
            Pull dominant colors from any image URL and save them as a Style preset.
          </p>
        </div>
      </header>

      <div className="grid flex-1 grid-cols-1 gap-6 overflow-y-auto p-6 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <SectionTitle
            icon={<Palette className="h-4 w-4" />}
            title="Source image"
            body="Paste a URL, then extract a palette from the rendered pixels."
          />

          {isLoading ? (
            <div className="mt-4 aspect-[4/3] animate-pulse rounded-xl bg-muted" />
          ) : previewUrl ? (
            <div className="relative mt-4 aspect-[4/3] overflow-hidden rounded-xl border border-border">
              <Image
                src={previewUrl}
                alt="Source image for palette extraction"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                unoptimized
              />
            </div>
          ) : (
            <div className="mt-4 flex aspect-[4/3] items-center justify-center rounded-xl border border-dashed border-border bg-background/40 px-6 text-center text-sm text-muted-foreground">
              {status === "error" ? errorMessage : "Extract a palette to preview the source image."}
            </div>
          )}
        </section>

        <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <SectionTitle
            icon={<Sparkles className="h-4 w-4" />}
            title="Extracted palette"
            body="Copy swatches or save the palette as a Style Studio preset."
          />

          <div className="mt-5 flex flex-col gap-4">
            <Field label="Image URL">
              <Input value={url} onChange={(event) => setUrl(event.target.value)} />
            </Field>

            <Field label="Swatch count">
              <div className="grid grid-cols-3 gap-1.5">
                {SWATCH_COUNTS.map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => {
                      setSwatchCount(count);
                      if (status !== "idle") {
                        void extractPalette(url, count);
                      }
                    }}
                    className={cn(
                      "rounded-md border px-1.5 py-1 text-[11px] transition-colors",
                      swatchCount === count
                        ? "border-transparent firefly-gradient text-white"
                        : "border-border bg-background/40 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </Field>

            <Button variant="gradient" onClick={() => void extractPalette(url, swatchCount)}>
              Extract palette
            </Button>

            {status === "error" && previewUrl === null && (
              <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {errorMessage}
              </p>
            )}

            {isLoading ? (
              <div className="flex gap-2">
                {Array.from({ length: swatchCount }).map((_, index) => (
                  <div
                    key={index}
                    className="h-16 flex-1 animate-pulse rounded-lg bg-muted"
                  />
                ))}
              </div>
            ) : swatches.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {swatches.map((hex) => (
                  <SwatchCard
                    key={hex}
                    hex={hex}
                    copied={copiedHex === hex}
                    onCopy={() => void handleCopy(hex)}
                  />
                ))}
              </div>
            ) : null}

            <Field label="Style name">
              <Input
                value={styleName}
                onChange={(event) => setStyleName(event.target.value)}
              />
            </Field>

            <Button
              variant="outline"
              onClick={handleSave}
              disabled={swatches.length === 0 || isLoading}
            >
              Save as Style
            </Button>

            {savedStyleId && (
              <p className="rounded-lg border border-border bg-background/50 px-3 py-2 text-sm text-muted-foreground">
                Saved to Style Studio.{" "}
                <Link href="/style-studio" className="font-medium text-primary hover:underline">
                  Open Style Studio
                </Link>{" "}
                to review the preset. Available in Style Studio. Use Apply there to push it to
                the gallery.
              </p>
            )}
          </div>
        </section>
      </div>

      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />
    </div>
  );
}

function SwatchCard({
  hex,
  copied,
  onCopy,
}: {
  hex: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-background/50">
      <div className="h-16" style={{ backgroundColor: hex }} />
      <div className="flex items-center justify-between gap-2 px-3 py-2">
        <span className="font-mono text-xs text-muted-foreground">{hex}</span>
        <Button variant="ghost" size="icon" onClick={onCopy} aria-label={`Copy ${hex}`}>
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}

function SectionTitle({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
        {icon}
      </div>
      <div>
        <h2 className="text-sm font-semibold">{title}</h2>
        <p className="text-xs text-muted-foreground">{body}</p>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}
