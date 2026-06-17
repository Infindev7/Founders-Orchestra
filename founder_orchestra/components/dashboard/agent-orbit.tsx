/**
 * =============================================================================
 * COMPONENT — Agent Orbit
 * =============================================================================
 *
 * The signature element at the top of the dashboard.
 * Left: SVG donut ring showing agent completion status.
 * Right: Vertical list of all 6 agents with progress bars.
 *
 * Owner: Frontend Lead (Team Member A)
 * =============================================================================
 */

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useProjectStore, getAgentStatus } from "@/lib/store/project-store";
import { AGENT_CONFIGS, ALL_AGENT_IDS } from "@/lib/agents/config";
import { cn } from "@/lib/utils";
import {
  Lightbulb,
  FlaskConical,
  ClipboardList,
  Building2,
  FolderKanban,
  Megaphone,
} from "lucide-react";
import type { AgentId, AgentStatus } from "@/lib/types";

// ── Icon mapping ────────────────────────────────────────────────────────────
const AGENT_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Lightbulb,
  TrendingUp: FlaskConical,
  ClipboardList,
  Megaphone,
  Blocks: Building2,
  GitBranch: FolderKanban,
};

const STATUS_BADGE: Record<AgentStatus, { label: string; className: string }> = {
  completed: { label: "Complete", className: "bg-[rgba(16,185,129,.15)] text-fo-emerald border-0" },
  running: { label: "Running", className: "bg-[rgba(245,158,11,.15)] text-fo-amber border-0" },
  idle: { label: "Queued", className: "bg-[rgba(100,116,139,.1)] text-fo-muted border-0" },
  error: { label: "Error", className: "bg-[rgba(244,63,94,.15)] text-fo-rose border-0" },
};

const STATUS_ICON_BG: Record<AgentStatus, string> = {
  completed: "rgba(16,185,129,.12)",
  running: "rgba(245,158,11,.12)",
  idle: "rgba(100,116,139,.08)",
  error: "rgba(244,63,94,.12)",
};

const STATUS_BAR_COLOR: Record<AgentStatus, string> = {
  completed: "bg-fo-emerald",
  running: "bg-fo-amber",
  idle: "bg-fo-muted",
  error: "bg-fo-rose",
};

export function AgentOrbit() {
  const agents = useProjectStore((s) => s.agents);

  // ── Count statuses for the ring ─────────────────────────────────────────
  const counts = { completed: 0, running: 0, idle: 0, error: 0 };
  ALL_AGENT_IDS.forEach((id) => {
    counts[getAgentStatus(agents, id)]++;
  });
  const total = ALL_AGENT_IDS.length;

  // ── SVG ring math ───────────────────────────────────────────────────────
  const circumference = 2 * Math.PI * 60; // radius = 60
  const doneLen = (counts.completed / total) * circumference;
  const runLen = (counts.running / total) * circumference;

  return (
    <div id="orbit" className="flex gap-6 mb-7 items-start">
      {/* ── Status Ring ──────────────────────────────────────────────────── */}
      <Card className="min-w-[220px] relative overflow-hidden">
        {/* Radial gradient glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(99,102,241,.12)_0%,transparent_70%)] pointer-events-none" />
        <CardContent className="flex flex-col items-center pt-6 pb-5 relative">
          <div className="text-[10px] font-semibold tracking-[1px] text-fo-muted uppercase font-display mb-4">
            Agent Status
          </div>
          <svg viewBox="0 0 160 160" className="w-40 h-40">
            {/* Background ring */}
            <circle cx="80" cy="80" r="60" fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="10" />
            {/* Done arc */}
            <circle
              cx="80" cy="80" r="60" fill="none" stroke="#10B981" strokeWidth="10"
              strokeDasharray={`${doneLen} ${circumference - doneLen}`}
              strokeDashoffset="0" strokeLinecap="round"
              transform="rotate(-90 80 80)"
            />
            {/* Running arc */}
            <circle
              cx="80" cy="80" r="60" fill="none" stroke="#F59E0B" strokeWidth="10"
              strokeDasharray={`${runLen} ${circumference - runLen}`}
              strokeDashoffset={`${-doneLen}`}
              strokeLinecap="round" transform="rotate(-90 80 80)"
            />
            {/* Center text */}
            <text x="80" y="74" textAnchor="middle" fill="#F1F5F9" fontFamily="var(--font-display)" fontSize="26" fontWeight="700">
              {counts.completed + counts.running}/{total}
            </text>
            <text x="80" y="93" textAnchor="middle" fill="#64748B" fontFamily="var(--font-body)" fontSize="11">
              active
            </text>
          </svg>
          {/* Legend */}
          <div className="flex gap-3.5 mt-1">
            <LegendDot color="bg-fo-emerald" label={`${counts.completed} done`} />
            <LegendDot color="bg-fo-amber" label={`${counts.running} running`} />
            <LegendDot color="bg-fo-muted" label={`${counts.idle} queued`} />
          </div>
        </CardContent>
      </Card>

      {/* ── Agent List ───────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-2 flex-1">
        {ALL_AGENT_IDS.map((agentId) => (
          <AgentRow key={agentId} agentId={agentId} />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// INTERNAL — Agent Row
// ─────────────────────────────────────────────────────────────────────────────

function AgentRow({ agentId }: { agentId: AgentId }) {
  const output = useProjectStore((s) => s.agents[agentId]);
  const config = AGENT_CONFIGS[agentId];
  const status = output?.status ?? "idle";
  const badge = STATUS_BADGE[status];
  const IconComponent = AGENT_ICONS[config.icon];
  const progressValue = status === "completed" ? 100 : status === "running" ? 65 : 0;

  return (
    <Card
      className={cn(
        "transition-colors",
        status === "running" && "border-[rgba(245,158,11,.3)]",
        status === "idle" && "opacity-50"
      )}
    >
      <CardContent className="flex items-center gap-3.5 py-3.5 px-4">
        {/* Agent icon */}
        <div
          className="w-9 h-9 rounded-[9px] flex items-center justify-center flex-shrink-0"
          style={{ background: STATUS_ICON_BG[status] }}
        >
          {IconComponent && <IconComponent size={17} />}
        </div>

        {/* Agent info */}
        <div className="flex-1 min-w-0">
          <div className="text-[13.5px] font-semibold font-display">
            {config.name}
          </div>
          <div className="text-xs text-fo-sub mt-0.5 truncate">
            {output?.summary || config.description}
          </div>
          {/* Progress bar */}
          <div className="mt-1.5 h-[3px] w-20 bg-[rgba(255,255,255,.06)] rounded-sm overflow-hidden">
            <div
              className={cn("h-full rounded-sm transition-all duration-1000 fo-fill-anim", STATUS_BAR_COLOR[status])}
              style={{ width: `${progressValue}%` }}
            />
          </div>
        </div>

        {/* Status badge */}
        <Badge className={cn("text-[11px] font-semibold", badge.className)}>
          {badge.label}
        </Badge>
      </CardContent>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// INTERNAL — Legend Dot
// ─────────────────────────────────────────────────────────────────────────────

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-[11px]">
      <div className={cn("w-2 h-2 rounded-full", color)} />
      <span className="text-fo-sub">{label}</span>
    </div>
  );
}
