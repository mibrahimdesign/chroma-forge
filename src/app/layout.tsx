import type { Metadata } from "next";
import { Cairo, JetBrains_Mono, Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { LanguageProvider } from "@/components/i18n/LanguageProvider";
import { AppLayout } from "@/components/layout/AppLayout";

const fontOutfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const fontCairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Chroma Forge | Premium Palette Generator",
  description: "Advanced interactive color scale generator tailored for serious design systems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${fontOutfit.variable} ${fontCairo.variable} ${fontMono.variable}`}>
      <body
        className="min-h-screen bg-background font-sans text-foreground antialiased selection:bg-[var(--selection-bg)] selection:text-[var(--selection-fg)]"
      >
        <ThemeProvider>
          <LanguageProvider>
            <AppLayout>{children}</AppLayout>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
