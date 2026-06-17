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

  return (
    <div className="flex min-h-screen bg-fo-bg">
      <Sidebar />
      <main className="ml-[240px] flex-1 flex flex-col min-h-screen">
        <Topbar
          onExportPdf={() => setPdfModalOpen(true)}
          onRunAll={() => {
            // TODO (Team Member B): Wire to orchestrate API
            console.log("Run all agents clicked");
          }}
        />
        <div className="flex-1 p-7 px-8">
          {children}
        </div>
      </main>
      <PdfExportModal open={pdfModalOpen} onOpenChange={setPdfModalOpen} />
    </div>
  );
}
