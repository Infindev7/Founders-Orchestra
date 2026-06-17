/**
 * =============================================================================
 * ZUSTAND STORE — Global Application State
 * =============================================================================
 *
 * This is the "central brain" of the frontend. It stores:
 * - The current project data (startup input + agent outputs)
 * - UI state (which panel is selected, sidebar state, etc.)
 * - Actions (functions to update state)
 *
 * WHAT IS ZUSTAND?
 * Zustand is a tiny state management library for React.
 * Think of it like a global variable that:
 * - All components can read from
 * - Only updates the components that actually use the changed data
 * - Persists data to localStorage so it survives page refreshes
 *
 * HOW TO USE IN A COMPONENT:
 *   "use client";
 *   import { useProjectStore } from "@/lib/store/project-store";
 *
 *   function MyComponent() {
 *     // Pick only the data you need (better performance)
 *     const input = useProjectStore((state) => state.input);
 *     const setInput = useProjectStore((state) => state.setInput);
 *
 *     return <p>{input?.startupName}</p>;
 *   }
 *
 * Owner: Frontend Lead (Team Member A)
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
import { ALL_AGENT_IDS } from "@/lib/agents/config";

// ─────────────────────────────────────────────────────────────────────────────
// STORE STATE TYPE — What data the store holds
// ─────────────────────────────────────────────────────────────────────────────

interface ProjectStore {
  // ── Data ──────────────────────────────────────────────────────────────
  /** The founder's startup idea input */
  input: StartupInput | null;

  /** Agent outputs keyed by agent ID */
  agents: Partial<Record<AgentId, AgentOutput>>;

  /** Overall pipeline status */
  overallStatus: OrchestrationStatus;

  /** Current project's MongoDB ID (if saved) */
  projectId: string | null;

  // ── UI State ──────────────────────────────────────────────────────────
  /** Which agent's detail view is currently open (null = overview) */
  selectedAgent: AgentId | null;

  /** Whether the sidebar is collapsed */
  sidebarCollapsed: boolean;

  /** Whether we're using mock data (for development without API key) */
  useMockData: boolean;

  // ── Actions ───────────────────────────────────────────────────────────
  // These are functions that update the state.
  // Components call these to make changes.

  /** Set the startup idea input */
  setInput: (input: StartupInput) => void;

  /** Update a single agent's output */
  updateAgent: (agentId: AgentId, output: AgentOutput) => void;

  /** Set the status of a single agent */
  setAgentStatus: (agentId: AgentId, status: AgentStatus) => void;

  /** Set the overall pipeline status */
  setOverallStatus: (status: OrchestrationStatus) => void;

  /** Select an agent to view its details (null for overview) */
  selectAgent: (agentId: AgentId | null) => void;

  /** Toggle sidebar collapse */
  toggleSidebar: () => void;

  /** Toggle mock data mode */
  toggleMockData: () => void;

  /** Save the project ID after saving to MongoDB */
  setProjectId: (id: string) => void;

  /** Reset everything (start a new project) */
  reset: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// DEFAULT STATE — What the store looks like when empty
// ─────────────────────────────────────────────────────────────────────────────

const defaultState = {
  input: null,
  agents: {},
  overallStatus: "not-started" as OrchestrationStatus,
  projectId: null,
  selectedAgent: null,
  sidebarCollapsed: false,
  useMockData: false,
};

// ─────────────────────────────────────────────────────────────────────────────
// CREATE THE STORE
// ─────────────────────────────────────────────────────────────────────────────

export const useProjectStore = create<ProjectStore>()(
  // persist() wraps the store so state survives page refreshes
  persist(
    (set) => ({
      // ── Spread default state ────────────────────────────────────────
      ...defaultState,

      // ── Action Implementations ──────────────────────────────────────
      // "set" is a function that updates the state.
      // It works like React's setState — you give it the fields to change.

      setInput: (input) => set({ input }),

      updateAgent: (agentId, output) =>
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

      setOverallStatus: (overallStatus) => set({ overallStatus }),

      selectAgent: (selectedAgent) => set({ selectedAgent }),

      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      toggleMockData: () =>
        set((state) => ({ useMockData: !state.useMockData })),

      setProjectId: (projectId) => set({ projectId }),

      reset: () => set(defaultState),
    }),
    {
      // ── Persist Configuration ───────────────────────────────────────
      name: "founders-orchestra-project", // localStorage key
      // Only persist data fields, not UI state
      partialize: (state) => ({
        input: state.input,
        agents: state.agents,
        overallStatus: state.overallStatus,
        projectId: state.projectId,
      }),
    }
  )
);

// ─────────────────────────────────────────────────────────────────────────────
// DERIVED STATE HELPERS
// ─────────────────────────────────────────────────────────────────────────────
// These are utility functions that compute useful values from the store.
// Use them in components for common calculations.

/**
 * Calculate overall progress as a percentage (0-100).
 * Each completed agent adds ~16.7% (100/6).
 */
export function calculateProgress(
  agents: Partial<Record<AgentId, AgentOutput>>
): number {
  const total = ALL_AGENT_IDS.length;
  const completed = ALL_AGENT_IDS.filter(
    (id) => agents[id]?.status === "completed"
  ).length;
  return Math.round((completed / total) * 100);
}

/**
 * Get the status of a specific agent from the store.
 * Returns "idle" if the agent hasn't been started yet.
 */
export function getAgentStatus(
  agents: Partial<Record<AgentId, AgentOutput>>,
  agentId: AgentId
): AgentStatus {
  return agents[agentId]?.status ?? "idle";
}
