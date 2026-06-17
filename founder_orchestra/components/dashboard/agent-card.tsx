/**
 * =============================================================================
 * COMPONENT — Agent Card
 * =============================================================================
 *
 * A summary card displayed on the dashboard overview for each AI agent.
 * Shows: agent name, status badge, summary text, and a key metric.
 *
 * STATES:
 * - idle:      Grayed out with "Waiting" badge
 * - running:   Pulsing border animation with "Running" badge
 * - completed: Fully visible with summary and "Done" badge
 * - error:     Red tint with "Error" badge
 *
 * Click the card to navigate to the agent's full detail view.
 *
 * Owner: Frontend Lead (Team Member A)
 * =============================================================================
 */

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AGENT_CONFIGS } from "@/lib/agents/config";
import {
  Lightbulb,
  TrendingUp,
  ClipboardList,
  Megaphone,
  Blocks,
  GitBranch,
  Loader2,
} from "lucide-react";
import type { AgentId, AgentOutput, AgentStatus } from "@/lib/types";

// ── Icon mapping ────────────────────────────────────────────────────────────
const ICON_MAP: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  Lightbulb,
  TrendingUp,
  ClipboardList,
  Megaphone,
  Blocks,
  GitBranch,
};

// ── Badge styling per status ────────────────────────────────────────────────
const STATUS_BADGE: Record<
  AgentStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  idle: { label: "Waiting", variant: "outline" },
  running: { label: "Running...", variant: "secondary" },
  completed: { label: "Done", variant: "default" },
  error: { label: "Error", variant: "destructive" },
};

interface AgentCardProps {
  agentId: AgentId;
  output?: AgentOutput;
  onClick?: () => void;
}

export function AgentCard({ agentId, output, onClick }: AgentCardProps) {
  const config = AGENT_CONFIGS[agentId];
  const status: AgentStatus = output?.status ?? "idle";
  const badge = STATUS_BADGE[status];
  const IconComponent = ICON_MAP[config.icon];

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5",
        status === "running" && "ring-2 ring-amber-500/50 animate-pulse",
        status === "error" && "border-red-500/30 bg-red-500/5",
        status === "idle" && "opacity-60"
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          {/* Agent icon */}
          {status === "running" ? (
            <Loader2 size={20} className="animate-spin text-amber-500" />
          ) : (
            IconComponent && (
              <IconComponent size={20} className={config.color} />
            )
          )}
          <CardTitle className="text-sm font-medium">{config.name}</CardTitle>
        </div>
        <Badge variant={badge.variant}>{badge.label}</Badge>
      </CardHeader>

      <CardContent>
        {/* Show summary when completed, description when idle */}
        <p className="text-xs text-muted-foreground line-clamp-2">
          {status === "completed"
            ? output?.summary
            : status === "error"
            ? output?.error || "An error occurred"
            : config.description}
        </p>

        {/* Key metric (if available) */}
        {output?.metadata && status === "completed" && (
          <div className="mt-3 pt-3 border-t border-border">
            <KeyMetric agentId={agentId} metadata={output.metadata} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Displays the most important metric for each agent.
 *
 * TODO (Team Member A):
 * - Add more metrics per agent
 * - Add mini sparkline charts
 * - Add trend indicators (up/down arrows)
 */
function KeyMetric({
  agentId,
  metadata,
}: {
  agentId: AgentId;
  metadata: Record<string, unknown>;
}) {
  // Define what metric to show for each agent
  const metricConfig: Record<AgentId, { label: string; key: string; format?: (v: unknown) => string }> = {
    "startup-advisor": {
      label: "Viability Score",
      key: "viabilityScore",
      format: (v) => `${v}/10`,
    },
    "market-research": {
      label: "Market Size (TAM)",
      key: "tam",
      format: (v) => `$${(Number(v) / 1e9).toFixed(1)}B`,
    },
    "product-manager": {
      label: "MVP Features",
      key: "mvpFeatures",
    },
    architect: {
      label: "Est. Monthly Cost",
      key: "estimatedMonthlyCost",
    },
    "engineering-manager": {
      label: "Total Story Points",
      key: "totalStoryPoints",
    },
    marketing: {
      label: "LinkedIn Posts",
      key: "linkedInPosts",
    },
  };

  const config = metricConfig[agentId];
  const value = metadata[config.key];
  if (value === undefined) return null;

  const displayValue = config.format ? config.format(value) : String(value);

  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-muted-foreground">{config.label}</span>
      <span className="text-sm font-semibold">{displayValue}</span>
    </div>
  );
}
