import * as React from "react";
import { cn } from "@/lib/utils/cn";

export function AccordionSection({
  id,
  title,
  badge,
  isOpen,
  onToggle,
  children,
}: {
  id: string;
  title: string;
  badge?: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="glass-panel-strong overflow-hidden transition-all duration-300 shadow-[var(--shadow-soft)] border-[color:var(--line)]">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`${id}-content`}
        className={cn(
          "flex w-full items-center justify-between p-4 outline-none transition-colors hover:bg-white/[0.02] focus-visible:bg-white/[0.02]",
          isOpen ? "pb-2" : ""
        )}
      >
        <span className="text-[0.8rem] font-bold uppercase tracking-[0.15em] text-[var(--foreground)]">{title}</span>
        <div className="flex items-center gap-3">
          {badge && (
            <span className="rounded-md border border-[color:var(--line)] bg-[var(--surface-float)] px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              {badge}
            </span>
          )}
          <svg
            className={cn("h-4 w-4 text-[var(--muted-foreground)] transition-transform duration-300", isOpen ? "rotate-180" : "")}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      <div
        id={`${id}-content`}
        className={cn(
          "grid transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className="p-4 pt-1">{children}</div>
        </div>
      </div>
    </div>
  );
}
