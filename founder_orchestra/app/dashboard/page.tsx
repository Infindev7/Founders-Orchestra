/**
 * =============================================================================
 * PAGE — Dashboard (/dashboard)
 * =============================================================================
 *
 * The main dashboard page. Switches between:
 * - Overview Panel (when no agent is selected)
 * - Agent Detail View (when a specific agent is selected)
 *
 * The selected agent is stored in the Zustand store,
 * so it persists across re-renders but not page refreshes
 * (which is the desired behavior).
 *
 * Owner: Frontend Lead (Team Member A)
 * =============================================================================
 */

"use client";

import { useProjectStore } from "@/lib/store/project-store";
import { OverviewPanel } from "@/components/dashboard/overview-panel";
import { AgentDetailView } from "@/components/dashboard/agent-detail-view";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const input = useProjectStore((s) => s.input);
  const selectedAgent = useProjectStore((s) => s.selectedAgent);
  const router = useRouter();

  // ── Redirect to landing if no project is loaded ─────────────────────────
  useEffect(() => {
    if (!input) {
      router.push("/");
    }
  }, [input, router]);

  // Don't render until we know there's project data
  if (!input) return null;

  // ── Render based on selected agent ──────────────────────────────────────
  return (
    <>
      {selectedAgent ? (
        <AgentDetailView agentId={selectedAgent} />
      ) : (
        <OverviewPanel />
      )}
    </>
  );
}
