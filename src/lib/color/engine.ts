import { colord, extend, AnyColor, Colord } from "colord";
import mixPlugin from "colord/plugins/mix";
import namesPlugin from "colord/plugins/names";
import a11yPlugin from "colord/plugins/a11y";

extend([mixPlugin, namesPlugin, a11yPlugin]);

export interface ColorShade {
  name: string; // e.g. "50", "100"
  hex: string;
  rgb: string;
  hsl: string;
  isLight: boolean;
  contrastWithWhite: number;
  contrastWithBlack: number;
}

export type ShadeOverrideMap = Partial<Record<string, string>>;

export type GenerationMode = "tailwind" | "perceptual" | "balanced" | "vivid" | "muted";

export const SHADE_NAMES = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"];

/**
 * Safely parses any color input into a valid colord instance, or null if invalid.
 */
export function safeParseColor(input: AnyColor | string): Colord | null {
  try {
    const c = colord(input);
    return c.isValid() ? c : null;
  } catch {
    return null;
  }
}

/**
 * Normalizes an array of Colords to our standard Shade objects
 */
export function createShade(name: string, input: AnyColor | string | Colord): ColorShade | null {
  const color = input instanceof Colord ? input : safeParseColor(input);
  if (!color) return null;

  return {
    name,
    hex: color.toHex(),
    rgb: color.toRgbString(),
    hsl: color.toHslString(),
    isLight: color.isLight(),
    contrastWithWhite: color.contrast("#ffffff"),
    contrastWithBlack: color.contrast("#000000"),
  };
}

function toShades(colors: Colord[]): ColorShade[] {
  return colors.map((c, i) => {
    return createShade(SHADE_NAMES[i] || `${i * 100}`, c)!;
  });
}

/**
 * Generate a standard palette by mix-weighting to black and white
 * with some saturation/lightness tweaks depending on the mode.
 */
export function generatePalette(baseColor: string, mode: GenerationMode = "tailwind"): ColorShade[] {
  const c = safeParseColor(baseColor);
  if (!c) return [];

  // 500 is our base
  const hsl = c.toHsl();
  
  // A standard approach is generating relative to a white/light point and a black/dark point.
  // We'll calculate an array of 11 colors [50..950]
  
  const whitePoint = mode === "muted" ? "#fbfbfb" : "#ffffff";
  const blackPoint = mode === "muted" ? "#111111" : "#000000";

  // Weights for each shade name (0-1 from white to color for < 500, 0-1 from color to black for > 500)
  // 50: 95% white, 5% color
  const lightWeights = [0.95, 0.85, 0.70, 0.50, 0.30]; // 50, 100, 200, 300, 400
  // 500: 100% color
  const darkWeights = [0.20, 0.40, 0.60, 0.75, 0.90]; // 600, 700, 800, 900, 950

  const shadesColord: Colord[] = [];

  // Generate lighter shades
  for (const w of lightWeights) {
    let mixed = colord(whitePoint).mix(c, 1 - w); // e.g. w=0.95 means 95% white, 5% color
    if (mode === "vivid") {
      mixed = colord({ ...mixed.toHsl(), s: Math.min(100, mixed.toHsl().s + 10) });
    }
    shadesColord.push(mixed);
  }

  // 500
  let modeBase = c;
  if (mode === "vivid") {
    modeBase = colord({ ...hsl, s: Math.min(100, hsl.s + 15) });
  } else if (mode === "muted") {
    modeBase = colord({ ...hsl, s: Math.max(0, hsl.s - 20) });
  }
  shadesColord.push(modeBase);

  // Generate darker shades
  for (const w of darkWeights) {
    let mixed = c.mix(blackPoint, w); 
    if (mode === "vivid") {
       mixed = colord({ ...mixed.toHsl(), s: Math.min(100, mixed.toHsl().s + 5) });
    }
    shadesColord.push(mixed);
  }

  return toShades(shadesColord);
}
