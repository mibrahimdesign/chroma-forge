import { useState, useMemo } from "react";
import { ColorShade } from "@/lib/color/engine";
import { Copy, Check } from "lucide-react";
import {
  exportTailwind,
  exportCssVars,
  exportScssVars,
  exportJson,
  exportTypeScript,
} from "@/lib/export/builders";
import { cn } from "@/lib/utils/cn";

interface ExportPanelProps {
  shades: ColorShade[];
  prefix: string;
}

type ExportType = "tailwind" | "css" | "scss" | "json" | "ts";

export function ExportPanel({ shades, prefix }: ExportPanelProps) {
  const [activeTab, setActiveTab] = useState<ExportType>("css");
  const [copied, setCopied] = useState(false);

  const codeString = useMemo(() => {
    switch (activeTab) {
      case "tailwind": return exportTailwind(shades, prefix);
      case "css": return exportCssVars(shades, prefix);
      case "scss": return exportScssVars(shades, prefix);
      case "json": return exportJson(shades, prefix);
      case "ts": return exportTypeScript(shades, prefix);
      default: return "";
    }
  }, [activeTab, shades, prefix]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("Failed to copy code", e);
    }
  };

  const tabs: { id: ExportType; label: string }[] = [
    { id: "css", label: "CSS Vars" },
    { id: "tailwind", label: "Tailwind" },
    { id: "scss", label: "SCSS" },
    { id: "json", label: "JSON" },
    { id: "ts", label: "TypeScript" },
  ];

  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold tracking-tight">Export Tokens</h3>
        <button
          onClick={handleCopy}
          className="flex h-8 items-center gap-1.5 rounded-md bg-foreground px-3 text-xs font-medium text-background transition-colors hover:bg-foreground/90 focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Copy Code"}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "rounded-md px-3 py-1.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-foreground",
              activeTab === tab.id
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="relative overflow-hidden rounded-lg bg-[#0d0d0d] p-4 border border-[#27272a]">
        <pre className="overflow-x-auto text-[13px] leading-relaxed text-[#e4e4e7]">
          <code>{codeString}</code>
        </pre>
      </div>
    </div>
  );
}
