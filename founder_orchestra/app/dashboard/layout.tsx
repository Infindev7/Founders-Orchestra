/**
 * =============================================================================
 * LAYOUT — Dashboard Layout
 * =============================================================================
 *
 * Wraps all dashboard pages with the sidebar + topbar chrome.
 *
 * Owner: Frontend Lead (Team Member A)
 * =============================================================================
 */

"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { PdfExportModal } from "@/components/dashboard/pdf-export-modal";
import { useProjectStore } from "@/lib/store/project-store";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pdfModalOpen = useProjectStore((s) => s.pdfModalOpen);
  const setPdfModalOpen = useProjectStore((s) => s.setPdfModalOpen);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-fo-bg overflow-x-hidden">
      {/* Sidebar handles both desktop (fixed) and mobile (sheet overlay) states */}
      <Sidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
      
      <main className="ml-0 md:ml-[240px] flex-1 flex flex-col min-h-screen w-full transition-all duration-300">
        <Topbar
          onExportPdf={() => setPdfModalOpen(true)}
          onRunAll={() => {
            // TODO (Team Member B): Wire to orchestrate API
            console.log("Run all agents clicked");
          }}
          onMenuClick={() => setMobileOpen(true)}
        />
        <div className="flex-1 p-4 sm:p-7 sm:px-8">
          {children}
        </div>
      </main>
      <PdfExportModal open={pdfModalOpen} onOpenChange={setPdfModalOpen} />
    </div>
  );
}
