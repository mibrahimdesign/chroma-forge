import { NormalizedToken, NormalizedTokenSet } from "../pipeline/types";

function getCssVarName(groupName: string, t: NormalizedToken): string {
  switch (t.type) {
    case "colors":
      return `--color-${groupName}-${t.name}`;
    case "spacing":
      return `--spacing-${t.name}`;
    case "radius":
      return `--radius-${t.name}`;
    case "shadows":
      return `--shadow-${t.name}`;
    case "typography":
      return `--font-size-${t.name}`; // primary mapping for value
    default:
      return `--${groupName}-${t.name}`;
  }
}

function getScssVarName(groupName: string, t: NormalizedToken): string {
  return getCssVarName(groupName, t).replace("--", "$");
}

export function exportCssVars(tokenSet: NormalizedTokenSet): string {
  const lines: string[] = [];
  
  tokenSet.groups.forEach((g) => {
    g.tokens.forEach((t) => {
      lines.push(`  ${getCssVarName(g.name, t)}: ${t.value};`);
      
      // Inject deeply mapped typography CSS vars if available
      if (t.type === "typography" && t.metadata) {
        if (t.metadata.fontWeight) lines.push(`  --font-weight-${t.name}: ${t.metadata.fontWeight};`);
        if (t.metadata.lineHeight) lines.push(`  --line-height-${t.name}: ${t.metadata.lineHeight};`);
        if (t.metadata.letterSpacing) lines.push(`  --letter-spacing-${t.name}: ${t.metadata.letterSpacing};`);
      }
    });
  });

  return `:root {\n${lines.join("\n")}\n}`;
}

export function exportScssVars(tokenSet: NormalizedTokenSet): string {
  const lines: string[] = [];
  
  tokenSet.groups.forEach((g) => {
    g.tokens.forEach((t) => {
      lines.push(`${getScssVarName(g.name, t)}: ${t.value};`);
      
      if (t.type === "typography" && t.metadata) {
        if (t.metadata.fontWeight) lines.push(`$font-weight-${t.name}: ${t.metadata.fontWeight};`);
        if (t.metadata.lineHeight) lines.push(`$line-height-${t.name}: ${t.metadata.lineHeight};`);
        if (t.metadata.letterSpacing) lines.push(`$letter-spacing-${t.name}: ${t.metadata.letterSpacing};`);
      }
    });
  });

  return lines.join("\n");
}
