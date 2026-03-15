import { Plus, X } from "lucide-react";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { getTranslations } from "@/lib/i18n/translations";
import { cn } from "@/lib/utils/cn";
import { ColorConfig } from "@/hooks/useColorState";

interface ThemeManagerProps {
  palettes: ColorConfig[];
  activeId: string;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
}

export function ThemeManager({
  palettes,
  activeId,
  onSelect,
  onAdd,
  onRemove,
}: ThemeManagerProps) {
  const { language } = useLanguage();
  const t = getTranslations(language);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
          {t.themeManager?.title || "Theme Colors"}
        </h3>
      </div>
      
      <div className="flex flex-wrap items-center gap-2">
        {palettes.map((palette) => {
          const isActive = palette.id === activeId;
          return (
            <div
              key={palette.id}
              className={cn(
                "group relative flex items-center rounded-lg border transition-all duration-200",
                isActive
                  ? "border-[color:var(--accent-strong)] bg-[color:var(--accent-strong)]/10 shadow-[0_0_12px_rgba(var(--accent-rgb),0.2)]"
                  : "border-[color:var(--line)] bg-[var(--surface-float)] hover:border-[color:var(--line-strong)] hover:bg-[var(--surface-glass)]"
              )}
            >
              <button
                type="button"
                onClick={() => onSelect(palette.id)}
                className="flex items-center gap-2 px-3 py-2 outline-none"
              >
                <span
                  className="h-3 w-3 rounded-full border border-black/20"
                  style={{ backgroundColor: palette.baseColor }}
                  aria-hidden="true"
                />
                <span
                  className={cn(
                    "text-sm font-medium transition-colors",
                    isActive ? "text-[var(--foreground)]" : "text-[var(--muted-foreground)]"
                  )}
                >
                  {palette.groupName}
                </span>
              </button>
              
              {palettes.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(palette.id);
                  }}
                  className={cn(
                    "flex items-center justify-center pr-2 pl-1 text-[var(--muted-foreground)] transition-colors hover:text-red-400 outline-none",
                    !isActive && "opacity-0 group-hover:opacity-100"
                  )}
                  aria-label="Remove palette"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          );
        })}
        
        <button
          type="button"
          onClick={() => onAdd()}
          className="flex items-center gap-1.5 rounded-lg border border-dashed border-[color:var(--line-strong)] px-3 py-2 text-sm font-medium text-[var(--muted-foreground)] transition-colors hover:border-[color:var(--accent-strong)] hover:bg-[color:var(--accent-strong)]/5 hover:text-[var(--foreground)]"
        >
          <Plus className="h-4 w-4" />
          {t.themeManager?.add || "Add Color"}
        </button>
      </div>
    </div>
  );
}
