import { NormalizedTokenSet } from "../pipeline/types";

export function exportTailwind(tokenSet: NormalizedTokenSet): string {
  const tailwindConfig: Record<string, any> = {
    theme: {
      extend: {},
    },
  };

  const colorsObj: Record<string, Record<string, string>> = {};
  const spacingObj: Record<string, string> = {};
  const radiusObj: Record<string, string> = {};
  const shadowObj: Record<string, string> = {};
  const fontSizeObj: Record<string, [string, any]> = {};

  tokenSet.groups.forEach((group) => {
    group.tokens.forEach((t) => {
      switch (t.type) {
        case "colors":
          if (!colorsObj[group.name]) colorsObj[group.name] = {};
          colorsObj[group.name][t.name] = t.value;
          break;
        case "spacing":
          spacingObj[t.name] = t.value;
          break;
        case "radius":
          radiusObj[t.name] = t.value;
          break;
        case "shadows":
          shadowObj[t.name] = t.value;
          break;
        case "typography":
          const meta = t.metadata;
          if (meta) {
            fontSizeObj[t.name] = [
              meta.fontSize || t.value,
              {
                lineHeight: meta.lineHeight?.toString(),
                letterSpacing: meta.letterSpacing,
                fontWeight: meta.fontWeight?.toString(),
              },
            ];
          } else {
            fontSizeObj[t.name] = [t.value, {}];
          }
          break;
      }
    });
  });

  if (Object.keys(colorsObj).length > 0) tailwindConfig.theme.extend.colors = colorsObj;
  if (Object.keys(spacingObj).length > 0) tailwindConfig.theme.extend.spacing = spacingObj;
  if (Object.keys(radiusObj).length > 0) tailwindConfig.theme.extend.borderRadius = radiusObj;
  if (Object.keys(shadowObj).length > 0) tailwindConfig.theme.extend.boxShadow = shadowObj;
  if (Object.keys(fontSizeObj).length > 0) tailwindConfig.theme.extend.fontSize = fontSizeObj;

  return `module.exports = ${JSON.stringify(tailwindConfig, null, 2).replace(/"([^"]+)":/g, "$1:")};`;
}
