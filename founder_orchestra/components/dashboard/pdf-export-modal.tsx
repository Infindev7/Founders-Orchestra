/**
 * =============================================================================
 * COMPONENT — PDF Export Modal
 * =============================================================================
 *
 * Modal dialog for selecting report sections and exporting to PDF.
 * Uses shadcn Dialog + Checkbox components.
 *
 * Owner: Frontend Lead (Team Member A)
 * =============================================================================
 */

"use client";

import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface PdfExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const REPORT_SECTIONS = [
  { id: "executive", label: "Executive Summary", description: "Idea validation, PMF score, key insights", defaultChecked: true },
  { id: "market", label: "Market Intelligence", description: "TAM/SAM/SOM, competitor matrix, trends", defaultChecked: true },
  { id: "product", label: "Product Blueprint", description: "PRD, user stories, roadmap", defaultChecked: true },
  { id: "architecture", label: "Technical Architecture", description: "DB schema, API design, system diagram", defaultChecked: false },
  { id: "execution", label: "Execution Plan", description: "GitHub issues, sprint plan, milestones", defaultChecked: false },
  { id: "marketing", label: "Marketing Assets", description: "Landing copy, social posts, email campaign", defaultChecked: false },
];

import { useProjectStore } from "@/lib/store/project-store";
import { toast } from "@/hooks/use-toast";

export function PdfExportModal({ open, onOpenChange }: PdfExportModalProps) {
  const projectId = useProjectStore((s) => s.projectId);
  const startupName = useProjectStore((s) => s.input?.startupName);
  const [isExporting, setIsExporting] = useState(false);
  const [selected, setSelected] = useState<Record<string, boolean>>(
    Object.fromEntries(REPORT_SECTIONS.map((s) => [s.id, s.defaultChecked]))
  );

  const toggleSection = (id: string) => {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleGenerate = async () => {
    if (!projectId) {
      toast({
        variant: "destructive",
        title: "No Project Active",
        description: "Please run the AI pipeline or load a demo before exporting.",
      });
      return;
    }

    if (projectId === "demo-project") {
      toast({
        variant: "destructive",
        title: "Demo Mode Export Limit",
        description: "PDF generation is only supported for real runs. Please run the AI pipeline.",
      });
      return;
    }

    setIsExporting(true);
    toast({
      title: "Generating Report",
      description: "Compiling agent validation findings into a PDF...",
    });

    try {
      const response = await fetch("/api/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectId }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errMsg = errorData.error || "Failed to generate report PDF";
        throw new Error(errMsg);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      
      const safeName = (startupName || "startup")
        .replace(/[^a-zA-Z0-9-_ ]/g, "")
        .replace(/\s+/g, "-")
        .toLowerCase();
      
      a.download = `${safeName}-report.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: "Report PDF downloaded successfully!",
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to generate PDF report:", error);
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: error instanceof Error ? error.message : "Failed to compile the report PDF.",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-fo-surface2 border-border max-w-[460px]">
        <DialogHeader>
          <DialogTitle className="font-display text-lg font-bold">
            Export Intelligence Report
          </DialogTitle>
          <DialogDescription className="text-fo-sub">
            Choose the sections to include in your PDF report.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2 my-4">
          {REPORT_SECTIONS.map((section) => (
            <label
              key={section.id}
              className="flex items-center gap-3 p-3 px-3.5 rounded-lg border border-border cursor-pointer hover:border-fo-indigo transition-colors"
            >
              <Checkbox
                checked={selected[section.id]}
                onCheckedChange={() => toggleSection(section.id)}
                className="data-[state=checked]:bg-fo-indigo data-[state=checked]:border-fo-indigo"
                disabled={isExporting}
              />
              <div>
                <div className="text-[13.5px] font-medium">{section.label}</div>
                <div className="text-[11.5px] text-fo-sub">{section.description}</div>
              </div>
            </label>
          ))}
        </div>

        <DialogFooter className="flex gap-2.5">
          <Button
            variant="outline"
            className="flex-1 border-border text-fo-sub hover:text-fo-text"
            onClick={() => onOpenChange(false)}
            disabled={isExporting}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 bg-fo-indigo text-white hover:opacity-85"
            onClick={handleGenerate}
            disabled={isExporting}
          >
            {isExporting ? "Generating..." : "⬇ Generate PDF"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
