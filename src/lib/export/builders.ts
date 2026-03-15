import { ColorShade } from "@/lib/color/engine";

export interface ExportPalette {
  prefix: string;
  shades: ColorShade[];
}

export function exportTailwind(palettes: ExportPalette[]): string {
  const lines = palettes.flatMap((p) => [
    `        "${p.prefix}": {`,
    ...p.shades.map((s) => `          "${s.name}": "${s.hex}",`),
    `        },`
  ]);

  return `module.exports = {
  theme: {
    extend: {
      colors: {
${lines.join("\n")}
      }
    }
  }
}`;
}

export function exportCssVars(palettes: ExportPalette[]): string {
  const lines = palettes.flatMap((p) =>
    p.shades.map((s) => `  --color-${p.prefix}-${s.name}: ${s.hex};`)
  );
  return `:root {\n${lines.join("\n")}\n}`;
}

export function exportScssVars(palettes: ExportPalette[]): string {
  const lines = palettes.flatMap((p) =>
    p.shades.map((s) => `$color-${p.prefix}-${s.name}: ${s.hex};`)
  );
  return lines.join("\n");
}

export function exportJson(palettes: ExportPalette[]): string {
  const rootObj: Record<string, Record<string, string>> = {};
  
  palettes.forEach((p) => {
    const obj: Record<string, string> = {};
    p.shades.forEach(s => obj[s.name] = s.hex);
    rootObj[p.prefix] = obj;
  });

  return JSON.stringify(rootObj, null, 2);
}

export function exportTypeScript(palettes: ExportPalette[]): string {
  const blocks = palettes.map((p) => {
    const lines = p.shades.map((s) => `  "${s.name}": "${s.hex}",`);
    return `export const ${p.prefix} = {\n${lines.join("\n")}\n} as const;`;
  });

  return blocks.join("\n\n");
}

export function exportFigma(palettes: ExportPalette[]): string {
  const rootObj: Record<string, Record<string, { value: string; type: string }>> = {};

  palettes.forEach((p) => {
    const obj: Record<string, { value: string; type: string }> = {};
    p.shades.forEach(s => obj[s.name] = { value: s.hex, type: "color" });
    rootObj[p.prefix] = obj;
  });

  return JSON.stringify(rootObj, null, 2);
}
