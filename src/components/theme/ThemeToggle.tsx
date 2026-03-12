"use client";

import { Moon, SunMedium } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        "group relative inline-flex h-11 w-[88px] items-center rounded-lg border px-1 transition-all duration-300",
        "border-[color:var(--line)] bg-[var(--surface-glass-strong)] shadow-[var(--shadow-soft)] backdrop-blur-xl",
        "hover:-translate-y-0.5 hover:border-[color:var(--line-strong)] hover:bg-[var(--surface-float)] hover:shadow-[0_18px_40px_rgba(22,34,55,0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      )}
      aria-label={`Activate ${isDark ? "light" : "dark"} theme`}
      aria-pressed={isDark}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute left-1 top-1 h-9 w-9 rounded-md border transition-transform duration-300 ease-out",
          "border-white/15 bg-[linear-gradient(180deg,rgba(255,255,255,0.7),rgba(255,255,255,0.18))] shadow-[0_8px_24px_rgba(15,23,42,0.2)]",
          isDark ? "translate-x-[39px]" : "translate-x-0"
        )}
      />

      <span className="relative z-10 flex w-full items-center justify-between px-1 text-[color:var(--muted-foreground)]">
        <span
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-md transition-colors",
            !isDark && "text-[var(--foreground)]"
          )}
        >
          <SunMedium className="h-[18px] w-[18px]" />
        </span>
        <span
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-md transition-colors",
            isDark && "text-[var(--foreground)]"
          )}
        >
          <Moon className="h-[18px] w-[18px]" />
        </span>
      </span>
    </button>
  );
}
