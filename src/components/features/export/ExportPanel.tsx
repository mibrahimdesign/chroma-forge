import { useMemo, useState } from "react";
import { Check, Copy, FileJson2 } from "lucide-react";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { ColorShade } from "@/lib/color/engine";
import {
  exportCssVars,
  exportJson,
  exportScssVars,
  exportTailwind,
  exportTypeScript,
} from "@/lib/export/builders";
import { getTranslations } from "@/lib/i18n/translations";
import { cn } from "@/lib/utils/cn";

interface ExportPanelProps {
  shades: ColorShade[];
  prefix: string;
}

type ExportType = "css" | "tailwind" | "scss" | "json" | "ts";

export function ExportPanel({ shades, prefix }: ExportPanelProps) {
  const { language } = useLanguage();
  const t = getTranslations(language);
  const [activeTab, setActiveTab] = useState<ExportType>("css");
  const [copied, setCopied] = useState(false);
  const exportTabs: { id: ExportType; label: string; description: string }[] = [
    { id: "css", label: t.export.cssVars, description: t.export.cssVarsDesc },
    { id: "tailwind", label: t.export.tailwind, description: t.export.tailwindDesc },
    { id: "scss", label: t.export.scss, description: t.export.scssDesc },
    { id: "json", label: t.export.json, description: t.export.jsonDesc },
    { id: "ts", label: t.export.ts, description: t.export.tsDesc },
  ];

  const codeString = useMemo(() => {
    switch (activeTab) {
      case "tailwind":
        return exportTailwind(shades, prefix);
      case "scss":
        return exportScssVars(shades, prefix);
      case "json":
        return exportJson(shades, prefix);
      case "ts":
        return exportTypeScript(shades, prefix);
      case "css":
      default:
        return exportCssVars(shades, prefix);
    }
  }, [activeTab, prefix, shades]);

  const activeMeta = exportTabs.find((tab) => tab.id === activeTab) ?? exportTabs[0];
  const activePanelId = `export-panel-${activeTab}`;

  const handleCopy = async () => {
    if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
      return;
    }

    try {
      await navigator.clipboard.writeText(codeString);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section id="exports" aria-labelledby="export-heading" className="glass-panel space-y-6 px-5 py-5 sm:px-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <p className="eyebrow">{t.export.eyebrow}</p>
          <h2 id="export-heading" className="section-title">
            {t.export.title}
          </h2>
          <p className="section-copy">{t.export.copy}</p>
        </div>

        <button type="button" onClick={handleCopy} className="premium-button whitespace-nowrap">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? t.export.copied : t.export.copyCode}
        </button>
      </div>

      <div
        role="tablist"
        aria-label={t.export.formats}
        className="flex flex-wrap gap-2 rounded-xl border border-[color:var(--line)] bg-[var(--surface-float)] p-2 shadow-[var(--shadow-soft)]"
      >
        {exportTabs.map((tab) => {
          const selected = tab.id === activeTab;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`export-tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={`export-panel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "rounded-lg px-4 py-3 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                selected
                  ? "bg-[var(--surface-selected)] text-[var(--foreground)] shadow-[var(--shadow-soft)]"
                  : "text-[var(--muted-foreground)] hover:bg-[var(--surface-glass)] hover:text-[var(--foreground)]"
              )}
            >
              <p className="text-sm font-semibold">{tab.label}</p>
              <p className="mt-1 text-xs leading-5">{tab.description}</p>
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={activePanelId}
        aria-labelledby={`export-tab-${activeTab}`}
        className="overflow-hidden rounded-xl border border-[color:var(--line)] bg-[var(--code-bg)] shadow-[0_22px_80px_rgba(15,23,42,0.22)]"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-4 sm:px-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-[var(--foreground-inverse)]">
              <FileJson2 className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-semibold text-[var(--foreground-inverse)]">{activeMeta.label}</p>
              <p className="text-sm text-[var(--code-muted)]">{activeMeta.description}</p>
            </div>
          </div>
          <div className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-[0.78rem] text-[var(--foreground-inverse)]">
            {prefix}
          </div>
        </div>

        <pre className="max-h-[520px] overflow-auto px-4 py-5 font-mono text-[13px] leading-7 text-[var(--code-fg)] sm:px-5">
          <code>{codeString}</code>
        </pre>
      </div>
    </section>
  );
}
