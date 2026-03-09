import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils/cn";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Chroma Forge | Premium Palette Generator",
  description: "Advanced interactive color scale generator tailored for serious design systems.",
};

import { AppLayout } from "@/components/layout/AppLayout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body
        className={cn(
          "min-h-screen bg-background font-sans text-foreground antialiased",
          "selection:bg-foreground selection:text-background"
        )}
      >
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
