import { useCallback, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Contrast,
  Copy,
  RotateCcw,
  SwatchBook,
} from "lucide-react";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { ColorShade, safeParseColor } from "@/lib/color/engine";
import { getTranslations } from "@/lib/i18n/translations";
import { cn } from "@/lib/utils/cn";

interface PaletteLabels {
  eyebrow: string;
  title: string;
  copy: string;
  steps: string;
  editable: string;
  darkest: string;
  left: string;
  right: string;
  resetAll: string;
  shade: string;
  custom: string;
  live: string;
  copied: string;
  lowContrast: string;
  copyAction: string;
  reset: string;
}

interface PaletteDisplayProps {
  shades: ColorShade[];
  shadeOverrides: Partial<Record<string, string>>;
  onShadeOverride: (shadeName: string, color: string) => void;
  onClearShadeOverride: (shadeName: string) => void;
  onClearAllOverrides: () => void;
}

export function PaletteDisplay({
  shades,
  shadeOverrides,
  onShadeOverride,
  onClearShadeOverride,
  onClearAllOverrides,
}: PaletteDisplayProps) {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const t = getTranslations(language);
  const paletteLabels: PaletteLabels = t.palette;
  const railRef = useRef<HTMLDivElement>(null);

  return (
    <section aria-labelledby="palette-heading" className="glass-panel space-y-5 overflow-hidden px-4 py-4 sm:px-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <p className="eyebrow">{t.palette.eyebrow}</p>
          <h2 id="palette-heading" className="section-title">
            {t.palette.title}
          </h2>
          <p className="section-copy">{t.palette.copy}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:w-auto sm:grid-cols-3">
          <StatPill label={t.palette.steps} value={`${shades.length}`} />
          <StatPill label={t.palette.editable} value={`${Object.keys(shadeOverrides).length}`} />
          <StatPill label={t.palette.darkest} value={shades.at(-1)?.hex ?? "--"} />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => railRef.current?.scrollBy({ left: -320, behavior: "smooth" })}
            className="subtle-button px-4 py-3 text-sm"
          >
            <ArrowLeft className={cn("h-4 w-4", isArabic && "rotate-180")} />
            {t.palette.left}
          </button>
          <button
            type="button"
            onClick={() => railRef.current?.scrollBy({ left: 320, behavior: "smooth" })}
            className="subtle-button px-4 py-3 text-sm"
          >
            {t.palette.right}
            <ArrowRight className={cn("h-4 w-4", isArabic && "rotate-180")} />
          </button>
        </div>

        <button
          type="button"
          onClick={onClearAllOverrides}
          className="subtle-button px-4 py-3 text-sm"
        >
          <RotateCcw className="h-4 w-4" />
          {t.palette.resetAll}
        </button>
      </div>

      <div ref={railRef} className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory">
        {shades.map((shade) => (
          <ColorCard
            key={`${shade.name}-${shade.hex}`}
            shade={shade}
            isOverridden={Boolean(shadeOverrides[shade.name])}
            onShadeOverride={onShadeOverride}
            onClearShadeOverride={onClearShadeOverride}
            labels={paletteLabels}
          />
        ))}
      </div>
    </section>
  );
}

function ColorCard({
  shade,
  isOverridden,
  onShadeOverride,
  onClearShadeOverride,
  labels,
}: {
  shade: ColorShade;
  isOverridden: boolean;
  onShadeOverride: (shadeName: string, color: string) => void;
  onClearShadeOverride: (shadeName: string) => void;
  labels: PaletteLabels;
}) {
  const [copied, setCopied] = useState(false);
  const [draftHex, setDraftHex] = useState(shade.hex);

  const handleCopy = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
      return;
    }

    try {
      await navigator.clipboard.writeText(shade.hex);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }, [shade.hex]);

  const hasLowContrast = shade.contrastWithWhite < 4.5 && shade.contrastWithBlack < 4.5;
  const textColor = shade.isLight ? "#06111f" : "#f8fafc";

  return (
    <article
      className={cn(
        "group relative flex min-h-[268px] min-w-[164px] max-w-[164px] snap-start flex-col justify-between overflow-hidden rounded-xl border p-4 shadow-[0_12px_32px_rgba(15,23,42,0.12)] transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_24px_64px_rgba(15,23,42,0.22)]",
        isOverridden ? "border-[var(--accent-strong)] ring-2 ring-[var(--accent-ring)]" : "border-white/10"
      )}
      style={{ backgroundColor: shade.hex, color: textColor }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.25),transparent_38%)] opacity-90" />

      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] opacity-60 transition-opacity group-hover:opacity-80">{labels.shade}</p>
          <p className="mt-1 text-xl font-bold tracking-[-0.03em]">{shade.name}</p>
        </div>
        <span className="rounded-md border border-black/10 bg-white/15 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] backdrop-blur-md">
          {isOverridden ? labels.custom : copied ? labels.copied : labels.live}
        </span>
      </div>

      <button
        type="button"
        onClick={handleCopy}
        className="relative flex-1 pt-6 text-left"
        title={`Copy ${shade.hex}`}
        aria-label={`Copy color ${shade.name}, hex ${shade.hex}`}
      >
        <div className="space-y-3">
          <div className="space-y-1 transition-transform duration-300 group-hover:-translate-x-1">
            <p className="font-mono text-[0.82rem] font-medium tracking-[0.04em] opacity-90 break-all data-code">{shade.hex}</p>
            <p className="text-[0.68rem] font-medium opacity-60 break-words data-code">{shade.rgb}</p>
          </div>

          <div className="text-xs font-medium opacity-80 break-words data-code">{shade.hsl}</div>

          {hasLowContrast && (
            <div className="inline-flex items-center gap-1.5 rounded-md border border-black/10 bg-white/25 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] backdrop-blur-md">
              <Contrast className="h-3.5 w-3.5" />
              {labels.lowContrast}
            </div>
          )}
        </div>
      </button>

      <div className="relative mt-4 space-y-2">
        <div className="flex items-center gap-2 min-w-0">
          <label className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-black/10 bg-white/15 backdrop-blur-md">
            <SwatchBook className="h-3.5 w-3.5" />
            <input
              type="color"
              value={shade.hex}
              onChange={(event) => onShadeOverride(shade.name, event.target.value)}
              className="absolute inset-0 cursor-pointer opacity-0"
              aria-label={`Customize shade ${shade.name}`}
            />
          </label>

          <input
            type="text"
            value={draftHex}
            onChange={(event) => {
              const nextValue = event.target.value;
              setDraftHex(nextValue);

              const parsed = safeParseColor(nextValue);
              if (parsed) {
                onShadeOverride(shade.name, parsed.toHex());
              }
            }}
            spellCheck={false}
            className="min-w-0 flex-1 rounded-lg border border-black/10 bg-white/15 px-3 py-2 font-mono text-xs backdrop-blur-md outline-none data-code"
            aria-label={`Hex value for shade ${shade.name}`}
          />
        </div>

        <div className="flex items-center justify-between gap-2 text-xs font-medium opacity-80">
          <span className="inline-flex items-center gap-1">
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {labels.copyAction}
          </span>
          {isOverridden && (
            <button
              type="button"
              onClick={() => onClearShadeOverride(shade.name)}
              className="inline-flex items-center gap-1 rounded-md border border-black/10 bg-white/15 px-2.5 py-1 backdrop-blur-md"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              {labels.reset}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass-panel-strong px-3.5 py-3">
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">{label}</p>
      <p className="mt-2 font-mono text-sm text-[var(--foreground)] break-all">{value}</p>
    </div>
  );
}
