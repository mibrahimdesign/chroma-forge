import { Inbox, FileJson2, Download } from "lucide-react";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { getTranslations } from "@/lib/i18n/translations";
import { ExportFormat } from "@/lib/export/registry";

interface PreviewPanelProps {
  activeFormat: ExportFormat;
  codeString: string | null;
  activeContext: "no-tokens" | "unavailable" | "results";
  prefixes: string[];
  tokensCount: number;
}

export function PreviewPanel({ activeFormat, codeString, activeContext, prefixes, tokensCount }: PreviewPanelProps) {
  const { language } = useLanguage();
  const t = getTranslations(language);

  // Fallback for icons if they aren't pre-imported in this file
  const iconFallback = <FileJson2 className="h-4 w-4" />;

  const handleDownload = () => {
    if (!codeString) return;
    const blob = new Blob([codeString], { type: activeFormat.mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tokens.${activeFormat.fileExtension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderEmptyState = (title: string, desc: string) => (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 px-6 py-12 text-center text-[var(--muted-foreground)]">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--surface-float)] border border-[color:var(--line-soft)] shadow-[var(--shadow-soft)]">
        <Inbox className="h-8 w-8 text-[var(--line-strong)]" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-[var(--foreground)]">{title}</h3>
        <p className="mt-1 max-w-sm text-xs opacity-80">{desc}</p>
      </div>
    </div>
  );

  return (
    <div
      role="tabpanel"
      id={`export-panel-${activeFormat.id}`}
      aria-labelledby={`export-tab-${activeFormat.id}`}
      className="overflow-hidden rounded-xl border border-[color:var(--line)] bg-[var(--code-bg)] shadow-[0_22px_80px_rgba(15,23,42,0.22)]"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-4 sm:px-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-[var(--foreground-inverse)]">
            {iconFallback}
          </span>
          <div>
            <p className="text-sm font-semibold text-[var(--foreground-inverse)]">
              {t.export[activeFormat.labelKey as keyof typeof t.export] as string}
            </p>
            <p className="text-sm text-[var(--code-muted)]">
              {t.export[activeFormat.descKey as keyof typeof t.export] as string}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {activeContext === "results" && (
            <div className="hidden sm:flex items-center gap-1.5 rounded-md border border-white/5 bg-white/5 px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-[0.1em] text-[var(--code-muted)]">
              <span>{t.export.tokensCount.replace("{count}", tokensCount.toString())}</span>
            </div>
          )}
          {prefixes.length > 0 && (
            <div className="hidden sm:block rounded-md border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[0.75rem] text-[var(--foreground-inverse)]">
              {prefixes.join(", ")}
            </div>
          )}
          <button
            type="button"
            disabled={activeContext !== "results" || !codeString}
            onClick={handleDownload}
            className="flex items-center gap-1.5 rounded-md border border-white/10 bg-[var(--accent-strong)] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[var(--accent-ring)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="h-3.5 w-3.5" />
            {t.export.download} {activeFormat.language.toUpperCase()}
          </button>
        </div>
      </div>

      {activeContext === "no-tokens" &&
        renderEmptyState(t.export.emptyState.noTokens, t.export.emptyState.noTokensDesc)}

      {activeContext === "unavailable" &&
        renderEmptyState(t.export.emptyState.unavailable, t.export.emptyState.unavailableDesc)}

      {activeContext === "results" && codeString !== null && (
        <pre className="max-h-[520px] overflow-auto px-4 py-5 font-mono text-[13px] leading-7 text-[var(--code-fg)] sm:px-5">
          <code className="block w-full" style={{ counterReset: "line" }}>
            {codeString.split("\n").map((line, i) => (
              <span key={i} className="block before:mr-4 before:inline-block before:w-6 before:text-right before:content-[counter(line)] before:text-[var(--code-muted)] before:[counter-increment:line]">
                {line || " "}
              </span>
            ))}
          </code>
        </pre>
      )}
    </div>
  );
}
