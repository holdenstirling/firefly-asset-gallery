"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  Copy,
  Palette,
  RefreshCcw,
  Save,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { picsumUrl } from "@/lib/picsum";
import {
  downsampleToImageData,
  extractDominantColors,
} from "@/lib/palette-extraction";
import { useStyleStudioStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const DEFAULT_PICSUM_URL = picsumUrl({
  seed: "palette-extractor-hero",
  width: 1024,
  height: 1024,
});

const SWATCH_COUNTS = [3, 5, 7] as const;
type SwatchCount = (typeof SWATCH_COUNTS)[number];

type ExtractionStatus = "idle" | "loading" | "ready" | "error";

interface SavedStyleRef {
  id: string;
  name: string;
}

export default function PaletteExtractorPage() {
  const addStyleFromPalette = useStyleStudioStore(
    (state) => state.addStyleFromPalette
  );

  const [urlInput, setUrlInput] = useState(DEFAULT_PICSUM_URL);
  const [activeUrl, setActiveUrl] = useState(DEFAULT_PICSUM_URL);
  const [swatchCount, setSwatchCount] = useState<SwatchCount>(5);
  const [palette, setPalette] = useState<string[]>([]);
  const [status, setStatus] = useState<ExtractionStatus>("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [savedStyle, setSavedStyle] = useState<SavedStyleRef | null>(null);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [styleName, setStyleName] = useState("Extracted Style");
  // Increments on each extract request. Lets the load effect re-fire even when
  // activeUrl + swatchCount are unchanged (Retry after an error case).
  const [reloadToken, setReloadToken] = useState(0);

  const imageRef = useRef<HTMLImageElement | null>(null);
  const styleNameInputId = useId();

  useEffect(() => {
    let cancelled = false;

    const image = new Image();
    image.crossOrigin = "anonymous";

    image.onload = () => {
      if (cancelled) return;
      const imageData = downsampleToImageData(image, 96);
      if (!imageData) {
        setStatus("error");
        setErrorMessage(
          "Unable to read pixels from this image. The host may not allow cross-origin reads."
        );
        return;
      }
      const extracted = extractDominantColors(imageData, swatchCount);
      if (extracted.length === 0) {
        setStatus("error");
        setErrorMessage("No opaque pixels were found in this image.");
        return;
      }
      setPalette(extracted);
      setStatus("ready");
    };

    image.onerror = () => {
      if (cancelled) return;
      setStatus("error");
      setErrorMessage(
        "Could not load the image. Double-check the URL and try again."
      );
    };

    image.src = activeUrl;
    imageRef.current = image;

    return () => {
      cancelled = true;
    };
  }, [activeUrl, swatchCount, reloadToken]);

  const beginExtraction = () => {
    setStatus("loading");
    setErrorMessage("");
    setSavedStyle(null);
    setReloadToken((token) => token + 1);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    setActiveUrl(trimmed);
    beginExtraction();
  };

  const handleSwatchCountChange = (value: string) => {
    setSwatchCount(Number(value) as SwatchCount);
    beginExtraction();
  };

  const handleRetry = () => {
    beginExtraction();
  };

  const handleCopy = async (hex: string, index: number) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopiedIndex(index);
      window.setTimeout(() => {
        setCopiedIndex((current) => (current === index ? null : current));
      }, 1200);
    } catch {
      // Clipboard write can fail in non-secure contexts. Surface no error UI;
      // the swatch hex is visible inline so the user can copy manually.
    }
  };

  const handleSave = () => {
    const name = styleName.trim() || "Extracted Style";
    const saved = addStyleFromPalette({ name, palette });
    setSavedStyle({ id: saved.id, name: saved.name });
    setSaveDialogOpen(false);
  };

  const canSave = status === "ready" && palette.length > 0;

  return (
    <div className="flex h-screen flex-col">
      <header className="flex shrink-0 items-center justify-between border-b border-border px-6 py-4">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-semibold tracking-tight">
            <Palette className="h-5 w-5 text-primary" />
            Palette Extractor
            <span className="ml-1 rounded-full firefly-gradient px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
              New
            </span>
          </h1>
          <p className="text-xs text-muted-foreground">
            Paste any image URL — pull dominant colors, save as a Style preset.
          </p>
        </div>
        <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="gradient" size="sm" disabled={!canSave}>
              <Save className="h-4 w-4" />
              Save as Style
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md p-6">
            <DialogHeader>
              <DialogTitle>Save extracted palette</DialogTitle>
              <DialogDescription>
                Give this palette a name. It will appear in Style Studio
                immediately.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-2 pt-2">
              <label
                htmlFor={styleNameInputId}
                className="text-[11px] uppercase tracking-wider text-muted-foreground"
              >
                Style name
              </label>
              <Input
                id={styleNameInputId}
                value={styleName}
                onChange={(event) => setStyleName(event.target.value)}
                autoFocus
                placeholder="Extracted Style"
              />
              <div className="mt-3 flex overflow-hidden rounded-md border border-border">
                {palette.map((hex) => (
                  <span
                    key={hex}
                    className="h-8 flex-1"
                    style={{ backgroundColor: hex }}
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSaveDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="gradient" size="sm" onClick={handleSave}>
                <Sparkles className="h-4 w-4" />
                Save Style
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </header>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-6 py-6">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-end"
          >
            <div className="flex flex-1 flex-col gap-1.5">
              <label
                htmlFor="palette-url-input"
                className="text-[11px] uppercase tracking-wider text-muted-foreground"
              >
                Image URL
              </label>
              <Input
                id="palette-url-input"
                value={urlInput}
                onChange={(event) => setUrlInput(event.target.value)}
                placeholder="https://..."
                inputMode="url"
              />
            </div>
            <div className="flex flex-col gap-1.5 sm:w-48">
              <label
                htmlFor="palette-swatch-count"
                className="text-[11px] uppercase tracking-wider text-muted-foreground"
              >
                Swatches
              </label>
              <Select
                value={String(swatchCount)}
                onValueChange={handleSwatchCountChange}
              >
                <SelectTrigger id="palette-swatch-count" aria-label="Swatches">
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
            <Button type="submit" variant="gradient" size="default">
              <Sparkles className="h-4 w-4" />
              Extract palette
            </Button>
          </form>

          {savedStyle && (
            <div className="flex items-center justify-between gap-3 rounded-lg border border-primary/40 bg-primary/10 px-4 py-3 text-sm">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>
                  Saved <span className="font-semibold">{savedStyle.name}</span>{" "}
                  to Style Studio.
                </span>
              </div>
              <Link
                href="/style-studio"
                className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                Open Style Studio
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <header className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold">Source image</h2>
                {status === "error" && (
                  <Button variant="outline" size="sm" onClick={handleRetry}>
                    <RefreshCcw className="h-3.5 w-3.5" />
                    Try again
                  </Button>
                )}
              </header>
              <div className="relative overflow-hidden rounded-lg border border-border bg-background/40">
                {status === "loading" && (
                  <div
                    role="status"
                    aria-label="Loading image"
                    className="shimmer aspect-square w-full"
                  />
                )}
                {status === "error" && (
                  <div className="flex aspect-square w-full flex-col items-center justify-center gap-2 p-6 text-center">
                    <AlertTriangle className="h-6 w-6 text-destructive" />
                    <p className="text-sm font-medium">
                      Could not load this image
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {errorMessage}
                    </p>
                  </div>
                )}
                {status === "ready" && (
                  // We display the same URL the extractor read. Plain <img> here
                  // (rather than next/image) because we already have the loaded
                  // browser image; next/image would require remote-host config
                  // for arbitrary URLs.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={activeUrl}
                    alt="Source for palette extraction"
                    className="aspect-square w-full object-cover"
                  />
                )}
              </div>
            </section>

            <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <header className="mb-3">
                <h2 className="text-sm font-semibold">Extracted palette</h2>
                <p className="text-xs text-muted-foreground">
                  Top {swatchCount} colors, dominant first. Click any swatch to
                  copy.
                </p>
              </header>

              {status === "loading" && (
                <div
                  role="status"
                  aria-label="Extracting palette"
                  className="flex flex-col gap-2"
                >
                  {Array.from({ length: swatchCount }).map((_, index) => (
                    <div
                      key={index}
                      className="shimmer h-12 w-full rounded-md"
                    />
                  ))}
                </div>
              )}

              {status === "error" && (
                <p className="text-xs text-muted-foreground">
                  Palette will appear here after a successful extraction.
                </p>
              )}

              {status === "ready" && (
                <ul className="flex flex-col gap-2">
                  {palette.map((hex, index) => (
                    <li key={`${hex}-${index}`}>
                      <button
                        type="button"
                        onClick={() => handleCopy(hex, index)}
                        className="group flex w-full items-center gap-3 rounded-md border border-border bg-background/40 p-2 text-left transition-colors hover:border-primary/60"
                        aria-label={`Copy ${hex}`}
                      >
                        <span
                          className="h-9 w-9 shrink-0 rounded-md border border-border"
                          style={{ backgroundColor: hex }}
                        />
                        <span className="flex flex-1 items-center justify-between">
                          <span className="font-mono text-xs">{hex}</span>
                          <span
                            className={cn(
                              "flex items-center gap-1 text-[11px] text-muted-foreground transition-opacity",
                              copiedIndex === index
                                ? "text-primary opacity-100"
                                : "opacity-0 group-hover:opacity-100"
                            )}
                          >
                            {copiedIndex === index ? (
                              <>
                                <Check className="h-3.5 w-3.5" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="h-3.5 w-3.5" />
                                Copy
                              </>
                            )}
                          </span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
