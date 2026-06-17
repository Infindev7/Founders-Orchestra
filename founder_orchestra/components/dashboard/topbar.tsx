/**
 * =============================================================================
 * COMPONENT — Top Bar
 * =============================================================================
 *
 * Sticky top bar with idea pill, session timer, and action buttons.
 *
 * Owner: Frontend Lead (Team Member A)
 * =============================================================================
 */

"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProjectStore } from "@/lib/store/project-store";
import { Play, Download } from "lucide-react";

interface TopbarProps {
  onExportPdf?: () => void;
  onRunAll?: () => void;
}

export function Topbar({ onExportPdf, onRunAll }: TopbarProps) {
  const input = useProjectStore((s) => s.input);

  return (
    <div className="flex items-center gap-4 px-8 py-4 bg-fo-surface border-b border-border sticky top-0 z-40">
      {/* ── Idea Pill ────────────────────────────────────────────────────── */}
      <Badge
        variant="outline"
        className="bg-[rgba(99,102,241,.12)] border-[rgba(99,102,241,.3)] text-fo-indigo text-[13px] font-medium px-3.5 py-1.5 rounded-full"
      >
        <div className="w-[7px] h-[7px] rounded-full bg-fo-indigo mr-2" />
        {input?.idea
          ? input.idea.length > 60
            ? input.idea.slice(0, 60) + "…"
            : input.idea
          : "No idea loaded"}
      </Badge>

      {/* ── Session timer ────────────────────────────────────────────────── */}
      <span className="text-xs text-fo-muted">
        Session started just now
      </span>

      {/* ── Actions ──────────────────────────────────────────────────────── */}
      <div className="flex gap-2.5 ml-auto items-center">
        <Button
          variant="outline"
          size="sm"
          className="gap-2 text-fo-sub border-border hover:border-fo-indigo hover:text-fo-indigo"
          onClick={onExportPdf}
        >
          <Download size={14} />
          Export PDF
        </Button>
        <Button
          size="sm"
          className="gap-2 bg-fo-indigo text-white hover:opacity-85"
          onClick={onRunAll}
        >
          <Play size={14} />
          Run All Agents
        </Button>
      </div>
    </div>
  );
}
