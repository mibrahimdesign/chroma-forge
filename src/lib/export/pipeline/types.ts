import { ColorShade } from "@/lib/color/engine";

export type TokenCategory = "colors" | "typography" | "spacing" | "radius" | "shadows" | "motion";

export interface ExportPalette {
  prefix: string;
  shades: ColorShade[];
}

export interface NormalizedToken {
  name: string; // e.g. "50", "sm", "heading-lg"
  value: string; // e.g. "#f7f9fc", "1rem", "0 4px 12px rgba(0,0,0,0.12)"
  type: TokenCategory;
  metadata?: {
    fontFamily?: string;
    fontSize?: string;
    fontWeight?: string | number;
    lineHeight?: string | number;
    letterSpacing?: string;
    description?: string;
  };
}

export interface NormalizedTokenGroup {
  name: string; // e.g. "primary", "neutral"
  tokens: NormalizedToken[];
}

export interface NormalizedTokenSet {
  groups: NormalizedTokenGroup[];
}

export interface TokenFilterState {
  category: TokenCategory | "all";
  searchQuery: string;
}

export function filterTokens(
  sourceSet: NormalizedTokenSet,
  filterState: TokenFilterState
): NormalizedTokenSet {
  const { category, searchQuery } = filterState;
  const lowerQuery = searchQuery.toLowerCase().trim();

  const filteredGroups = sourceSet.groups
    .map((group) => {
      const filteredTokens = group.tokens.filter((token) => {
        const matchesCategory = category === "all" || token.type === category;
        const matchesSearch =
          lowerQuery === "" ||
          token.name.toLowerCase().includes(lowerQuery) ||
          token.value.toLowerCase().includes(lowerQuery) ||
          group.name.toLowerCase().includes(lowerQuery) ||
          token.type.toLowerCase().includes(lowerQuery) ||
          (token.metadata && Object.values(token.metadata).some(val => 
            String(val).toLowerCase().includes(lowerQuery)
          ));

        return matchesCategory && matchesSearch;
      });

      return {
        ...group,
        tokens: filteredTokens,
      };
    })
    .filter((group) => group.tokens.length > 0);

  return { groups: filteredGroups };
}
