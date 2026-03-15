import { NormalizedToken, NormalizedTokenSet } from "../pipeline/types";

function formatAndroidName(groupName: string, t: NormalizedToken): string {
  const normalizedValue = t.name.replace(/-/g, "_");
  const normalizedGroup = groupName.replace(/-/g, "_");
  
  switch (t.type) {
    case "colors":
      return `color_${normalizedGroup}_${normalizedValue}`;
    case "spacing":
      return `spacing_${normalizedValue}`;
    case "radius":
      return `radius_${normalizedValue}`;
    case "typography":
      return `font_size_${normalizedValue}`;
    case "shadows":
      return `shadow_${normalizedValue}`;
    default:
      return `${normalizedGroup}_${normalizedValue}`;
  }
}

function formatSwiftName(groupName: string, t: NormalizedToken): string {
  // Swift uses camelCase. 'heading-lg' -> 'headingLg'
  const normalizedValue = t.name.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
  const normalizedGroup = groupName.charAt(0).toUpperCase() + groupName.slice(1).replace(/-[a-z]/g, (g) => g[1].toUpperCase());

  switch (t.type) {
    case "colors":
      return `color${normalizedGroup}${normalizedValue.charAt(0).toUpperCase() + normalizedValue.slice(1)}`;
    case "spacing":
      return `spacing${normalizedValue.charAt(0).toUpperCase() + normalizedValue.slice(1)}`;
    case "radius":
      return `radius${normalizedValue.charAt(0).toUpperCase() + normalizedValue.slice(1)}`;
    case "typography":
      return `fontSize${normalizedValue.charAt(0).toUpperCase() + normalizedValue.slice(1)}`;
    case "shadows":
      return `shadow${normalizedValue.charAt(0).toUpperCase() + normalizedValue.slice(1)}`;
    default:
      return `${normalizedGroup.toLowerCase()}${normalizedValue}`;
  }
}

export function exportAndroidXml(tokenSet: NormalizedTokenSet): string {
  const lines: string[] = [];
  
  tokenSet.groups.forEach((g) => {
    g.tokens.forEach((t) => {
      // Android XML usually separates dimen and color.
      // We will output all as variables but flag dimen if they aren't color.
      const tag = t.type === "colors" ? "color" : "dimen";
      // Shadow values are too complex for simple dimen, so we skip them or map them as string. String is safer.
      const finalTag = t.type === "shadows" ? "string" : tag;
      
      lines.push(`  <${finalTag} name="${formatAndroidName(g.name, t)}">${t.value}</${finalTag}>`);
      
      if (t.type === "typography" && t.metadata) {
        if (t.metadata.letterSpacing) lines.push(`  <item name="letter_spacing_${formatAndroidName(g.name, t).replace('font_size_', '')}" type="dimen">${t.metadata.letterSpacing}</item>`);
      }
    });
  });

  return `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n${lines.join("\n")}\n</resources>`;
}

export function exportIosSwift(tokenSet: NormalizedTokenSet): string {
  const lines: string[] = [];
  
  tokenSet.groups.forEach((g) => {
    g.tokens.forEach((t) => {
      // Note: Swift static let uses string definitions if not parsed natively to UIColor or CGFloat, 
      // keeping strings ensures 100% interoperability across complex shadows vs fonts vs hex.
      lines.push(`  static let ${formatSwiftName(g.name, t)} = "${t.value}"`);
    });
  });

  return `import Foundation\n\nenum AppTokens {\n${lines.join("\n")}\n}`;
}
