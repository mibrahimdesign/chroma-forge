import { FileCode, Wind, FileCode2, FileJson, FileLock2, Figma, Image, PenTool, BookOpen, Smartphone, Apple, Check, Copy } from "lucide-react";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { getTranslations } from "@/lib/i18n/translations";
import { ExportFormat, EXPORT_REGISTRY } from "@/lib/export/registry";
import { cn } from "@/lib/utils/cn";

interface ExportFormatGridProps {
  activeFormatId: string;
  onFormatSelect: (formatId: string) => void;
}

const ICONS: Record<string, React.ElementType> = {
  FileCode,
  Wind,
  FileCode2,
  FileJson,
  FileLock2,
  Figma,
  Image,
  PenTool,
  BookOpen,
  Smartphone,
  Apple,
};

export function ExportFormatGrid({ activeFormatId, onFormatSelect }: ExportFormatGridProps) {
  const { language } = useLanguage();
  const t = getTranslations(language);

  const developerFormats = EXPORT_REGISTRY.filter((f) => f.groupId === "developer");
  const designFormats = EXPORT_REGISTRY.filter((f) => f.groupId === "design");
  const mobileFormats = EXPORT_REGISTRY.filter((f) => f.groupId === "mobile");

  const renderGroup = (title: string, formats: ExportFormat[]) => (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
        {title}
      </h3>
      <div
        role="tablist"
        aria-label={title}
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 items-stretch"
      >
        {formats.map((format) => {
          const selected = format.id === activeFormatId;
          const IconComponent = ICONS[format.iconName] || FileCode;

          return (
            <button
              key={format.id}
              type="button"
              role="tab"
              aria-selected={selected}
              tabIndex={selected ? 0 : -1}
              onClick={() => onFormatSelect(format.id)}
              className={cn(
                "flex h-full flex-col items-start gap-2 rounded-xl border p-4 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                selected
                  ? "border-[color:var(--accent-strong)] bg-[color:var(--accent-strong)]/10 text-[var(--foreground)] shadow-[0_0_12px_rgba(var(--accent-rgb),0.2)] ring-1 ring-[var(--accent-strong)]"
                  : "border-[color:var(--line)] bg-[var(--surface-float)] text-[var(--muted-foreground)] hover:border-[color:var(--line-strong)] hover:bg-[var(--surface-glass)] hover:text-[var(--foreground)] hover:-translate-y-0.5"
              )}
            >
              <IconComponent className={cn("h-5 w-5", selected ? "text-[var(--accent-strong)]" : "text-[var(--muted-foreground)]")} />
              <div className="text-left mt-1">
                <p className="text-sm font-semibold leading-tight">{t.export[format.labelKey as keyof typeof t.export] as string}</p>
                <p className="mt-0.5 text-[0.65rem] leading-tight opacity-70 line-clamp-2">
                  {t.export[format.descKey as keyof typeof t.export] as string}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {renderGroup(t.export.groups.developer, developerFormats)}
      {renderGroup(t.export.groups.design, designFormats)}
      {mobileFormats.length > 0 && renderGroup((t.export.groups as any).mobile, mobileFormats)}
    </div>
  );
}
