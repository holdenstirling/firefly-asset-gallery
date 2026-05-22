"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  Check,
  Copy,
  Download,
  Layers,
  Palette,
  Plus,
  Sparkles,
  Trash2,
  Wand2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useGalleryStore, useStyleStudioStore } from "@/lib/store";
import {
  buildStudioStyle,
  DEFAULT_GENERATION_PARAMETERS,
  dimensionsForAspectRatio,
  getStylePalette,
  getTypographyPair,
  STYLE_PALETTES,
  styleToCssTokens,
  styleToJsonTokens,
  TYPOGRAPHY_PAIRS,
} from "@/lib/style-studio";
import { picsumUrl } from "@/lib/picsum";
import { cn } from "@/lib/utils";
import type {
  AspectRatio,
  ContentType,
  GenerationParameters,
  StudioStyle,
  StylePaletteId,
  StylePreset,
  TypographyPairId,
} from "@/lib/types";

const CONTENT_TYPES: ContentType[] = ["image", "vector", "3d", "video"];
const ASPECT_RATIOS: AspectRatio[] = ["1:1", "4:3", "3:4", "16:9", "9:16"];
const STYLE_PRESETS: StylePreset[] = [
  "photorealistic",
  "cinematic",
  "illustration",
  "3d-render",
  "watercolor",
  "neon",
  "minimal",
  "vintage",
];
const MODELS: GenerationParameters["model"][] = [
  "firefly-image-3",
  "firefly-image-2",
  "firefly-vector",
];

type ExportFormat = "json" | "css";

