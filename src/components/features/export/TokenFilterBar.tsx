import { Search } from "lucide-react";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { getTranslations } from "@/lib/i18n/translations";
import { TokenCategory } from "@/lib/export/pipeline/types";
import { cn } from "@/lib/utils/cn";

interface TokenFilterBarProps {
  category: TokenCategory | "all";
  onCategoryChange: (category: TokenCategory | "all") => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function TokenFilterBar({
  category,
  onCategoryChange,
  searchQuery,
  onSearchChange,
}: TokenFilterBarProps) {
  const { language } = useLanguage();
  const t = getTranslations(language);

  const categories: { id: TokenCategory | "all"; label: string }[] = [
    { id: "all", label: t.export.filters.all },
    { id: "colors", label: t.export.filters.colors },
    { id: "typography", label: t.export.filters.typography },
    { id: "spacing", label: t.export.filters.spacing },
    { id: "radius", label: t.export.filters.radius },
    { id: "shadows", label: t.export.filters.shadows },
  ];

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div
        role="tablist"
        aria-label="Filter tokens by category"
        className="flex flex-wrap gap-2"
      >
        {categories.map((cat) => {
          const isSelected = category === cat.id;
          return (
            <button
              key={cat.id}
              role="tab"
              aria-selected={isSelected}
              onClick={() => onCategoryChange(cat.id)}
              className={cn(
                "rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.1em] transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-ring)] focus-visible:ring-offset-2",
                isSelected
                  ? "bg-[var(--accent-strong)] text-[var(--foreground)] shadow-[0_0_12px_rgba(var(--accent-rgb),0.3)] ring-1 ring-[var(--accent-strong)]"
                  : "bg-[var(--surface-float)] text-[var(--muted-foreground)] hover:bg-[var(--surface-glass)] hover:text-[var(--foreground)] hover:-translate-y-0.5"
              )}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      <div className="relative flex-1 sm:max-w-[280px]">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-4 w-4 text-[var(--muted-foreground)]" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t.export.searchPlaceholder}
          className="field-shell w-full bg-[var(--surface-float)] py-2 pl-9 pr-4 text-sm font-medium text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:bg-[var(--surface-glass)]"
        />
      </div>
    </div>
  );
}
