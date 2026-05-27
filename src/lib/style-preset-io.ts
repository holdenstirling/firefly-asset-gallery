import {
  DEFAULT_GENERATION_PARAMETERS,
  STYLE_PALETTES,
  TYPOGRAPHY_PAIRS,
  buildStudioStyle,
} from "@/lib/style-studio";
import {
  STYLE_PRESET_SCHEMA_VERSION,
  type GenerationParameters,
  type StudioStyle,
  type StylePaletteId,
  type StylePresetExport,
  type StylePresetImportError,
  type TypographyPairId,
} from "@/lib/types";

type Ok<T> = { ok: true; value: T };
type Err = { ok: false; error: StylePresetImportError };
export type ImportResult<T> = Ok<T> | Err;

const PALETTE_IDS = new Set<string>(STYLE_PALETTES.map((p) => p.id));
const TYPOGRAPHY_IDS = new Set<string>(TYPOGRAPHY_PAIRS.map((t) => t.id));

const ALLOWED_CONTENT_TYPES = new Set([
  "image",
  "vector",
  "3d",
  "video",
]);
const ALLOWED_ASPECT_RATIOS = new Set(["1:1", "4:3", "3:4", "16:9", "9:16"]);
const ALLOWED_STYLE_PRESETS = new Set([
  "photorealistic",
  "cinematic",
  "illustration",
  "3d-render",
  "watercolor",
  "neon",
  "minimal",
  "vintage",
]);
const ALLOWED_MODELS = new Set([
  "firefly-image-3",
  "firefly-image-2",
  "firefly-vector",
]);

function fail(
  code: StylePresetImportError["code"],
  message: string,
  field?: string,
): Err {
  return { ok: false, error: { code, message, field } };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function validateParameters(
  raw: unknown,
): ImportResult<GenerationParameters> {
  if (!isRecord(raw)) {
    return fail(
      "INVALID_PARAMETERS",
      "Field 'parameters' must be an object.",
      "parameters",
    );
  }

  const requiredStringFields: Array<
    [keyof GenerationParameters, Set<string>]
  > = [
    ["contentType", ALLOWED_CONTENT_TYPES],
    ["aspectRatio", ALLOWED_ASPECT_RATIOS],
    ["stylePreset", ALLOWED_STYLE_PRESETS],
    ["model", ALLOWED_MODELS],
  ];

  for (const [key, allowed] of requiredStringFields) {
    const candidate = raw[key];
    if (!isString(candidate)) {
      return fail(
        "INVALID_PARAMETERS",
        `parameters.${key} must be a string.`,
        `parameters.${key}`,
      );
    }
    if (!allowed.has(candidate)) {
      return fail(
        "INVALID_PARAMETERS",
        `parameters.${key} '${candidate}' is not one of: ${Array.from(
          allowed,
        ).join(", ")}.`,
        `parameters.${key}`,
      );
    }
  }

  for (const key of ["seed", "guidance", "steps"] as const) {
    if (!isFiniteNumber(raw[key])) {
      return fail(
        "INVALID_PARAMETERS",
        `parameters.${key} must be a finite number.`,
        `parameters.${key}`,
      );
    }
  }

  const params: GenerationParameters = {
    contentType: raw.contentType as GenerationParameters["contentType"],
    aspectRatio: raw.aspectRatio as GenerationParameters["aspectRatio"],
    stylePreset: raw.stylePreset as GenerationParameters["stylePreset"],
    model: raw.model as GenerationParameters["model"],
    seed: raw.seed as number,
    guidance: raw.guidance as number,
    steps: raw.steps as number,
  };

  return { ok: true, value: params };
}

/**
 * Serializes a StudioStyle into a portable JSON document. Strips identity
 * fields (id, createdAt, updatedAt) so the receiving side regenerates them
 * on import — that's what makes "import" semantically a *new* preset
 * rather than a sync.
 */
export function exportStylePreset(style: StudioStyle): StylePresetExport {
  return {
    schemaVersion: STYLE_PRESET_SCHEMA_VERSION,
    name: style.name,
    description: style.description,
    paletteId: style.paletteId,
    typographyId: style.typographyId,
    parameters: style.parameters,
  };
}

export function exportStylePresetToString(style: StudioStyle): string {
  return JSON.stringify(exportStylePreset(style), null, 2);
}

export function exportStylePresetFilename(style: StudioStyle): string {
  const slug = style.name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${slug || "untitled"}.style.json`;
}

/**
 * Parses + validates a JSON document into a StylePresetExport. Returns a
 * machine-readable error code on any failure so downstream callers (and
 * any future Slack-share flow) can render it however they want without
 * string-matching English.
 *
 * Runs synchronously on purpose: thrown errors from the JSON parser
 * surface immediately at the call site rather than via an unhandled
 * promise rejection.
 */
export function importStylePreset(
  source: string,
): ImportResult<StylePresetExport> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(source);
  } catch (err) {
    return fail(
      "INVALID_JSON",
      err instanceof Error ? err.message : "Could not parse JSON.",
    );
  }

  if (!isRecord(parsed)) {
    return fail("NOT_AN_OBJECT", "Top-level value must be a JSON object.");
  }

  if (parsed.schemaVersion !== STYLE_PRESET_SCHEMA_VERSION) {
    return fail(
      "UNSUPPORTED_SCHEMA_VERSION",
      `Expected schemaVersion '${STYLE_PRESET_SCHEMA_VERSION}', got '${String(
        parsed.schemaVersion,
      )}'.`,
      "schemaVersion",
    );
  }

  for (const field of ["name", "description"] as const) {
    if (!isString(parsed[field])) {
      return fail(
        "MISSING_FIELD",
        `Field '${field}' is required and must be a string.`,
        field,
      );
    }
  }

  if (!isString(parsed.paletteId)) {
    return fail(
      "MISSING_FIELD",
      "Field 'paletteId' is required and must be a string.",
      "paletteId",
    );
  }
  if (!PALETTE_IDS.has(parsed.paletteId)) {
    return fail(
      "INVALID_PALETTE_ID",
      `paletteId '${parsed.paletteId}' is not in the allowlist: ${Array.from(
        PALETTE_IDS,
      ).join(", ")}.`,
      "paletteId",
    );
  }

  if (!isString(parsed.typographyId)) {
    return fail(
      "MISSING_FIELD",
      "Field 'typographyId' is required and must be a string.",
      "typographyId",
    );
  }
  if (!TYPOGRAPHY_IDS.has(parsed.typographyId)) {
    return fail(
      "INVALID_TYPOGRAPHY_ID",
      `typographyId '${parsed.typographyId}' is not in the allowlist: ${Array.from(
        TYPOGRAPHY_IDS,
      ).join(", ")}.`,
      "typographyId",
    );
  }

  const params = validateParameters(parsed.parameters);
  if (!params.ok) return params;

  const exportRecord: StylePresetExport = {
    schemaVersion: STYLE_PRESET_SCHEMA_VERSION,
    name: parsed.name as string,
    description: parsed.description as string,
    paletteId: parsed.paletteId as StylePaletteId,
    typographyId: parsed.typographyId as TypographyPairId,
    parameters: params.value,
  };

  return { ok: true, value: exportRecord };
}