export default function StyleStudioPage() {
  const galleryParameters = useGalleryStore((s) => s.parameters);
  const galleryActiveStyleId = useGalleryStore((s) => s.activeStudioStyleId);
  const applyStudioStyle = useGalleryStore((s) => s.applyStudioStyle);
  const styles = useStyleStudioStore((s) => s.styles);
  const activeStyleId = useStyleStudioStore((s) => s.activeStyleId);
  const saveStyle = useStyleStudioStore((s) => s.saveStyle);
  const deleteStyle = useStyleStudioStore((s) => s.deleteStyle);
  const setActiveStyleId = useStyleStudioStore((s) => s.setActiveStyleId);

  const [name, setName] = useState("Campaign Style");
  const [description, setDescription] = useState(
    "Reusable art direction for the next asset batch."
  );
  const [paletteId, setPaletteId] = useState<StylePaletteId>("firefly");
  const [typographyId, setTypographyId] =
    useState<TypographyPairId>("product");
  const [draftParameters, setDraftParameters] = useState<GenerationParameters>(
    galleryParameters ?? DEFAULT_GENERATION_PARAMETERS
  );
  const [exportFormat, setExportFormat] = useState<ExportFormat>("json");
  const [copied, setCopied] = useState(false);

  const activeStyle = useMemo(
    () => styles.find((style) => style.id === activeStyleId) ?? styles[0] ?? null,
    [activeStyleId, styles]
  );
  const palette = getStylePalette(paletteId);
  const typography = getTypographyPair(typographyId);
  const exportStyle = activeStyle ?? null;
  const exportValue = exportStyle
    ? exportFormat === "json"
      ? styleToJsonTokens(exportStyle)
      : styleToCssTokens(exportStyle)
    : "Save a style to export design tokens.";

  const setDraftParameter = <K extends keyof GenerationParameters>(
    key: K,
    value: GenerationParameters[K]
  ) => {
    setDraftParameters((current) => ({ ...current, [key]: value }));
  };

  const handleSave = () => {
    const style = buildStudioStyle({
      name,
      description,
      paletteId,
      typographyId,
      parameters: draftParameters,
    });
    saveStyle(style);
    applyStudioStyle(style);
  };

  const handleApply = (style: StudioStyle) => {
    setActiveStyleId(style.id);
    applyStudioStyle(style);
  };

  const handleLoad = (style: StudioStyle) => {
    setActiveStyleId(style.id);
    setName(style.name);
    setDescription(style.description);
    setPaletteId(style.paletteId);
    setTypographyId(style.typographyId);
    setDraftParameters(style.parameters);
  };

  const handleNew = () => {
    setActiveStyleId(null);
    setName("Campaign Style");
    setDescription("Reusable art direction for the next asset batch.");
    setPaletteId("firefly");
    setTypographyId("product");
    setDraftParameters(galleryParameters);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(exportValue);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex h-screen flex-col">
      <header className="flex shrink-0 items-center justify-between border-b border-border px-6 py-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Style Studio
            <span className="ml-2 rounded-full firefly-gradient px-2 py-0.5 align-middle text-[10px] font-semibold uppercase tracking-wider text-white">
              LIN-123
            </span>
          </h1>
          <p className="text-xs text-muted-foreground">
            Define reusable style presets that auto-apply to every generation.
          </p>
        </div>
        <Button variant="gradient" size="sm" onClick={handleSave}>
          <Sparkles className="h-4 w-4" />
          Save and apply
        </Button>
      </header>

      <div className="grid flex-1 grid-cols-1 overflow-hidden xl:grid-cols-[22rem_1fr_24rem]">
        <aside className="border-b border-border bg-card/30 p-4 xl:border-b-0 xl:border-r xl:overflow-y-auto xl:scrollbar-thin">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Saved styles
              </h2>
              <p className="text-xs text-muted-foreground">
                Persisted locally in this browser.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={handleNew}>
              <Plus className="h-4 w-4" />
              New
            </Button>
          </div>

          <div className="flex flex-col gap-3">
            {styles.map((style) => (
              <StyleCard
                key={style.id}
                style={style}
                selected={style.id === activeStyleId}
                applied={style.id === galleryActiveStyleId}
                onLoad={() => handleLoad(style)}
                onApply={() => handleApply(style)}
                onDelete={() => deleteStyle(style.id)}
              />
            ))}
          </div>
        </aside>

        <main className="overflow-y-auto scrollbar-thin px-6 py-5">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <SectionTitle
                icon={<Palette className="h-4 w-4" />}
                title="Style definition"
                body="Bundle brand choices with generation defaults."
              />

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field label="Name">
                  <Input value={name} onChange={(event) => setName(event.target.value)} />
                </Field>
                <Field label="Content type">
                  <Select
                    value={draftParameters.contentType}
                    onValueChange={(value) =>
                      setDraftParameter("contentType", value as ContentType)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CONTENT_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Description" className="sm:col-span-2">
                  <Input
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                  />
                </Field>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {STYLE_PALETTES.map((option) => (
                  <PaletteOption
                    key={option.id}
                    selected={option.id === paletteId}
                    palette={option}
                    onSelect={() => setPaletteId(option.id)}
                  />
                ))}
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {TYPOGRAPHY_PAIRS.map((option) => (
                  <TypographyOption
                    key={option.id}
                    selected={option.id === typographyId}
                    pair={option}
                    onSelect={() => setTypographyId(option.id)}
                  />
                ))}
              </div>
            </section>

            <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <SectionTitle
                icon={<Wand2 className="h-4 w-4" />}
                title="Generation defaults"
                body="These values are pushed to the gallery when applied."
              />

              <div className="mt-5 flex flex-col gap-4">
                <Field label="Style preset">
                  <Select
                    value={draftParameters.stylePreset}
                    onValueChange={(value) =>
                      setDraftParameter("stylePreset", value as StylePreset)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STYLE_PRESETS.map((style) => (
                        <SelectItem key={style} value={style}>
                          {style}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field label="Aspect ratio">
                  <div className="grid grid-cols-5 gap-1.5">
                    {ASPECT_RATIOS.map((aspectRatio) => (
                      <button
                        key={aspectRatio}
                        type="button"
                        onClick={() => setDraftParameter("aspectRatio", aspectRatio)}
                        className={cn(
                          "rounded-md border px-1.5 py-1 text-[11px] transition-colors",
                          draftParameters.aspectRatio === aspectRatio
                            ? "border-transparent firefly-gradient text-white"
                            : "border-border bg-background/40 text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {aspectRatio}
                      </button>
                    ))}
                  </div>
                </Field>

                <Field label="Model">
                  <Select
                    value={draftParameters.model}
                    onValueChange={(value) =>
                      setDraftParameter(
                        "model",
                        value as GenerationParameters["model"]
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MODELS.map((model) => (
                        <SelectItem key={model} value={model}>
                          {model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field label="Guidance" hint={draftParameters.guidance.toFixed(1)}>
                  <Slider
                    value={[draftParameters.guidance]}
                    onValueChange={([value]) => setDraftParameter("guidance", value)}
                    min={1}
                    max={15}
                    step={0.5}
                  />
                </Field>

                <Field label="Steps" hint={String(draftParameters.steps)}>
                  <Slider
                    value={[draftParameters.steps]}
                    onValueChange={([value]) => setDraftParameter("steps", value)}
                    min={10}
                    max={60}
                    step={1}
                  />
                </Field>

                <Field label="Seed">
                  <Input
                    type="number"
                    value={draftParameters.seed}
                    onChange={(event) =>
                      setDraftParameter(
                        "seed",
                        Number.parseInt(event.target.value, 10) || 0
                      )
                    }
                  />
                </Field>
              </div>
            </section>
          </div>

          <section className="mt-5 rounded-xl border border-border bg-card p-5 shadow-sm">
            <SectionTitle
              icon={<Layers className="h-4 w-4" />}
              title="Live preview"
              body="Picsum-backed mock generations using the current draft style."
            />
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {[0, 1, 2].map((offset) => (
                <PreviewCard
                  key={offset}
                  seed={`${paletteId}-${typographyId}-${draftParameters.seed + offset}`}
                  parameters={draftParameters}
                  label={offset === 0 ? palette.name : typography.name}
                />
              ))}
            </div>
          </section>
        </main>

        <aside className="border-t border-border bg-card/30 p-4 xl:border-l xl:border-t-0 xl:overflow-y-auto xl:scrollbar-thin">
          <SectionTitle
            icon={<Download className="h-4 w-4" />}
            title="Export tokens"
            body="Copy the active style as JSON or CSS custom properties."
          />

          <div className="mt-4 flex gap-2">
            <Button
              variant={exportFormat === "json" ? "default" : "outline"}
              size="sm"
              onClick={() => setExportFormat("json")}
            >
              JSON
            </Button>
            <Button
              variant={exportFormat === "css" ? "default" : "outline"}
              size="sm"
              onClick={() => setExportFormat("css")}
            >
              CSS
            </Button>
          </div>

          <textarea
            readOnly
            value={exportValue}
            className="mt-3 h-80 w-full resize-none rounded-lg border border-border bg-background/70 p-3 font-mono text-xs text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            disabled={!exportStyle}
            className="mt-3 w-full"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy tokens"}
          </Button>
        </aside>
      </div>
    </div>
  );
}

function StyleCard({
  style,
  selected,
  applied,
  onLoad,
  onApply,
  onDelete,
}: {
  style: StudioStyle;
  selected: boolean;
  applied: boolean;
  onLoad: () => void;
  onApply: () => void;
  onDelete: () => void;
}) {
  const palette = getStylePalette(style.paletteId);
  const typography = getTypographyPair(style.typographyId);

  return (
    <div
      className={cn(
        "rounded-xl border bg-background/50 p-3 transition-colors",
        selected ? "border-primary/60" : "border-border"
      )}
    >
      <button type="button" onClick={onLoad} className="w-full text-left">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold">{style.name}</h3>
              {applied && <Badge variant="muted">Applied</Badge>}
            </div>
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
              {style.description || "No description"}
            </p>
          </div>
          <div className="flex shrink-0 overflow-hidden rounded-full border border-border">
            {palette.swatchClasses.map((swatch) => (
              <span key={swatch} className={cn("h-5 w-5", swatch)} />
            ))}
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] text-muted-foreground">
          <span>{palette.name}</span>
          <span>/</span>
          <span>{typography.name}</span>
          <span>/</span>
          <span>{style.parameters.aspectRatio}</span>
        </div>
      </button>
      <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
        <Button variant="outline" size="sm" onClick={onApply}>
          Apply
        </Button>
        <Button variant="ghost" size="icon" onClick={onDelete} aria-label="Delete style">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function PaletteOption({
  palette,
  selected,
  onSelect,
}: {
  palette: (typeof STYLE_PALETTES)[number];
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "rounded-xl border p-3 text-left transition-colors",
        selected
          ? "border-primary/60 bg-primary/10"
          : "border-border bg-background/40 hover:border-primary/40"
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-medium">{palette.name}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{palette.description}</p>
        </div>
        <div className="flex overflow-hidden rounded-full border border-border">
          {palette.swatchClasses.map((swatch) => (
            <span key={swatch} className={cn("h-7 w-7", swatch)} />
          ))}
        </div>
      </div>
    </button>
  );
}

function TypographyOption({
  pair,
  selected,
  onSelect,
}: {
  pair: (typeof TYPOGRAPHY_PAIRS)[number];
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "rounded-xl border p-3 text-left transition-colors",
        selected
          ? "border-primary/60 bg-primary/10"
          : "border-border bg-background/40 hover:border-primary/40"
      )}
    >
      <h3 className="text-sm font-medium">{pair.name}</h3>
      <p className="mt-1 text-xs text-muted-foreground">{pair.description}</p>
      <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-muted-foreground">
        <span>{pair.heading}</span>
        <span>{pair.body}</span>
      </div>
    </button>
  );
}

function PreviewCard({
  seed,
  parameters,
  label,
}: {
  seed: string;
  parameters: GenerationParameters;
  label: string;
}) {
  const dimensions = dimensionsForAspectRatio(parameters.aspectRatio);
  const aspectClass =
    parameters.aspectRatio === "16:9"
      ? "aspect-video"
      : parameters.aspectRatio === "9:16"
        ? "aspect-[9/16]"
        : parameters.aspectRatio === "4:3"
          ? "aspect-[4/3]"
          : parameters.aspectRatio === "3:4"
            ? "aspect-[3/4]"
            : "aspect-square";

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-background/50">
      <div className={cn("relative", aspectClass)}>
        <Image
          src={picsumUrl({
            seed,
            width: dimensions.width,
            height: dimensions.height,
          })}
          alt={`${label} preview`}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
      </div>
      <div className="flex items-center justify-between px-3 py-2 text-xs text-muted-foreground">
        <span>{label}</span>
        <span>{parameters.stylePreset}</span>
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
  hint,
  className,
  children,
}: {
  label: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-center justify-between">
        <label className="text-[11px] uppercase tracking-wider text-muted-foreground">
          {label}
        </label>
        {hint && <span className="font-mono text-[11px] text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </div>
  );
}
