/**
 * =============================================================================
 * LAYOUT — Dashboard Layout
 * =============================================================================
 *
 * This layout wraps all pages under /dashboard/*.
 * It provides the sidebar + main content area structure.
 *
 * STRUCTURE:
 * ┌──────────┬────────────────────────────────────┐
 * │          │                                    │
 * │ Sidebar  │         Main Content               │
 * │          │         (page.tsx renders here)     │
 * │          │                                    │
 * └──────────┴────────────────────────────────────┘
 *
 * Owner: Frontend Lead (Team Member A)
 * =============================================================================
 */

import { Sidebar } from "@/components/dashboard/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* ── Sidebar (left) ─────────────────────────────────────────────── */}
      <Sidebar />

      {/* ── Main Content (right) ───────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
