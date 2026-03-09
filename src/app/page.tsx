"use client";

import { useColorState } from "@/hooks/useColorState";
import { generatePalette } from "@/lib/color/engine";
import { ColorInput } from "@/components/features/color-generator/ColorInput";
import { PaletteControls } from "@/components/features/color-generator/PaletteControls";
import { PaletteDisplay } from "@/components/features/color-generator/PaletteDisplay";
import { ExportPanel } from "@/components/features/export/ExportPanel";

export default function Home() {
  const { isClient, config, setConfig, resetConfig } = useColorState();

  // Protect hydration
  if (!isClient) {
    return <div className="min-h-screen bg-background" />;
  }

  const shades = generatePalette(config.baseColor, config.mode);

  return (
    <>
      <div className="container mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
        <div className="mb-10 max-w-2xl">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Design System Generator
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            A precise, high-performance color scale creator for engineering teams. Secure, fast, and fully local.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Controls Sidebar */}
          <div className="flex flex-col gap-6 lg:col-span-4">
            <div className="rounded-xl border bg-card p-5 shadow-sm">
              <ColorInput 
                value={config.baseColor} 
                onChange={(c) => setConfig({ baseColor: c })} 
              />
            </div>
            
            <PaletteControls 
              mode={config.mode}
              namingPrefix={config.namingPrefix}
              onModeChange={(m) => setConfig({ mode: m })}
              onPrefixChange={(p) => setConfig({ namingPrefix: p })}
            />

            <button
              onClick={resetConfig}
              className="mt-2 text-sm font-medium text-muted-foreground hover:text-foreground flex self-start"
            >
              Reset to Defaults
            </button>
          </div>

          {/* Display & Export Area */}
          <div className="flex flex-col gap-10 lg:col-span-8">
            <PaletteDisplay shades={shades} />
            <ExportPanel shades={shades} prefix={config.namingPrefix || "primary"} />
          </div>
        </div>
      </div>
    </>
  );
}
