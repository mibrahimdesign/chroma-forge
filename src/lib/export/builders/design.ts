import { NormalizedTokenSet } from "../pipeline/types";

// --- Design Tool Outputs ---

export function exportFigma(tokenSet: NormalizedTokenSet): string {
  const rootObj: Record<string, any> = {};

  tokenSet.groups.forEach((g) => {
    const isColor = g.tokens[0]?.type === "colors";
    
    if (isColor) {
      if (!rootObj.color) rootObj.color = {};
      const obj: Record<string, { value: string; type: string }> = {};
      g.tokens.forEach(t => obj[t.name] = { value: t.value, type: "color" });
      rootObj.color[g.name] = obj;
    } else {
      rootObj[g.name] = {};
      g.tokens.forEach((t) => {
        let figmaType: string = t.type;
        // Figma tokens sync utilizes specific naming for types
        if (t.type === "radius") figmaType = "borderRadius";
        if (t.type === "shadows") figmaType = "boxShadow";
        
        if (t.type === "typography" && t.metadata) {
          // Complex Typography Object in Figma
          rootObj[g.name][t.name] = {
            value: t.value,
            type: "typography",
            ...t.metadata
          };
        } else {
          rootObj[g.name][t.name] = { value: t.value, type: figmaType };
        }
      });
    }
  });

  return JSON.stringify(rootObj, null, 2);
}

export function exportStyleDictionary(tokenSet: NormalizedTokenSet): string {
  const rootObj: Record<string, any> = {};
  
  tokenSet.groups.forEach((g) => {
    const isColor = g.tokens[0]?.type === "colors";
    
    if (isColor) {
      if (!rootObj.color) rootObj.color = {};
      const obj: Record<string, { value: string }> = {};
      g.tokens.forEach(t => obj[t.name] = { value: t.value });
      rootObj.color[g.name] = obj;
    } else {
      rootObj[g.name] = {};
      g.tokens.forEach(t => {
        if (t.type === "typography" && t.metadata) {
          rootObj[g.name][t.name] = { value: t.value, ...t.metadata } as unknown as { value: string };
        } else {
          rootObj[g.name][t.name] = { value: t.value };
        }
      });
    }
  });

  return JSON.stringify(rootObj, null, 2);
}

export function exportPhotoshop(tokenSet: NormalizedTokenSet): string {
  // Photoshop swatches realistically only support colors.
  // We will filter out non-color tokens robustly here.
  const swatches = tokenSet.groups.flatMap((g) =>
    g.tokens
      .filter((t) => t.type === "colors")
      .map((t) => ({ name: `${g.name}-${t.name}`, hex: t.value }))
  );
  return JSON.stringify({ photoshop: { swatches } }, null, 2);
}

export function exportIllustrator(tokenSet: NormalizedTokenSet): string {
  const swatches = tokenSet.groups.flatMap((g) =>
    g.tokens
      .filter((t) => t.type === "colors")
      .map((t) => ({ name: `${g.name}-${t.name}`, color: t.value }))
  );
  return JSON.stringify({ illustrator: { swatches } }, null, 2);
}
