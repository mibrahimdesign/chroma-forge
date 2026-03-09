import { ColorShade } from "@/lib/color/engine";
import { useCallback, useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function PaletteDisplay({ shades }: { shades: ColorShade[] }) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xl font-bold tracking-tight">Generated Palette</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-11">
        {shades.map((shade) => (
          <ColorCard key={shade.name} shade={shade} />
        ))}
      </div>
    </div>
  );
}

function ColorCard({ shade }: { shade: ColorShade }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shade.hex);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("Clipboard copy failed", e);
    }
  }, [shade.hex]);

  // Accessibility checking
  const a11yWarning = shade.contrastWithWhite < 4.5 && shade.contrastWithBlack < 4.5;
  const textColor = shade.isLight ? "#000000" : "#ffffff";

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "group relative flex aspect-square flex-col justify-between overflow-hidden rounded-xl border p-3 text-left shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "hover:scale-[1.02] hover:shadow-md"
      )}
      style={{ backgroundColor: shade.hex, color: textColor }}
      title={`Copy ${shade.hex}`}
      aria-label={`Copy color ${shade.name}, hex ${shade.hex}`}
    >
      <div className="flex items-start justify-between">
        <span className="text-sm font-bold">{shade.name}</span>
        {copied && <Check className="h-4 w-4 opacity-70" />}
      </div>

      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium uppercase tracking-wider opacity-90">{shade.hex}</span>
        {a11yWarning && (
          <span className="text-[10px] font-semibold text-red-500 bg-white/80 dark:bg-black/80 px-1 py-0.5 rounded leading-none w-max mt-1">
            Low Contrast
          </span>
        )}
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/10 opacity-0 transition-opacity group-hover:opacity-100 group-focus:opacity-100">
        {!copied && <Copy className="h-6 w-6 opacity-75" color={textColor} />}
      </div>
    </button>
  );
}
