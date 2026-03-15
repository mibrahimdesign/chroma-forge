import { NormalizedTokenGroup } from "./types";

export const DEFAULT_TYPOGRAPHY: NormalizedTokenGroup = {
  name: "typography",
  tokens: [
    {
      name: "display-xl",
      value: "4.5rem",
      type: "typography",
      metadata: { fontSize: "4.5rem", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.04em" },
    },
    {
      name: "heading-lg",
      value: "3rem",
      type: "typography",
      metadata: { fontSize: "3rem", fontWeight: 700, lineHeight: 1.2, letterSpacing: "-0.02em" },
    },
    {
      name: "heading-md",
      value: "2.25rem",
      type: "typography",
      metadata: { fontSize: "2.25rem", fontWeight: 600, lineHeight: 1.25, letterSpacing: "-0.01em" },
    },
    {
      name: "body-lg",
      value: "1.125rem",
      type: "typography",
      metadata: { fontSize: "1.125rem", fontWeight: 400, lineHeight: 1.5, letterSpacing: "0em" },
    },
    {
      name: "body-md",
      value: "1rem",
      type: "typography",
      metadata: { fontSize: "1rem", fontWeight: 400, lineHeight: 1.5, letterSpacing: "0em" },
    },
    {
      name: "caption-sm",
      value: "0.875rem",
      type: "typography",
      metadata: { fontSize: "0.875rem", fontWeight: 500, lineHeight: 1.6, letterSpacing: "0.02em" },
    },
  ],
};

export const DEFAULT_SPACING: NormalizedTokenGroup = {
  name: "spacing",
  tokens: [
    { name: "0", value: "0px", type: "spacing" },
    { name: "1", value: "0.25rem", type: "spacing" },
    { name: "2", value: "0.5rem", type: "spacing" },
    { name: "3", value: "0.75rem", type: "spacing" },
    { name: "4", value: "1rem", type: "spacing" },
    { name: "5", value: "1.25rem", type: "spacing" },
    { name: "6", value: "1.5rem", type: "spacing" },
    { name: "8", value: "2rem", type: "spacing" },
    { name: "10", value: "2.5rem", type: "spacing" },
    { name: "12", value: "3rem", type: "spacing" },
    { name: "16", value: "4rem", type: "spacing" },
    { name: "24", value: "6rem", type: "spacing" },
  ],
};

export const DEFAULT_RADIUS: NormalizedTokenGroup = {
  name: "radius",
  tokens: [
    { name: "none", value: "0px", type: "radius" },
    { name: "sm", value: "0.125rem", type: "radius" },
    { name: "md", value: "0.375rem", type: "radius" },
    { name: "lg", value: "0.75rem", type: "radius" },
    { name: "xl", value: "1.25rem", type: "radius" },
    { name: "full", value: "9999px", type: "radius" },
  ],
};

export const DEFAULT_SHADOWS: NormalizedTokenGroup = {
  name: "shadow",
  tokens: [
    { name: "xs", value: "0 1px 2px 0 rgba(0, 0, 0, 0.05)", type: "shadows" },
    { name: "sm", value: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)", type: "shadows" },
    { name: "md", value: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)", type: "shadows" },
    { name: "lg", value: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)", type: "shadows" },
    { name: "xl", value: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)", type: "shadows" },
  ],
};
