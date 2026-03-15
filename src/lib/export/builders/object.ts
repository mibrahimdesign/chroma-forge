import { NormalizedTokenSet } from "../pipeline/types";

export function exportJson(tokenSet: NormalizedTokenSet): string {
  const rootObj: Record<string, any> = {};
  
  tokenSet.groups.forEach((g) => {
    // If it's a color category, we nest it inside `color.groupName`.
    // If it's another category, the group name itself acts as the root category.
    const isColor = g.tokens[0]?.type === "colors";
    
    if (isColor) {
      if (!rootObj.color) rootObj.color = {};
      const obj: Record<string, string> = {};
      g.tokens.forEach(t => obj[t.name] = t.value);
      rootObj.color[g.name] = obj;
    } else {
      rootObj[g.name] = {};
      g.tokens.forEach((t) => {
        if (t.type === "typography" && t.metadata) {
          rootObj[g.name][t.name] = {
            value: t.value,
            ...t.metadata
          };
        } else {
          rootObj[g.name][t.name] = t.value;
        }
      });
    }
  });

  return JSON.stringify(rootObj, null, 2);
}

export function exportTypeScript(tokenSet: NormalizedTokenSet): string {
  // We can serialize the JSON logic for TS output
  const rootObj: Record<string, any> = {};
  
  tokenSet.groups.forEach((g) => {
    const isColor = g.tokens[0]?.type === "colors";
    if (isColor) {
      if (!rootObj.color) rootObj.color = {};
      const obj: Record<string, string> = {};
      g.tokens.forEach(t => obj[t.name] = t.value);
      rootObj.color[g.name] = obj;
    } else {
      rootObj[g.name] = {};
      g.tokens.forEach((t) => {
        if (t.type === "typography" && t.metadata) {
          rootObj[g.name][t.name] = { value: t.value, ...t.metadata };
        } else {
          rootObj[g.name][t.name] = t.value;
        }
      });
    }
  });

  return `export const tokens = ${JSON.stringify(rootObj, null, 2)} as const;`;
}
