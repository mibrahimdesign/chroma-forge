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
    if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
      return;
    }

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

    const nextColor = colord({
      ...currentHsl,
      [channel]: nextValue,
    }).toHex();

    setInputValue(nextColor);
    onChange(nextColor);
  };

  const actionLabel = isCopied ? t.colorInput.copied : t.colorInput.copyAction;
  const [openSection, setOpenSection] = useState<"canvas" | "value" | "board" | "precision">("canvas");

  return (
    <section aria-labelledby="base-color-heading" className="space-y-4 overflow-hidden">
      <div className="space-y-3">
        <p className="eyebrow">{t.colorInput.eyebrow}</p>
        <h2 id="base-color-heading" className={cn("section-title max-w-[14ch] leading-[1.04]", isArabic && "max-w-none leading-[1.2]")}>
          {t.colorInput.title}
        </h2>
        <p className="section-copy max-w-[30rem]">{t.colorInput.copy}</p>
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        <button
          type="button"
          onClick={() => nativePickerRef.current?.click()}
          className="subtle-button w-full justify-center px-4 py-3 text-sm"
        >
          <Pipette className="h-4 w-4" />
          {t.colorInput.openPicker}
        </button>
        <button type="button" onClick={handleRandomize} className="subtle-button w-full justify-center px-4 py-3 text-sm">
          <RefreshCcw className="h-4 w-4" />
          {t.colorInput.randomize}
        </button>
        <button type="button" onClick={handleCopy} className="subtle-button w-full justify-center px-4 py-3 text-sm">
          {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {actionLabel}
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <AccordionSection
          id="canvas"
          title={t.colorInput.liveCanvas}
          badge={t.colorInput.realTime}
          isOpen={openSection === "canvas"}
          onToggle={() => setOpenSection(openSection === "canvas" ? "value" : "canvas")}
        >
          <div className="relative overflow-hidden rounded-xl border border-white/15 bg-[linear-gradient(145deg,rgba(255,255,255,0.2),rgba(255,255,255,0.04))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
            <div
              className="absolute inset-0 opacity-90"
              style={{
                background: `radial-gradient(circle at 18% 20%, ${previewHex}40, transparent 34%), radial-gradient(circle at 82% 18%, ${previewHex}20, transparent 28%), linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.02))`,
              }}
            />

            <div className="relative space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-lg font-semibold tracking-[-0.03em] text-[var(--foreground)]">{t.colorInput.currentSource}</p>
                </div>
              </div>

              <div
                className="min-h-[160px] rounded-xl border border-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.26),0_20px_48px_rgba(15,23,42,0.16)]"
                style={{
                  background: `linear-gradient(135deg, ${previewHex}, ${colord(previewHex).darken(0.25).toHex()})`,
                }}
              />

              <div className="grid gap-3 sm:grid-cols-3">
                <InfoTile label="HEX" value={previewHex} />
                <InfoTile label="RGB" value={currentRgb || "--"} />
                <InfoTile
                  label="HSL"
                  value={
                    currentHsl
                      ? `hsl(${Math.round(currentHsl.h)}, ${Math.round(currentHsl.s)}%, ${Math.round(currentHsl.l)}%)`
                      : "--"
                  }
                />
              </div>
            </div>
          </div>
        </AccordionSection>

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
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-white/15 shadow-[var(--shadow-soft)]">
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
                className="min-w-0 w-full bg-transparent text-lg font-semibold text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)]"
                aria-describedby="base-color-help"
              />
              <p id="base-color-help" className="mt-1 text-sm text-[var(--muted-foreground)]">
                {isInvalid ? t.colorInput.invalidColor : t.colorInput.validColor}
              </p>
            </div>
          </div>
        </AccordionSection>

        <AccordionSection
          id="board"
          title={t.colorInput.curatedBoard}
          badge={`${boardRows.reduce((count, row) => count + row.swatches.length, 0)} ${t.colorInput.swatches}`}
          isOpen={openSection === "board"}
          onToggle={() => setOpenSection(openSection === "board" ? "canvas" : "board")}
        >
          <p className="mt-1 mb-4 text-sm text-[var(--muted-foreground)]">{t.colorInput.curatedCopy}</p>
          <div className="space-y-3">
            {boardRows.map((row) => (
              <div
                key={row.label}
                className="rounded-xl border border-[color:var(--line)] bg-[var(--surface-float)] px-3 py-3 shadow-[var(--shadow-soft)]"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[var(--foreground)]">{row.label}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">{row.meta}</p>
                  </div>
                  <span className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                    {t.colorInput.lane}
                  </span>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1">
                  {row.swatches.map((swatch) => (
                    <button
                      key={`${row.label}-${swatch}`}
                      type="button"
                      onClick={() => {
                        setInputValue(swatch);
                        onChange(swatch);
                      }}
                      className={cn(
                        "h-9 min-w-9 rounded-[10px] border transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                        value.toLowerCase() === swatch.toLowerCase()
                          ? "border-[var(--accent-strong)] ring-2 ring-[var(--accent-soft)] shadow-[0_18px_40px_rgba(35,91,224,0.16)]"
                          : "border-white/15 shadow-[var(--shadow-soft)]"
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

          <div className="mt-4 flex flex-wrap gap-2">
            {QUICK_SWATCHES.map((swatch) => (
              <button
                key={swatch}
                type="button"
                onClick={() => {
                  setInputValue(swatch);
                  onChange(swatch);
                }}
                className={cn(
                  "group inline-flex items-center gap-2 rounded-lg border px-2.5 py-2 text-sm text-[var(--foreground)] shadow-[var(--shadow-soft)] transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  value.toLowerCase() === swatch.toLowerCase()
                    ? "border-[var(--accent-strong)] bg-[var(--surface-selected)]"
                    : "border-[color:var(--line)] bg-[var(--surface-float)] hover:border-[color:var(--line-strong)]"
                )}
              >
                <span className="h-4 w-4 rounded-md border border-white/20" style={{ backgroundColor: swatch }} />
                <span className="font-mono text-[0.78rem]">{swatch}</span>
              </button>
            ))}
          </div>
        </AccordionSection>

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

            <div className="space-y-4">
              <SliderRow
                label="Hue"
                min={0}
                max={360}
                value={Math.round(currentHsl.h)}
                onChange={(nextValue) => handleSliderChange("h", nextValue)}
              />
              <SliderRow
                label="Saturation"
                min={0}
                max={100}
                value={Math.round(currentHsl.s)}
                onChange={(nextValue) => handleSliderChange("s", nextValue)}
              />
              <SliderRow
                label="Lightness"
                min={0}
                max={100}
                value={Math.round(currentHsl.l)}
                onChange={(nextValue) => handleSliderChange("l", nextValue)}
              />
            </div>
          </AccordionSection>
        )}
      </div>
    </section>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[color:var(--line)] bg-[var(--surface-float)] px-4 py-3 shadow-[var(--shadow-soft)]">
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">{label}</p>
      <p className="mt-2 break-all font-mono text-sm text-[var(--foreground)]">{value}</p>
    </div>
  );
}

function SliderRow({
  label,
  min,
  max,
  value,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block rounded-xl border border-[color:var(--line)] bg-[var(--surface-float)] px-4 py-4 shadow-[var(--shadow-soft)]">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-[var(--foreground)]">{label}</span>
        <span className="font-mono text-xs text-[var(--muted-foreground)]">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2.5 w-full cursor-pointer appearance-none rounded-md bg-[var(--muted)] accent-[var(--accent)]"
      />
    </label>
  );
}
