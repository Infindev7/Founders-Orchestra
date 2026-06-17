/**
 * =============================================================================
 * COMPONENT — PDF Export Button
 * =============================================================================
 *
 * Button that triggers PDF report generation and download.
 * Shows loading state while the PDF is being generated.
 *
 * HOW IT WORKS:
 * 1. User clicks "Export PDF"
 * 2. We send the project ID to /api/report
 * 3. The API generates a PDF and returns it
 * 4. We trigger a browser download
 *
 * TODO (Team Member A):
 * - Add a preview modal before download
 * - Add format options (PDF, Markdown, DOCX)
 * - Add email option (send report via email)
 *
 * Owner: Frontend Lead (Team Member A)
 * =============================================================================
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useProjectStore } from "@/lib/store/project-store";
import { Download, Loader2 } from "lucide-react";

export function PdfExportButton() {
  const [isGenerating, setIsGenerating] = useState(false);
  const projectId = useProjectStore((s) => s.projectId);

  const handleExport = async () => {
    if (!projectId) {
      // TODO: Show a toast notification
      console.warn("No project ID available for export");
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate report");
      }

      // ── Check if the response is a PDF or JSON ────────────────────────
      const contentType = response.headers.get("Content-Type");

      if (contentType?.includes("application/pdf")) {
        // Download the PDF
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "startup-report.pdf";
        link.click();
        URL.revokeObjectURL(url);
      } else {
        // PDF not implemented yet — show the JSON response
        const data = await response.json();
        console.log("Report API response:", data);
        alert("PDF generation is not fully implemented yet. Check console for details.");
      }
    } catch (error) {
      console.error("Export failed:", error);
      // TODO: Show error toast
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={handleExport}
      variant="outline"
      size="sm"
      disabled={isGenerating}
    >
      {isGenerating ? (
        <>
          <Loader2 size={16} className="animate-spin" data-icon="inline-start" />
          Generating...
        </>
      ) : (
        <>
          <Download size={16} data-icon="inline-start" />
          Export PDF
        </>
      )}
    </Button>
  );
}
