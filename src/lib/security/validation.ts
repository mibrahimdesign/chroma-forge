import type { GenerationMode, ShadeOverrideMap } from "@/lib/color/engine";
import { SHADE_NAMES, safeParseColor } from "@/lib/color/engine";

/**
 * Strict regex and parsing guards to prevent injection or DoS via malformed color strings.
 */

const SAFE_COLOR_PATTERN = /^[a-zA-Z0-9#,()%\s.]+$/;
const SAFE_GENERATION_MODES = new Set<GenerationMode>([
  "tailwind",
  "perceptual",
  "balanced",
  "vivid",
  "muted",
]);

export function isSafeColorString(input: string): boolean {
  if (typeof input !== "string") return false;
  if (input.length > 50) return false;

  return SAFE_COLOR_PATTERN.test(input);
}

export function sanitizeKey(input: string): string {
  if (typeof input !== "string") return "primary";

  const sanitized = input.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 20);
  return sanitized || "primary";
}

export function sanitizeGroupName(input: string): string {
  if (typeof input !== "string") return "Primary Blue";

  const normalized = input
    .replace(/[^\p{L}\p{N}\s_-]/gu, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 40);

  return normalized || "Primary Blue";
}

export function sanitizeThemeValue(input: string | null): "light" | "dark" | null {
  if (input === "light" || input === "dark") {
    return input;
  }

  return null;
}

export function sanitizeLanguageValue(input: string | null): "en" | "ar" | null {
  if (input === "en" || input === "ar") {
    return input;
  }

  return null;
}

export interface SafeColorConfig {
  id: string;
  baseColor: string;
  mode: GenerationMode;
  groupName: string;
  namingPrefix: string;
  shadeOverrides: ShadeOverrideMap;
}

function sanitizeShadeOverrides(input: unknown): ShadeOverrideMap {
  if (!input || typeof input !== "object") {
    return {};
  }

  const entries = Object.entries(input as Record<string, unknown>).filter(([key, value]) => {
    return SHADE_NAMES.includes(key) && typeof value === "string" && safeParseColor(value);
  });

  return Object.fromEntries(entries.map(([key, value]) => [key, safeParseColor(value as string)!.toHex()]));
}

export function sanitizeStoredColorConfig(
  input: unknown,
  fallback: SafeColorConfig
): SafeColorConfig {
  if (!input || typeof input !== "object") {
    return fallback;
  }

  const candidate = input as Partial<Record<keyof SafeColorConfig, unknown>>;
  
  const nextId =
    typeof candidate.id === "string" && candidate.id.length > 0 && candidate.id.length <= 50
      ? candidate.id
      : Math.random().toString(36).substring(2, 9);

  const nextBaseColor =
    typeof candidate.baseColor === "string" &&
    isSafeColorString(candidate.baseColor) &&
    safeParseColor(candidate.baseColor)
      ? safeParseColor(candidate.baseColor)?.toHex() ?? fallback.baseColor
      : fallback.baseColor;

  const nextMode =
    typeof candidate.mode === "string" && SAFE_GENERATION_MODES.has(candidate.mode as GenerationMode)
      ? (candidate.mode as GenerationMode)
      : fallback.mode;

  const nextPrefix =
    typeof candidate.namingPrefix === "string"
      ? sanitizeKey(candidate.namingPrefix)
      : fallback.namingPrefix;
  const nextGroupName =
    typeof candidate.groupName === "string"
      ? sanitizeGroupName(candidate.groupName)
      : fallback.groupName;
  const nextShadeOverrides = sanitizeShadeOverrides(candidate.shadeOverrides);

  return {
    id: nextId,
    baseColor: nextBaseColor,
    mode: nextMode,
    groupName: nextGroupName,
    namingPrefix: nextPrefix,
    shadeOverrides: nextShadeOverrides,
  };
}
