"use client";

import { useState, useRef, useMemo, useEffect, useCallback } from "react";
import { colord } from "colord";
import { Check, Copy, Pipette, RefreshCcw, WandSparkles } from "lucide-react";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { safeParseColor } from "@/lib/color/engine";
import { getTranslations } from "@/lib/i18n/translations";
import { cn } from "@/lib/utils/cn";
import { AccordionSection } from "@/components/ui/AccordionSection";

const QUICK_SWATCHES = ["#3b82f6", "#8b5cf6", "#0f766e", "#ef4444", "#f59e0b", "#111827"];
const HUE_STOPS = [0, 20, 40, 55, 80, 120, 160, 190, 220, 258, 290, 330];

interface ColorInputProps {
  value: string;
  onChange: (color: string) => void;
}

export function ColorInput({ value, onChange }: ColorInputProps) {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const t = getTranslations(language);
  const [inputValue, setInputValue] = useState(value);
  const [isCopied, setIsCopied] = useState(false);
  const nativePickerRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const parsedInput = useMemo(() => safeParseColor(inputValue), [inputValue]);
  const liveColor = useMemo(() => safeParseColor(value), [value]);
  const previewHex = parsedInput?.toHex() ?? value;
  const isInvalid = inputValue.trim().length > 0 && !parsedInput;
  const currentHsl = liveColor?.toHsl();
  const currentRgb = liveColor?.toRgbString() ?? "";
  const boardRows = useMemo(
    () => [
      {
        label: t.colorInput.soft,
        meta: "L 72 / S 60",
        swatches: HUE_STOPS.map((hue) => colord({ h: hue, s: 60, l: 72 }).toHex()),
      },
      {
        label: t.colorInput.balanced,
        meta: "L 58 / S 76",
        swatches: HUE_STOPS.map((hue) => colord({ h: hue, s: 76, l: 58 }).toHex()),
      },
      {
        label: t.colorInput.deep,
        meta: "L 44 / S 82",
        swatches: HUE_STOPS.map((hue) => colord({ h: hue, s: 82, l: 44 }).toHex()),
      },
    ],
    [t]
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    setInputValue(nextValue);
    const parsed = safeParseColor(nextValue);
    if (parsed) {
      onChange(parsed.toHex());
    }
  };

  const handleCopy = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) return;
    try {
      await navigator.clipboard.writeText(value);
      setIsCopied(true);
      window.setTimeout(() => setIsCopied(false), 1600);
    } catch {
      setIsCopied(false);
    }
  }, [value]);

  const handleRandomize = useCallback(() => {
    const nextColor = colord({
      h: Math.round(Math.random() * 360),
      s: 65 + Math.round(Math.random() * 30),
      l: 38 + Math.round(Math.random() * 28),
    }).toHex();
    setInputValue(nextColor);
    onChange(nextColor);
  }, [onChange]);

  const handleSliderChange = (channel: "h" | "s" | "l", nextValue: number) => {
    if (!currentHsl) return;
    const nextColor = colord({ ...currentHsl, [channel]: nextValue }).toHex();
    setInputValue(nextColor);
    onChange(nextColor);
  };

  const [openSection, setOpenSection] = useState<"canvas" | "value" | "board" | "precision">("canvas");

  return (
    <section aria-labelledby="base-color-heading" className="space-y-0">
      {/* Section Header */}
      <div className="mb-6 space-y-2">
        <p className="eyebrow">{t.colorInput.eyebrow}</p>
        <h2
          id="base-color-heading"
          className={cn("section-title leading-tight", isArabic && "leading-snug")}
        >
          {t.colorInput.title}
        </h2>
        <p className="section-copy max-w-full text-sm">{t.colorInput.copy}</p>
      </div>

      {/* ── Primary Action Bar ─────────────────────────────────── */}
      <div className="mb-4 grid grid-cols-3 gap-2">
        {/* Primary: Open Picker */}
        <button
          type="button"
          onClick={() => nativePickerRef.current?.click()}
          className={cn(
            "sidebar-btn sidebar-btn-primary col-span-3 sm:col-span-1",
            isArabic && "flex-row-reverse"
          )}
        >
          <Pipette className="h-[18px] w-[18px] shrink-0" />
          <span className="min-w-0 truncate text-[0.8rem] font-semibold">{t.colorInput.openPicker}</span>
        </button>

        {/* Secondary: Randomize */}
        <button
          type="button"
          onClick={handleRandomize}
          className={cn("sidebar-btn sidebar-btn-secondary", isArabic && "flex-row-reverse")}
        >
          <RefreshCcw className="h-[16px] w-[16px] shrink-0" />
          <span className="min-w-0 truncate text-[0.8rem]">{t.colorInput.randomize}</span>
        </button>

        {/* Ghost: Copy */}
        <button
          type="button"
          onClick={handleCopy}
          className={cn("sidebar-btn sidebar-btn-ghost", isArabic && "flex-row-reverse")}
        >
          {isCopied
            ? <Check className="h-[16px] w-[16px] shrink-0 text-[var(--success)]" />
            : <Copy className="h-[16px] w-[16px] shrink-0" />
          }
          <span className="min-w-0 truncate text-[0.8rem]">{isCopied ? t.colorInput.copied : t.colorInput.copyAction}</span>
        </button>
      </div>

      {/* ── Accordion Sections ────────────────────────────────── */}
      <div className="flex flex-col gap-2">
        {/* Live Canvas */}
        <AccordionSection
          id="canvas"
          title={t.colorInput.liveCanvas}
          badge={t.colorInput.realTime}
          isOpen={openSection === "canvas"}
          onToggle={() => setOpenSection(openSection === "canvas" ? "value" : "canvas")}
        >
          {/* Focal Color Preview */}
          <div className="relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-white/10 to-white/[0.03] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.16)]">
            <div
              className="absolute inset-0 opacity-80"
              style={{
                background: `radial-gradient(circle at 20% 20%, ${previewHex}50, transparent 38%), radial-gradient(circle at 80% 80%, ${previewHex}20, transparent 30%)`,
              }}
            />
            <div className="relative space-y-4">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                {t.colorInput.currentSource}
              </p>

              {/* Large color swatch — the main focal element */}
              <div
                className="h-[120px] w-full rounded-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.18)]"
                style={{
                  background: `linear-gradient(135deg, ${previewHex}, ${colord(previewHex).darken(0.22).toHex()})`,
                }}
              />

              {/* Color Values Grid: HEX | RGB / HSL full-width */}
              <div className="grid grid-cols-2 gap-2">
                <ColorChip label="HEX" value={previewHex} />
                <ColorChip label="RGB" value={currentRgb || "—"} />
                <div className="col-span-2">
                  <ColorChip
                    label="HSL"
                    value={
                      currentHsl
                        ? `hsl(${Math.round(currentHsl.h)}, ${Math.round(currentHsl.s)}%, ${Math.round(currentHsl.l)}%)`
                        : "—"
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </AccordionSection>

        {/* Color Value Input */}
        <AccordionSection
          id="value"
          title={t.colorInput.colorValue}
          badge={t.colorInput.liveInput}
          isOpen={openSection === "value"}
          onToggle={() => setOpenSection(openSection === "value" ? "canvas" : "value")}
        >
          <div
            className={cn(
              "field-shell min-w-0 px-3.5 py-3",
              isInvalid && "border-[color:var(--danger)] shadow-[0_0_0_1px_var(--danger)]"
            )}
          >
            {/* Native color picker trigger */}
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-white/15">
              <input
                ref={nativePickerRef}
                type="color"
                value={safeParseColor(value)?.toHex() ?? "#3b82f6"}
                onChange={(event) => onChange(event.target.value)}
                className="absolute -inset-2 h-20 w-20 cursor-pointer appearance-none border-0 bg-transparent p-0"
                aria-label={t.colorInput.openPicker}
              />
            </div>

            <div className="min-w-0 flex-1">
              <input
                id="base-color-input"
                type="text"
                value={inputValue}
                onChange={handleChange}
                placeholder="#3b82f6"
                spellCheck={false}
                autoComplete="off"
                maxLength={50}
                className="min-w-0 w-full bg-transparent text-base font-semibold text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)]"
                aria-describedby="base-color-help"
              />
              <p id="base-color-help" className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                {isInvalid ? t.colorInput.invalidColor : t.colorInput.validColor}
              </p>
            </div>
          </div>
        </AccordionSection>

        {/* Curated Palette Board */}
        <AccordionSection
          id="board"
          title={t.colorInput.curatedBoard}
          badge={`${boardRows.reduce((count, row) => count + row.swatches.length, 0)} ${t.colorInput.swatches}`}
          isOpen={openSection === "board"}
          onToggle={() => setOpenSection(openSection === "board" ? "canvas" : "board")}
        >
          <p className="mb-4 text-sm text-[var(--muted-foreground)]">{t.colorInput.curatedCopy}</p>

          <div className="space-y-3">
            {boardRows.map((row) => (
              <div
                key={row.label}
                className="rounded-xl border border-[color:var(--line)] bg-[var(--surface-float)] p-3"
              >
                <div className="mb-2.5 flex items-center justify-between gap-2">
                  <div>
                    <p className="text-[0.78rem] font-semibold text-[var(--foreground)]">{row.label}</p>
                    <p className="text-[0.68rem] text-[var(--muted-foreground)]">{row.meta}</p>
                  </div>
                  <span className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                    {t.colorInput.lane}
                  </span>
                </div>

                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {row.swatches.map((swatch) => (
                    <button
                      key={`${row.label}-${swatch}`}
                      type="button"
                      onClick={() => { setInputValue(swatch); onChange(swatch); }}
                      className={cn(
                        "h-8 min-w-8 rounded-lg border transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-ring)] focus-visible:ring-offset-2",
                        value.toLowerCase() === swatch.toLowerCase()
                          ? "border-[var(--accent-strong)] ring-2 ring-[var(--accent-soft)]"
                          : "border-white/15"
                      )}
                      style={{ backgroundColor: swatch }}
                      aria-label={`${row.label} ${swatch}`}
                      title={swatch}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Swatches */}
          <div className="mt-4 flex flex-wrap gap-2">
            {QUICK_SWATCHES.map((swatch) => (
              <button
                key={swatch}
                type="button"
                onClick={() => { setInputValue(swatch); onChange(swatch); }}
                className={cn(
                  "group inline-flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-[0.78rem] font-medium transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-ring)] focus-visible:ring-offset-2",
                  value.toLowerCase() === swatch.toLowerCase()
                    ? "border-[var(--accent-strong)] bg-[var(--surface-selected)] text-[var(--foreground)]"
                    : "border-[color:var(--line)] bg-[var(--surface-float)] text-[var(--muted-foreground)] hover:border-[color:var(--line-strong)] hover:text-[var(--foreground)]"
                )}
              >
                <span className="h-3.5 w-3.5 rounded-md border border-white/20" style={{ backgroundColor: swatch }} />
                <span className="font-mono text-[0.72rem]">{swatch}</span>
              </button>
            ))}
          </div>
        </AccordionSection>

        {/* Precision Tuning */}
        {currentHsl && (
          <AccordionSection
            id="precision"
            title={t.colorInput.precision}
            isOpen={openSection === "precision"}
            onToggle={() => setOpenSection(openSection === "precision" ? "canvas" : "precision")}
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-sm text-[var(--muted-foreground)]">{t.colorInput.precisionCopy}</p>
              <button type="button" onClick={handleRandomize} className="icon-button shrink-0" aria-label={t.colorInput.randomize}>
                <WandSparkles className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <SliderRow
                label="Hue"
                min={0} max={360}
                value={Math.round(currentHsl.h)}
                onChange={(v) => handleSliderChange("h", v)}
              />
              <SliderRow
                label="Saturation"
                min={0} max={100}
                value={Math.round(currentHsl.s)}
                onChange={(v) => handleSliderChange("s", v)}
              />
              <SliderRow
                label="Lightness"
                min={0} max={100}
                value={Math.round(currentHsl.l)}
                onChange={(v) => handleSliderChange("l", v)}
              />
            </div>
          </AccordionSection>
        )}
      </div>
    </section>
  );
}

function ColorChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[color:var(--line)] bg-[var(--surface-glass)] px-3 py-2.5">
      <p className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
        {label}
      </p>
      <p
        dir="ltr"
        className="mt-1 block w-full truncate text-left font-mono text-[0.78rem] font-medium text-[var(--foreground)]"
      >
        {value}
      </p>
    </div>
  );
}

function SliderRow({
  label, min, max, value, onChange,
}: {
  label: string; min: number; max: number; value: number; onChange: (value: number) => void;
}) {
  return (
    <div className="rounded-lg border border-[color:var(--line)] bg-[var(--surface-float)] px-3.5 py-3">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-[0.78rem] font-medium text-[var(--foreground)]">{label}</span>
        <span className="font-mono text-[0.72rem] tabular-nums text-[var(--muted-foreground)]">{value}</span>
      </div>
      <input
        type="range"
        min={min} max={max} value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[var(--muted)] accent-[var(--accent)]"
      />
    </div>
  );
}
