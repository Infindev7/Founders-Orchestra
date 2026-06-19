/**
 * =============================================================================
 * STORE — Project State (Zustand)
 * =============================================================================
 *
 * Global state management for the entire app using Zustand.
 * Persists to localStorage so data survives page refreshes.
 *
 * HOW ZUSTAND WORKS:
 * 1. Define your state shape + actions in the `create()` call
 * 2. Use `useProjectStore(selector)` in any component to read state
 * 3. Call actions to update state — React auto-re-renders
 *
 * USAGE EXAMPLES:
 *   const input = useProjectStore((s) => s.input);
 *   const setInput = useProjectStore((s) => s.setInput);
 *   setInput({ startupName: "FitCoach AI", idea: "..." });
 *
 * Owner: Shared (all team members use this store)
 * =============================================================================
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  AgentId,
  AgentOutput,
  AgentStatus,
  StartupInput,
  OrchestrationStatus,
  ProjectState,
} from "@/lib/types";
import { ALL_AGENT_IDS, AGENT_CONFIGS } from "@/lib/agents/config";
import { toast } from "@/hooks/use-toast";

// ─────────────────────────────────────────────────────────────────────────────
// STORE TYPE DEFINITION
// ─────────────────────────────────────────────────────────────────────────────

interface ProjectStore {
  // ── State ────────────────────────────────────────────────────────────────
  input: StartupInput | null;
  projectId: string | null;
  agents: Partial<Record<AgentId, AgentOutput>>;
  overallStatus: OrchestrationStatus;
  activeSection: string;            // Current sidebar nav selection
  pdfModalOpen: boolean;

  // ── Actions ──────────────────────────────────────────────────────────────
  setInput: (input: StartupInput) => void;
  setProjectId: (projectId: string | null) => void;
  setAgentOutput: (agentId: AgentId, output: AgentOutput) => void;
  setAgentStatus: (agentId: AgentId, status: AgentStatus) => void;
  setOverallStatus: (status: OrchestrationStatus) => void;
  setActiveSection: (sectionId: string) => void;
  togglePdfModal: () => void;
  setPdfModalOpen: (open: boolean) => void;
  resetProject: () => void;
  loadMockData: () => void;
  loadProject: (project: ProjectState) => void;
  runOrchestration: () => Promise<void>;
}

// ─────────────────────────────────────────────────────────────────────────────
// DEFAULT STATE
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_STATE = {
  input: null,
  projectId: null as string | null,
  agents: {} as Partial<Record<AgentId, AgentOutput>>,
  overallStatus: "not-started" as OrchestrationStatus,
  activeSection: "orbit",
  pdfModalOpen: false,
};

// ─────────────────────────────────────────────────────────────────────────────
// CREATE THE STORE
// ─────────────────────────────────────────────────────────────────────────────

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set) => ({
      ...DEFAULT_STATE,

      setInput: (input) =>
        set({
          input,
          projectId: null,
          agents: {},
          overallStatus: "not-started",
          activeSection: "orbit",
        }),

      setAgentOutput: (agentId, output) =>
        set((state) => ({
          agents: { ...state.agents, [agentId]: output },
        })),

      setAgentStatus: (agentId, status) =>
        set((state) => {
          const existing = state.agents[agentId];
          if (!existing) return state;
          return {
            agents: {
              ...state.agents,
              [agentId]: { ...existing, status },
            },
          };
        }),

      setOverallStatus: (status) => set({ overallStatus: status }),

      setActiveSection: (sectionId) => set({ activeSection: sectionId }),

      togglePdfModal: () =>
        set((state) => ({ pdfModalOpen: !state.pdfModalOpen })),

      setPdfModalOpen: (open) => set({ pdfModalOpen: open }),

      setProjectId: (projectId) => set({ projectId }),

      loadProject: (project) =>
        set({
          input: project.input,
          projectId: project._id ?? null,
          agents: project.agents,
          overallStatus: project.overallStatus,
          activeSection: "orbit",
        }),

      resetProject: () => set(DEFAULT_STATE),

      loadMockData: () => {
        // Dynamically import to avoid circular deps
        import("@/lib/mock-data").then(({ MOCK_PROJECT }) => {
          set({
            input: MOCK_PROJECT.input,
            projectId: "demo-project",
            agents: MOCK_PROJECT.agents,
            overallStatus: MOCK_PROJECT.overallStatus,
          });
        });
      },

      runOrchestration: async () => {
        const state = useProjectStore.getState();
        if (!state.input) return;

        // Initialize overall status to in-progress
        set({ overallStatus: "in-progress" });

        // Initialize all agents to idle to show loading skeletons
        const initialAgents: Partial<Record<AgentId, AgentOutput>> = {};
        ALL_AGENT_IDS.forEach((id) => {
          initialAgents[id] = {
            agentId: id,
            status: "idle",
            title: AGENT_CONFIGS[id].name,
            summary: "Queued...",
            sections: [],
            metadata: {},
          };
        });
        set({ agents: initialAgents });

        try {
          const response = await fetch("/api/orchestrate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              input: state.input,
              projectId: state.projectId === "demo-project" ? undefined : (state.projectId || undefined),
            }),
          });

          if (!response.ok) {
            throw new Error(`Orchestration failed with status ${response.status}`);
          }

          const reader = response.body?.getReader();
          if (!reader) {
            throw new Error("Response stream is not readable");
          }

          const decoder = new TextDecoder();
          let buffer = "";

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              const trimmed = line.trim();
              if (trimmed.startsWith("data: ")) {
                const dataStr = trimmed.slice(6);
                try {
                  const data = JSON.parse(dataStr);
                  
                  if (data.type === "project-created") {
                    set({ projectId: data.projectId });
                  } else if (data.type === "agent-start") {
                    set((s) => {
                      const existing = s.agents[data.agentId as AgentId];
                      return {
                        agents: {
                          ...s.agents,
                          [data.agentId]: {
                            ...(existing || {}),
                            agentId: data.agentId,
                            status: "running",
                            title: AGENT_CONFIGS[data.agentId as AgentId]?.name ?? data.agentId,
                            summary: "Generating content...",
                            sections: existing?.sections || [],
                            metadata: existing?.metadata || {},
                          },
                        },
                      };
                    });
                  } else if (data.type === "agent-complete") {
                    set((s) => ({
                      agents: {
                        ...s.agents,
                        [data.agentId]: data.output,
                      },
                    }));
                    toast({
                      title: `${data.output.title} Complete`,
                      description: `Validation findings are ready.`,
                    });
                  } else if (data.type === "agent-error") {
                    set((s) => {
                      const existing = s.agents[data.agentId as AgentId];
                      return {
                        agents: {
                          ...s.agents,
                          [data.agentId]: {
                            ...(existing || {}),
                            agentId: data.agentId,
                            status: "error",
                            error: data.error,
                            title: (AGENT_CONFIGS[data.agentId as AgentId]?.name ?? data.agentId) + " Failed",
                            summary: data.error || "Failed to execute",
                            sections: existing?.sections || [],
                            metadata: existing?.metadata || {},
                          },
                        },
                      };
                    });
                    toast({
                      variant: "destructive",
                      title: `${AGENT_CONFIGS[data.agentId as AgentId]?.name ?? data.agentId} Error`,
                      description: `Agent execution failed: ${data.error}`,
                    });
                  } else if (data.type === "orchestration-complete") {
                    set({ overallStatus: data.overallStatus });
                    toast({
                      title: "Pipeline Completed",
                      description: "Startup validation pipeline finished successfully!",
                    });
                  } else if (data.type === "orchestration-error") {
                    set({ overallStatus: "not-started" });
                    toast({
                      variant: "destructive",
                      title: "Pipeline Failed",
                      description: `Validation pipeline error: ${data.error}`,
                    });
                  }
                } catch (err) {
                  console.error("Failed to parse SSE event chunk", err);
                }
              }
            }
          }
        } catch (error) {
          console.error("Orchestration error:", error);
          set({ overallStatus: "not-started" });
          toast({
            variant: "destructive",
            title: "Pipeline Error",
            description: error instanceof Error ? error.message : "Pipeline encountered an unexpected error",
          });
        }
      },
    }),
    {
      name: "founder-os-project",
    }
  )
);

// ─────────────────────────────────────────────────────────────────────────────
// HELPER — Get agent status with fallback
// ─────────────────────────────────────────────────────────────────────────────

export function getAgentStatus(
  agents: Partial<Record<AgentId, AgentOutput>>,
  agentId: AgentId
): AgentStatus {
  return agents[agentId]?.status ?? "idle";
}
