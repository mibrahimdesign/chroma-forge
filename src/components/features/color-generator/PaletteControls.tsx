import { useState } from "react";
import { Braces, Sparkles } from "lucide-react";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { GenerationMode } from "@/lib/color/engine";
import { getTranslations } from "@/lib/i18n/translations";
import { cn } from "@/lib/utils/cn";
import { AccordionSection } from "@/components/ui/AccordionSection";

interface PaletteControlsProps {
  mode: GenerationMode;
  groupName: string;
  namingPrefix: string;
  onModeChange: (mode: GenerationMode) => void;
  onGroupNameChange: (groupName: string) => void;
  onPrefixChange: (prefix: string) => void;
}

export function PaletteControls({
  mode,
  groupName,
  namingPrefix,
  onModeChange,
  onGroupNameChange,
  onPrefixChange,
}: PaletteControlsProps) {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const t = getTranslations(language);
  const modes: { value: GenerationMode; label: string; desc: string }[] = [
    { value: "tailwind", ...t.controls.modes.tailwind },
    { value: "perceptual", ...t.controls.modes.perceptual },
    { value: "balanced", ...t.controls.modes.balanced },
    { value: "vivid", ...t.controls.modes.vivid },
    { value: "muted", ...t.controls.modes.muted },
  ];
  const safePrefix = namingPrefix || "primary";
  const safeGroupName = groupName || "Primary Blue";
  
  const [openSection, setOpenSection] = useState<"profile" | "name" | "export">("profile");

  return (
    <section aria-labelledby="config-heading" className="space-y-0">
      <div className="mb-6 space-y-2">
        <p className="eyebrow">{t.controls.eyebrow}</p>
        <h2 id="config-heading" className="section-title">
          {t.controls.title}
        </h2>
        <p className="section-copy text-sm">{t.controls.copy}</p>
      </div>

      <div className="flex flex-col gap-2">
        <AccordionSection
          id="profile"
          title={t.controls.generationProfile}
          badge={mode}
          isOpen={openSection === "profile"}
          onToggle={() => setOpenSection(openSection === "profile" ? "name" : "profile")}
        >
          <div className="grid gap-2">
            {modes.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => onModeChange(item.value)}
                aria-pressed={mode === item.value}
                className={cn(
                  "group relative overflow-hidden rounded-xl border p-3.5 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  mode === item.value
                    ? "border-[color:var(--line-strong)] bg-[var(--surface-selected)] shadow-[var(--shadow-soft)]"
                    : "border-[color:var(--line)] bg-[var(--surface-glass)] hover:-translate-y-0.5 hover:border-[color:var(--line-strong)] hover:bg-[var(--surface-float)]"
                )}
              >
                <div className="absolute inset-0 opacity-80 [background:radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_45%)]" />
                <div className="relative flex items-start justify-between gap-3">
                  <div className={cn(isArabic && "text-right")}>
                    <p className="text-sm font-semibold text-[var(--foreground)]">{item.label}</p>
                    <p className="mt-1 text-sm leading-5 text-[var(--muted-foreground)]">{item.desc}</p>
                  </div>
                  <span
                    className={cn(
                      "mt-0.5 h-3.5 w-3.5 rounded-sm border transition-all",
                      mode === item.value
                        ? "border-[var(--accent-strong)] bg-[var(--accent-strong)] shadow-[0_0_0_4px_var(--accent-soft)]"
                        : "border-[color:var(--line-strong)] bg-transparent"
                    )}
                  />
                </div>
              </button>
            ))}
          </div>
        </AccordionSection>

        <AccordionSection
          id="name"
          title={t.controls.paletteGroupName}
          badge={safeGroupName}
          isOpen={openSection === "name"}
          onToggle={() => setOpenSection(openSection === "name" ? "export" : "name")}
        >
          <div className="space-y-3">
            <div className="field-shell px-4 py-3">
              <Sparkles className="h-4 w-4 text-[var(--muted-foreground)]" />
              <input
                id="group-name-input"
                type="text"
                value={groupName}
                onChange={(event) => onGroupNameChange(event.target.value)}
                placeholder="Primary Blue"
                maxLength={40}
                spellCheck={false}
                className={cn(
                  "min-w-0 flex-1 bg-transparent text-base font-medium text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)]",
                  isArabic && "text-right"
                )}
              />
            </div>
            <p className="text-sm text-[var(--muted-foreground)]">{t.controls.paletteGroupHelp}</p>
          </div>
        </AccordionSection>

        <AccordionSection
          id="export"
          title={t.controls.exportKey}
          badge={safePrefix}
          isOpen={openSection === "export"}
          onToggle={() => setOpenSection(openSection === "export" ? "profile" : "export")}
        >
          <div className="space-y-3">
            <div className="field-shell px-4 py-3">
              <Braces className="h-4 w-4 text-[var(--muted-foreground)]" />
              <input
                id="prefix-input"
                type="text"
                value={namingPrefix}
                onChange={(event) => onPrefixChange(event.target.value)}
                placeholder="primary"
                maxLength={20}
                spellCheck={false}
                className="min-w-0 flex-1 bg-transparent text-base font-medium text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)] data-code"
              />
            </div>
            <div className="glass-panel-strong flex items-center justify-between gap-3 px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                <Sparkles className="h-4 w-4 text-[var(--accent-strong)]" />
                {t.controls.groupPreview}
              </div>
              <div className={cn("text-right", isArabic && "text-left")}>
                <div className="text-sm font-medium text-[var(--foreground)]">{safeGroupName}</div>
                <span className="font-mono text-[0.82rem] text-[var(--muted-foreground)] data-code">{`--color-${safePrefix}-500`}</span>
              </div>
            </div>
          </div>
        </AccordionSection>
      </div>
    </section>
  );
}
