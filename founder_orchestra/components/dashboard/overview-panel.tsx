/**
 * =============================================================================
 * COMPONENT — Overview Panel
 * =============================================================================
 *
 * The top-level summary view on the dashboard.
 * Displays:
 * - Overall progress ring (% of agents completed)
 * - Key stats (viability score, market size, features, etc.)
 * - Grid of all 6 agent cards
 *
 * This is what the user sees when no specific agent is selected.
 *
 * Owner: Frontend Lead (Team Member A)
 * =============================================================================
 */

"use client";

import { useProjectStore, calculateProgress } from "@/lib/store/project-store";
import { ALL_AGENT_IDS } from "@/lib/agents/config";
import { AgentCard } from "@/components/dashboard/agent-card";
import { ProgressRing } from "@/components/ui/progress-ring";
import { PdfExportButton } from "@/components/dashboard/pdf-export-button";
import { Activity, DollarSign, Layers, Target } from "lucide-react";

export function OverviewPanel() {
  const agents = useProjectStore((s) => s.agents);
  const input = useProjectStore((s) => s.input);
  const selectAgent = useProjectStore((s) => s.selectAgent);
  const overallStatus = useProjectStore((s) => s.overallStatus);

  const progress = calculateProgress(agents);

  // ── Extract key metrics from agent outputs ──────────────────────────────
  const viabilityScore =
    (agents["startup-advisor"]?.metadata?.viabilityScore as number) ?? null;
  const marketSize =
    (agents["market-research"]?.metadata?.tam as number) ?? null;
  const mvpFeatures =
    (agents["product-manager"]?.metadata?.mvpFeatures as number) ?? null;
  const estimatedCost =
    (agents["architect"]?.metadata?.estimatedMonthlyCost as string) ?? null;

  return (
    <div className="space-y-6">
      {/* ── Top Bar: Progress + Export ────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {input?.startupName || "Your Startup"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {overallStatus === "completed"
              ? "All agents have completed their analysis"
              : overallStatus === "in-progress"
              ? "Agents are analyzing your startup idea..."
              : "Launch the orchestration to begin analysis"}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <ProgressRing progress={progress} size={56} />
          {overallStatus === "completed" && <PdfExportButton />}
        </div>
      </div>

      {/* ── Key Stats Row ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<Target className="text-amber-500" size={20} />}
          label="Viability Score"
          value={viabilityScore !== null ? `${viabilityScore}/10` : "—"}
        />
        <StatCard
          icon={<DollarSign className="text-blue-500" size={20} />}
          label="Market Size"
          value={
            marketSize !== null
              ? `$${(marketSize / 1e9).toFixed(1)}B`
              : "—"
          }
        />
        <StatCard
          icon={<Layers className="text-purple-500" size={20} />}
          label="MVP Features"
          value={mvpFeatures !== null ? String(mvpFeatures) : "—"}
        />
        <StatCard
          icon={<Activity className="text-emerald-500" size={20} />}
          label="Infra Cost/mo"
          value={estimatedCost ?? "—"}
        />
      </div>

      {/* ── Agent Cards Grid ─────────────────────────────────────────────── */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Agent Outputs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ALL_AGENT_IDS.map((agentId) => (
            <AgentCard
              key={agentId}
              agentId={agentId}
              output={agents[agentId]}
              onClick={() => selectAgent(agentId)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// INTERNAL COMPONENT — Stat Card
// ─────────────────────────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
      <div className="p-2 rounded-lg bg-muted">{icon}</div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-lg font-bold">{value}</p>
      </div>
    </div>
  );
}
