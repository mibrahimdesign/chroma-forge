import { AnyColor } from "colord";
import { safeParseColor } from "./engine";

/**
 * Returns a valid color string for CSS given an input and an optional format.
 */
export function formatColor(input: AnyColor | string, format: "hex" | "rgb" | "hsl" = "hex"): string {
  const c = safeParseColor(input);
  if (!c) return "";

  switch (format) {
    case "rgb":
      return c.toRgbString();
    case "hsl":
      return c.toHslString();
    case "hex":
    default:
      return c.toHex();
  }
}

/**
 * Validates a color string explicitly using standard colord validation.
 */
export function isValidColor(input: string): boolean {
  return safeParseColor(input) !== null;
}
