import { ColorShade } from "@/lib/color/engine";
import { ExportPalette, NormalizedTokenSet, NormalizedTokenGroup } from "./types";
import { DEFAULT_TYPOGRAPHY, DEFAULT_SPACING, DEFAULT_RADIUS, DEFAULT_SHADOWS } from "./defaults";

export function palettesToNormalizedSet(palettes: ExportPalette[]): NormalizedTokenSet {
  const groups: NormalizedTokenGroup[] = palettes.map((palette) => ({
    name: palette.prefix,
    tokens: palette.shades.map((shade: ColorShade) => ({
      name: shade.name,
      value: shade.hex,
      type: "colors",
    })),
  }));

  // Append static non-color categories
  groups.push(DEFAULT_TYPOGRAPHY);
  groups.push(DEFAULT_SPACING);
  groups.push(DEFAULT_RADIUS);
  groups.push(DEFAULT_SHADOWS);

  return { groups };
}
