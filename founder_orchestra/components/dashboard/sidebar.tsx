/**
 * =============================================================================
 * COMPONENT — Dashboard Sidebar
 * =============================================================================
 *
 * The left-side navigation panel in the dashboard.
 * Shows the project name and a list of all 6 agents with their status.
 * Clicking an agent navigates to its detail view.
 *
 * DESIGN:
 * - Dark glass morphism background
 * - Status dots: gray=idle, amber=running, green=completed, red=error
 * - Collapsible on mobile (hamburger menu)
 * - Animated agent status transitions
 *
 * Owner: Frontend Lead (Team Member A)
 * =============================================================================
 */

"use client";

import { useProjectStore, getAgentStatus } from "@/lib/store/project-store";
import { AGENT_CONFIGS, ALL_AGENT_IDS } from "@/lib/agents/config";
import { cn } from "@/lib/utils";
import {
  Lightbulb,
  TrendingUp,
  ClipboardList,
  Megaphone,
  Blocks,
  GitBranch,
  LayoutDashboard,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import type { AgentId, AgentStatus } from "@/lib/types";

// ── Map icon names (from config) to actual Lucide components ────────────────
const ICON_MAP: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  Lightbulb,
  TrendingUp,
  ClipboardList,
  Megaphone,
  Blocks,
  GitBranch,
};

// ── Status dot colors ───────────────────────────────────────────────────────
const STATUS_STYLES: Record<AgentStatus, string> = {
  idle: "bg-muted-foreground/30",
  running: "bg-amber-500 animate-pulse",
  completed: "bg-emerald-500",
  error: "bg-red-500",
};

export function Sidebar() {
  // ── Get state from the store ────────────────────────────────────────────
  const agents = useProjectStore((s) => s.agents);
  const selectedAgent = useProjectStore((s) => s.selectedAgent);
  const selectAgent = useProjectStore((s) => s.selectAgent);
  const sidebarCollapsed = useProjectStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useProjectStore((s) => s.toggleSidebar);
  const input = useProjectStore((s) => s.input);

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-border bg-card transition-all duration-300",
        sidebarCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!sidebarCollapsed && (
          <div className="min-w-0">
            <h2 className="text-sm font-semibold truncate">
              {input?.startupName || "Founders Orchestra"}
            </h2>
            <p className="text-xs text-muted-foreground">Dashboard</p>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-md hover:bg-muted transition-colors"
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? (
            <PanelLeft size={18} />
          ) : (
            <PanelLeftClose size={18} />
          )}
        </button>
      </div>

      {/* ── Navigation ──────────────────────────────────────────────────── */}
      <nav className="flex-1 p-2 space-y-1">
        {/* Overview button */}
        <button
          onClick={() => selectAgent(null)}
          className={cn(
            "flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm transition-colors",
            selectedAgent === null
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted text-muted-foreground hover:text-foreground"
          )}
        >
          <LayoutDashboard size={18} />
          {!sidebarCollapsed && <span>Overview</span>}
        </button>

        {/* Divider */}
        <div className="py-2">
          {!sidebarCollapsed && (
            <p className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Agents
            </p>
          )}
        </div>

        {/* Agent buttons */}
        {ALL_AGENT_IDS.map((agentId) => {
          const config = AGENT_CONFIGS[agentId];
          const status = getAgentStatus(agents, agentId);
          const IconComponent = ICON_MAP[config.icon];
          const isSelected = selectedAgent === agentId;

          return (
            <button
              key={agentId}
              onClick={() => selectAgent(agentId)}
              className={cn(
                "flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm transition-colors",
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              )}
              title={sidebarCollapsed ? config.name : undefined}
            >
              {/* Agent icon */}
              {IconComponent && (
                <IconComponent
                  size={18}
                  className={cn(!isSelected && config.color)}
                />
              )}

              {/* Agent name + status (hidden when collapsed) */}
              {!sidebarCollapsed && (
                <>
                  <span className="flex-1 text-left truncate">
                    {config.name}
                  </span>
                  {/* Status dot */}
                  <span
                    className={cn(
                      "w-2 h-2 rounded-full flex-shrink-0",
                      STATUS_STYLES[status]
                    )}
                  />
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      {!sidebarCollapsed && (
        <div className="p-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            Founders Orchestra v0.1
          </p>
        </div>
      )}
    </aside>
  );
}
