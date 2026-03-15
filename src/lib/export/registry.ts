import { 
  exportCssVars,
  exportTailwind,
  exportScssVars,
  exportJson,
  exportTypeScript,
  exportFigma,
  exportPhotoshop,
  exportIllustrator,
  exportStyleDictionary,
  exportAndroidXml,
  exportIosSwift
} from "./builders";
import { NormalizedTokenSet } from "./pipeline/types";

export type ExportGroupId = "developer" | "design" | "mobile";

export interface ExportFormat {
  id: string;
  groupId: ExportGroupId;
  labelKey: string;
  descKey: string;
  iconName: string;
  language: string; // Used for syntax highlighting
  fileExtension: string;
  mimeType: string;
  formatFn: (tokens: NormalizedTokenSet) => string;
}

export const EXPORT_REGISTRY: ExportFormat[] = [
  // Developer Outputs
  {
    id: "css",
    groupId: "developer",
    labelKey: "cssVars",
    descKey: "cssVarsDesc",
    iconName: "FileCode", // Will map to Lucide icon dynamically
    language: "css",
    fileExtension: "css",
    mimeType: "text/css",
    formatFn: exportCssVars,
  },
  {
    id: "tailwind",
    groupId: "developer",
    labelKey: "tailwind",
    descKey: "tailwindDesc",
    iconName: "Wind",
    language: "javascript",
    fileExtension: "js",
    mimeType: "text/javascript",
    formatFn: exportTailwind,
  },
  {
    id: "scss",
    groupId: "developer",
    labelKey: "scss",
    descKey: "scssDesc",
    iconName: "FileCode2",
    language: "scss",
    fileExtension: "scss",
    mimeType: "text/x-scss",
    formatFn: exportScssVars,
  },
  {
    id: "json",
    groupId: "developer",
    labelKey: "json",
    descKey: "jsonDesc",
    iconName: "FileJson",
    language: "json",
    fileExtension: "json",
    mimeType: "application/json",
    formatFn: exportJson,
  },
  {
    id: "ts",
    groupId: "developer",
    labelKey: "ts",
    descKey: "tsDesc",
    iconName: "FileLock2",
    language: "typescript",
    fileExtension: "ts",
    mimeType: "application/typescript",
    formatFn: exportTypeScript,
  },
  // Design Tool Outputs
  {
    id: "figma",
    groupId: "design",
    labelKey: "figma",
    descKey: "figmaDesc",
    iconName: "Figma",
    language: "json",
    fileExtension: "json",
    mimeType: "application/json",
    formatFn: exportFigma,
  },
  {
    id: "photoshop",
    groupId: "design",
    labelKey: "photoshop",
    descKey: "photoshopDesc",
    iconName: "Image",
    language: "json",
    fileExtension: "json",
    mimeType: "application/json",
    formatFn: exportPhotoshop,
  },
  {
    id: "illustrator",
    groupId: "design",
    labelKey: "illustrator",
    descKey: "illustratorDesc",
    iconName: "PenTool",
    language: "json",
    fileExtension: "json",
    mimeType: "application/json",
    formatFn: exportIllustrator,
  },
  {
    id: "styleDictionary",
    groupId: "design",
    labelKey: "styleDictionary",
    descKey: "styleDictionaryDesc",
    iconName: "BookOpen",
    language: "json",
    fileExtension: "json",
    mimeType: "application/json",
    formatFn: exportStyleDictionary,
  },
  {
    id: "android",
    groupId: "mobile",
    labelKey: "android",
    descKey: "androidDesc",
    iconName: "Smartphone",
    language: "xml",
    fileExtension: "xml",
    mimeType: "application/xml",
    formatFn: exportAndroidXml,
  },
  {
    id: "swift",
    groupId: "mobile",
    labelKey: "iosSwift",
    descKey: "iosSwiftDesc",
    iconName: "Apple",
    language: "swift",
    fileExtension: "swift",
    mimeType: "text/x-swift",
    formatFn: exportIosSwift,
  },
];
