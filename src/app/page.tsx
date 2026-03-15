"use client";

import { useMemo } from "react";
import { Sparkles } from "lucide-react";
import { ColorInput } from "@/components/features/color-generator/ColorInput";
import { ThemeManager } from "@/components/features/color-generator/ThemeManager";
import { PaletteControls } from "@/components/features/color-generator/PaletteControls";
import { PaletteDisplay } from "@/components/features/color-generator/PaletteDisplay";
import { ExportPanel } from "@/components/features/export/ExportPanel";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { useColorState } from "@/hooks/useColorState";
import { createShade, generatePalette } from "@/lib/color/engine";
import { ExportPalette } from "@/lib/export/builders";
import { getTranslations } from "@/lib/i18n/translations";
import { cn } from "@/lib/utils/cn";

export default function Home() {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const t = getTranslations(language);
  const {
    state,
    activePalette,
    setActivePalette,
    addPalette,
    removePalette,
    updateActivePalette,
    setShadeOverride,
    clearShadeOverride,
    clearAllShadeOverrides,
    resetAllState,
  } = useColorState();

  const generatedShades = generatePalette(activePalette.baseColor, activePalette.mode);
  const shades = useMemo(
    () =>
      generatedShades.map((shade) => {
        const overrideColor = activePalette.shadeOverrides[shade.name];
        return overrideColor ? createShade(shade.name, overrideColor) ?? shade : shade;
      }),
    [activePalette.shadeOverrides, generatedShades]
  );
  
  const themeOutputs: ExportPalette[] = useMemo(() => {
    return state.palettes.map((p) => {
      const pShades = generatePalette(p.baseColor, p.mode).map((shade) => {
        const overrideColor = p.shadeOverrides[shade.name];
        return overrideColor ? createShade(shade.name, overrideColor) ?? shade : shade;
      });
      return {
        prefix: p.namingPrefix || "primary",
        shades: pShades,
      };
    });
  }, [state.palettes]);

  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <section id="workspace" className="grid gap-5 xl:grid-cols-[minmax(300px,360px)_minmax(0,1fr)]">
        <aside className="flex flex-col gap-5 xl:sticky xl:top-24 xl:self-start">
          <div className="glass-panel px-5 py-5 sm:px-6">
            <ThemeManager
              palettes={state.palettes}
              activeId={state.activeId}
              onSelect={setActivePalette}
              onAdd={addPalette}
              onRemove={removePalette}
            />
          </div>

          <div className="glass-panel px-5 py-5 sm:px-6">
            <ColorInput
              value={activePalette.baseColor}
              onChange={(color) => updateActivePalette({ baseColor: color })}
            />
          </div>

          <PaletteControls
            mode={activePalette.mode}
            groupName={activePalette.groupName}
            namingPrefix={activePalette.namingPrefix}
            onModeChange={(mode) => updateActivePalette({ mode })}
            onGroupNameChange={(groupName) => updateActivePalette({ groupName })}
            onPrefixChange={(prefix) => updateActivePalette({ namingPrefix: prefix })}
          />

          <div className="glass-panel flex items-center justify-between gap-4 px-4 py-4 sm:px-5">
            <div>
              <p className="text-sm font-medium text-[var(--foreground)]">{t.page.workspaceState}</p>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                {t.page.workspaceCopy}
              </p>
            </div>
            <button type="button" onClick={resetAllState} className="subtle-button whitespace-nowrap">
              {t.page.reset}
            </button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-col gap-6">
          <PaletteDisplay
            shades={shades}
            shadeOverrides={activePalette.shadeOverrides}
            onShadeOverride={setShadeOverride}
            onClearShadeOverride={clearShadeOverride}
            onClearAllOverrides={clearAllShadeOverrides}
          />
          <ExportPanel palettes={themeOutputs} />
        </div>
      </section>
    </div>
  );
}

