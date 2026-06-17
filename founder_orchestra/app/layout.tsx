/**
 * =============================================================================
 * LAYOUT — Root Layout
 * =============================================================================
 *
 * The root layout wraps the ENTIRE application.
 * It provides: fonts, metadata, and global providers.
 *
 * WHAT'S A LAYOUT?
 * In Next.js App Router, layouts persist across page navigations.
 * This means the fonts and providers are loaded ONCE, not on every page.
 *
 * Owner: Frontend Lead (Team Member A)
 * =============================================================================
 */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ── SEO Metadata ────────────────────────────────────────────────────────────
// This controls what appears in browser tabs and search engine results.
// TODO (Team Member A): Update with your actual brand info
export const metadata: Metadata = {
  title: "Founders Orchestra — AI Startup Orchestration",
  description:
    "Enter your startup idea and let 6 specialized AI agents validate, research, plan, architect, and market it for you.",
  keywords: ["startup", "AI", "orchestration", "market research", "product management"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      // "dark" class enables dark mode by default
      // Remove "dark" to use light mode, or add a theme toggle
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </body>
    </html>
  );
}
