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

export function PdfExportModal({ open, onOpenChange }: PdfExportModalProps) {
  const [selected, setSelected] = useState<Record<string, boolean>>(
    Object.fromEntries(REPORT_SECTIONS.map((s) => [s.id, s.defaultChecked]))
  );

  const toggleSection = (id: string) => {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleGenerate = () => {
    // TODO (Team Member A): Call /api/report with selected sections
    const sections = Object.entries(selected)
      .filter(([, v]) => v)
      .map(([k]) => k);
    console.log("Generating PDF with sections:", sections);
    onOpenChange(false);
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
          >
            Cancel
          </Button>
          <Button
            className="flex-1 bg-fo-indigo text-white hover:opacity-85"
            onClick={handleGenerate}
          >
            ⬇ Generate PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
