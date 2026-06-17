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
} from "@/lib/types";

// ─────────────────────────────────────────────────────────────────────────────
// STORE TYPE DEFINITION
// ─────────────────────────────────────────────────────────────────────────────

interface ProjectStore {
  // ── State ────────────────────────────────────────────────────────────────
  input: StartupInput | null;
  agents: Partial<Record<AgentId, AgentOutput>>;
  overallStatus: OrchestrationStatus;
  activeSection: string;            // Current sidebar nav selection
  pdfModalOpen: boolean;

  // ── Actions ──────────────────────────────────────────────────────────────
  setInput: (input: StartupInput) => void;
  setAgentOutput: (agentId: AgentId, output: AgentOutput) => void;
  setAgentStatus: (agentId: AgentId, status: AgentStatus) => void;
  setOverallStatus: (status: OrchestrationStatus) => void;
  setActiveSection: (sectionId: string) => void;
  togglePdfModal: () => void;
  setPdfModalOpen: (open: boolean) => void;
  resetProject: () => void;
  loadMockData: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// DEFAULT STATE
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_STATE = {
  input: null,
  agents: {},
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

      setInput: (input) => set({ input }),

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

      resetProject: () => set(DEFAULT_STATE),

      loadMockData: () => {
        // Dynamically import to avoid circular deps
        import("@/lib/mock-data").then(({ MOCK_PROJECT }) => {
          set({
            input: MOCK_PROJECT.input,
            agents: MOCK_PROJECT.agents,
            overallStatus: MOCK_PROJECT.overallStatus,
          });
        });
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
