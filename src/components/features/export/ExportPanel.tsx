import { useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { getTranslations } from "@/lib/i18n/translations";
import { ExportPalette, filterTokens, TokenCategory } from "@/lib/export/pipeline/types";
import { EXPORT_REGISTRY } from "@/lib/export/registry";
import { palettesToNormalizedSet } from "@/lib/export/pipeline/adapter";
import { ExportFormatGrid } from "./ExportFormatGrid";
import { TokenFilterBar } from "./TokenFilterBar";
import { PreviewPanel } from "./PreviewPanel";

interface ExportStudioProps {
  palettes: ExportPalette[];
}

export function ExportPanel({ palettes }: ExportStudioProps) {
  const { language } = useLanguage();
  const t = getTranslations(language);

  // Studio State
  const [activeFormatId, setActiveFormatId] = useState<string>("css");
  const [category, setCategory] = useState<TokenCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copyState, setCopyState] = useState<"idle" | "success" | "error">("idle");

  // Normalization & Filtering Pipeline
  const { filteredTokenSet, activeContext } = useMemo(() => {
    // 1. Source -> Normalized
    const baseSet = palettesToNormalizedSet(palettes);
    
    // The adapter now merges dynamic colors + static foundation tokens (typography, spacing, etc.)

    // 2. Normalized -> Filtered
    const filtered = filterTokens(baseSet, { category, searchQuery });

    // 3. Determine Context State
    let context: "no-tokens" | "results" = "results";
    if (filtered.groups.length === 0) {
      context = "no-tokens";
    }

    return { filteredTokenSet: filtered, activeContext: context };
  }, [palettes, category, searchQuery]);

  const tokensCount = useMemo(() => {
    return filteredTokenSet.groups.reduce((acc, group) => acc + group.tokens.length, 0);
  }, [filteredTokenSet]);

  // Code Generation
  const activeFormat = EXPORT_REGISTRY.find((f) => f.id === activeFormatId) ?? EXPORT_REGISTRY[0];
  const codeString = useMemo(() => {
    if (activeContext !== "results") return null;
    try {
      return activeFormat.formatFn(filteredTokenSet);
    } catch {
      return null;
    }
  }, [activeFormat, filteredTokenSet, activeContext]);

  // Derived UI data
  const formatLabel = t.export[activeFormat.labelKey as keyof typeof t.export] as string;
  const prefixes = palettes.map(p => p.prefix);

  const handleCopy = async () => {
    if (!codeString || typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
      setCopyState("error");
      window.setTimeout(() => setCopyState("idle"), 2000);
      return;
    }

    try {
      await navigator.clipboard.writeText(codeString);
      setCopyState("success");
      window.setTimeout(() => setCopyState("idle"), 2000);
    } catch {
      setCopyState("error");
      window.setTimeout(() => setCopyState("idle"), 2000);
    }
  };

  const renderCopyFeedback = () => {
    if (copyState === "success") {
      return t.export.copyFeedback.success.replace("{format}", formatLabel);
    }
    if (copyState === "error") {
      return t.export.copyFeedback.failure;
    }
    return t.export.copyCode;
  };

  return (
    <section id="exports" aria-labelledby="export-heading" className="glass-panel space-y-6 px-5 py-5 sm:px-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <p className="eyebrow">{t.export.eyebrow}</p>
          <h2 id="export-heading" className="section-title">
            {t.export.title}
          </h2>
          <p className="section-copy max-w-2xl">{t.export.copy}</p>
        </div>

        <button 
          type="button" 
          onClick={handleCopy} 
          disabled={!codeString}
          className="premium-button whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {copyState === "success" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {renderCopyFeedback()}
        </button>
      </div>

      {/* Format Selector Grid */}
      <ExportFormatGrid 
        activeFormatId={activeFormatId} 
        onFormatSelect={setActiveFormatId} 
      />

      <div className="h-px w-full bg-gradient-to-r from-transparent via-[color:var(--line-soft)] to-transparent" />

      {/* Filter Bar */}
      <TokenFilterBar
        category={category}
        onCategoryChange={setCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Code Preview & Empty States */}
      <PreviewPanel
        activeFormat={activeFormat}
        codeString={codeString}
        activeContext={activeContext}
        prefixes={prefixes}
        tokensCount={tokensCount}
      />
    </section>
  );
}
