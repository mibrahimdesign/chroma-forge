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
    <div className="overflow-hidden rounded-xl border border-[color:var(--line)] bg-[var(--surface-glass-strong)] shadow-[var(--shadow-soft)] transition-all duration-300 backdrop-blur-sm">
      {/* Accordion Header */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`${id}-content`}
        className={cn(
          "flex w-full items-center justify-between px-4 outline-none transition-colors hover:bg-white/[0.04] focus-visible:bg-white/[0.04]",
          isOpen ? "py-3.5 pb-2" : "py-3.5"
        )}
      >
        {/* Title */}
        <span className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[var(--foreground)]">
          {title}
        </span>

        {/* Trailing: badge + chevron */}
        <div className="flex items-center gap-2">
          {badge && (
            <span className="rounded-md border border-[color:var(--line)] bg-[var(--surface-float)] px-2 py-[3px] text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
              {badge}
            </span>
          )}
          <svg
            className={cn(
              "h-3.5 w-3.5 shrink-0 text-[var(--muted-foreground)] transition-transform duration-300",
              isOpen ? "rotate-180" : ""
            )}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Collapsible Content */}
      <div
        id={`${id}-content`}
        className={cn(
          "grid transition-all duration-[400ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-4 pt-1">{children}</div>
        </div>
      </div>
    </div>
  );
}
