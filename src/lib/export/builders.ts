import { ColorShade } from "@/lib/color/engine";

export function exportTailwind(shades: ColorShade[], prefix: string): string {
  const lines = shades.map((s) => `    "${s.name}": "${s.hex}",`);
  return `module.exports = {
  theme: {
    extend: {
      colors: {
        ${prefix}: {
${lines.join("\n")}
        }
      }
    }
  }
}`;
}

export function exportCssVars(shades: ColorShade[], prefix: string): string {
  const lines = shades.map((s) => `  --color-${prefix}-${s.name}: ${s.hex};`);
  return `:root {\n${lines.join("\n")}\n}`;
}

export function exportScssVars(shades: ColorShade[], prefix: string): string {
  const lines = shades.map((s) => `$color-${prefix}-${s.name}: ${s.hex};`);
  return lines.join("\n");
}

export function exportJson(shades: ColorShade[], prefix: string): string {
  const obj: Record<string, string> = {};
  shades.forEach(s => obj[s.name] = s.hex);
  return JSON.stringify({ [prefix]: obj }, null, 2);
}

export function exportTypeScript(shades: ColorShade[], prefix: string): string {
  const lines = shades.map((s) => `  "${s.name}": "${s.hex}",`);
  return `export const ${prefix} = {
${lines.join("\n")}
} as const;`;
}
