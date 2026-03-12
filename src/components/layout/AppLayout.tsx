"use client";

import Link from "next/link";
import { Sparkles, ShieldCheck } from "lucide-react";
import { LanguageToggle } from "@/components/i18n/LanguageToggle";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { getTranslations } from "@/lib/i18n/translations";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage();
  const t = getTranslations(language);

  return (
    <div className="app-shell flex min-h-screen flex-col" data-language={language}>
      <header className="sticky top-0 z-50 border-b border-[color:var(--line-soft)] bg-[color:var(--header-bg)] backdrop-blur-2xl">
        <div className="mx-auto flex w-full max-w-[1440px] items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg border border-white/15 bg-[linear-gradient(145deg,rgba(255,255,255,0.26),rgba(255,255,255,0.08))] shadow-[var(--shadow-soft)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.6),transparent_48%)]" />
              <div className="absolute inset-[7px] rounded-md border border-white/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.22),rgba(255,255,255,0.03))]" />
              <Sparkles className="relative z-10 h-5 w-5 text-[var(--foreground)]" />
            </div>

            <div className="min-w-0">
              <p className="truncate text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[var(--muted-foreground)]">
                {t.app.eyebrow}
              </p>
              <div className="flex items-center gap-3">
                <span className="truncate text-lg font-semibold tracking-[-0.03em] text-[var(--foreground)] sm:text-xl">
                  Chroma Forge
                </span>
                <span className="hidden rounded-md border border-[color:var(--line)] bg-[var(--surface-float)] px-2.5 py-1 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-[var(--muted-foreground)] sm:inline-flex">
                  {t.app.badge}
                </span>
              </div>
            </div>
          </Link>

          <div className="flex-1" />

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden items-center gap-2 rounded-lg border border-[color:var(--line)] bg-[var(--surface-float)] px-3.5 py-2 text-sm text-[var(--muted-foreground)] shadow-[var(--shadow-soft)] md:flex">
              <ShieldCheck className="h-4 w-4 text-[var(--accent-strong)]" />
              {t.app.localFirst}
            </div>

            <LanguageToggle />
            <ThemeToggle />

            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 items-center rounded-lg border border-[color:var(--line)] bg-[var(--surface-glass)] px-4 text-sm font-medium text-[var(--foreground)] shadow-[var(--shadow-soft)] backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5 hover:border-[color:var(--line-strong)] hover:bg-[var(--surface-float)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              GitHub
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-[color:var(--line-soft)] py-8">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-3 px-4 text-sm text-[var(--muted-foreground)] sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p className="leading-relaxed">{t.app.footerLead}</p>
          <p className="font-medium text-[var(--foreground-soft)]">
            {t.app.footerTail}
          </p>
        </div>
      </footer>
    </div>
  );
}
