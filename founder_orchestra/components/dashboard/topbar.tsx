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

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProjectStore } from "@/lib/store/project-store";
import { Play, Download, Menu } from "lucide-react";

interface TopbarProps {
  onExportPdf?: () => void;
  onRunAll?: () => void;
  onMenuClick?: () => void;
}

export function Topbar({ onExportPdf, onRunAll, onMenuClick }: TopbarProps) {
  const input = useProjectStore((s) => s.input);

  return (
    <div className="flex items-center gap-2 sm:gap-4 px-4 sm:px-8 py-3.5 bg-fo-surface border-b border-border sticky top-0 z-40 w-full">
      {/* ── Mobile Hamburger Toggle ───────────────────────────────────────── */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden flex items-center justify-center text-fo-sub hover:text-fo-text w-9 h-9 p-0 border border-border"
        onClick={onMenuClick}
      >
        <Menu size={16} />
      </Button>

      {/* ── Idea Pill ────────────────────────────────────────────────────── */}
      <Badge
        variant="outline"
        className="bg-[rgba(99,102,241,.12)] border-[rgba(99,102,241,.3)] text-fo-indigo text-[12px] sm:text-[13px] font-medium px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full inline-flex items-center"
      >
        <div className="w-[6px] h-[6px] rounded-full bg-fo-indigo mr-1.5 sm:mr-2 flex-shrink-0" />
        <span className="max-w-[110px] sm:max-w-[220px] md:max-w-[320px] lg:max-w-[420px] truncate">
          {input?.idea ?? "No idea loaded"}
        </span>
      </Badge>

      {/* ── Session timer (hidden on small screens) ───────────────────────── */}
      <span className="hidden sm:inline text-xs text-fo-muted">
        Session started just now
      </span>

      {/* ── Actions ──────────────────────────────────────────────────────── */}
      <div className="flex gap-1.5 sm:gap-2.5 ml-auto items-center">
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 sm:gap-2 text-fo-sub border-border hover:border-fo-indigo hover:text-fo-indigo text-xs"
          onClick={onExportPdf}
        >
          <Download size={13} />
          <span className="hidden sm:inline">Export PDF</span>
        </Button>
        <Button
          size="sm"
          className="gap-1.5 sm:gap-2 bg-fo-indigo text-white hover:opacity-85 text-xs font-semibold"
          onClick={onRunAll}
        >
          <Play size={13} />
          <span>Run All</span>
        </Button>
      </div>
    </div>
  );
}
