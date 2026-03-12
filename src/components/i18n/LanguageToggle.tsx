"use client";

import { cn } from "@/lib/utils/cn";
import { useLanguage } from "./LanguageProvider";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className="inline-flex h-11 items-center rounded-lg border border-[color:var(--line)] bg-[var(--surface-glass-strong)] p-1 shadow-[var(--shadow-soft)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(22,34,55,0.16)]"
      role="group"
      aria-label="Language switcher"
    >
      {(["en", "ar"] as const).map((option) => {
        const selected = language === option;

        return (
          <button
            key={option}
            type="button"
            onClick={() => setLanguage(option)}
            aria-pressed={selected}
            className={cn(
              "inline-flex h-9 min-w-[50px] items-center justify-center rounded-md px-3 text-sm font-semibold uppercase transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              selected
                ? "bg-[var(--surface-selected)] text-[var(--foreground)] shadow-[var(--shadow-soft)]"
                : "text-[var(--muted-foreground)] hover:scale-[1.03] hover:text-[var(--foreground)]"
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