/**
 * Resolves the final preset name given the names already in use on this
 * device. Naming collisions get a deterministic suffix — "Launch Glow",
 * "Launch Glow (imported)", "Launch Glow (imported 2)", etc. — so the
 * import never silently overwrites a saved preset.
 */
export function resolveImportedPresetName(
  desired: string,
  existingNames: readonly string[],
): string {
  const existing = new Set(existingNames);
  if (!existing.has(desired)) return desired;

  const base = `${desired} (imported)`;
  if (!existing.has(base)) return base;

  for (let i = 2; i < 1000; i += 1) {
    const candidate = `${desired} (imported ${i})`;
    if (!existing.has(candidate)) return candidate;
  }
  // Fallback that should be unreachable in practice.
  return `${desired} (imported ${Date.now()})`;
}

/**
 * Convenience: parse + validate + resolve a unique name + materialize as a
 * fresh StudioStyle (new id, new timestamps). Returns either the new
 * StudioStyle (not yet persisted) or a validation error.
 *
 * Callers wire the success result into useStyleStudioStore.saveStyle.
 */
export function importStudioStyleFromString(
  source: string,
  existingNames: readonly string[],
  now: string = new Date().toISOString(),
): ImportResult<StudioStyle> {
  const parsed = importStylePreset(source);
  if (!parsed.ok) return parsed;

  const resolvedName = resolveImportedPresetName(
    parsed.value.name,
    existingNames,
  );

  const style = buildStudioStyle({
    name: resolvedName,
    description: parsed.value.description,
    paletteId: parsed.value.paletteId,
    typographyId: parsed.value.typographyId,
    parameters: parsed.value.parameters,
    now,
  });

  return { ok: true, value: style };
}

// Re-exported so the unit tests don't have to import DEFAULT_GENERATION_PARAMETERS
// from two places to build fixtures.
export { DEFAULT_GENERATION_PARAMETERS };
