/**
 * =============================================================================
 * LAYOUT — Root Layout
 * =============================================================================
 *
 * The root layout wraps the ENTIRE application.
 * Loads fonts, metadata, and global providers.
 *
 * FONTS:
 * - Space Grotesk: headings and display text (--font-display)
 * - Inter: body text (--font-body)
 * - JetBrains Mono: code and mono values (--font-code)
 *
 * Owner: Frontend Lead (Team Member A)
 * =============================================================================
 */

import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-code",
  subsets: ["latin"],
  weight: ["400", "500"],
});

// ── SEO Metadata ────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "FounderOS — Intelligence Dashboard",
  description:
    "Enter your startup idea and let 6 specialized AI agents validate, research, plan, architect, and market it for you.",
  keywords: ["startup", "AI", "orchestration", "market research", "product management"],
  other: {
    "darkreader-lock": "true",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <TooltipProvider>
          {children}
        </TooltipProvider>
        <Toaster />
      </body>
    </html>
  );
}
