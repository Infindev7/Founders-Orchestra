/**
 * =============================================================================
 * ORCHESTRATOR — Coordinates all AI agents
 * =============================================================================
 *
 * The orchestrator is the "brain" that runs the entire multi-agent pipeline.
 * It decides WHEN and HOW to run each agent.
 *
 * EXECUTION FLOW:
 * ┌─────────────────────────────────────────────────────────┐
 * │ Wave 1 (parallel):  Startup Advisor + Market Research   │
 * │         ↓ (wave 1 results feed into wave 2)             │
 * │ Wave 2 (parallel):  Product Manager + Marketing         │
 * │         ↓ (wave 1+2 results feed into wave 3)           │
 * │ Wave 3 (parallel):  Architect + Engineering Manager     │
 * └─────────────────────────────────────────────────────────┘
 *
 * WHY PARALLEL?
 * Agents within the same wave don't depend on each other,
 * so we run them simultaneously to save time.
 * E.g., Wave 1 takes ~10 seconds instead of ~20 seconds.
 *
 * Owner: AI/Agent Lead (Team Member B)
 * =============================================================================
 */

import { runAgent } from "@/lib/agents/base-agent";
import { getAgentsByWave, AGENT_CONFIGS } from "@/lib/agents/config";
import type { AgentId, AgentOutput, StartupInput, ProjectState } from "@/lib/types";

// ─────────────────────────────────────────────────────────────────────────────
// CALLBACK TYPE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The orchestrator calls this function every time something happens.
 * The API route uses this to stream updates to the frontend.
 *
 * Events:
 * - "agent-start":    An agent has begun execution
 * - "agent-complete": An agent finished successfully
 * - "agent-error":    An agent failed
 */
type OnProgressCallback = (event: {
  type: "agent-start" | "agent-complete" | "agent-error";
  agentId: AgentId;
  output?: AgentOutput;
  error?: string;
}) => void;

// ─────────────────────────────────────────────────────────────────────────────
// MAIN ORCHESTRATION FUNCTION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Runs the complete multi-agent pipeline.
 *
 * @param input      - The founder's startup idea
 * @param onProgress - Callback for real-time progress updates
 * @returns          - Complete record of all agent outputs
 *
 * HOW TO USE (in an API route):
 *   const results = await orchestrate(input, (event) => {
 *     // Stream this event to the client
 *     controller.enqueue(JSON.stringify(event));
 *   });
 */
export async function orchestrate(
  input: StartupInput,
  onProgress?: OnProgressCallback
): Promise<Record<AgentId, AgentOutput>> {
  // ── Initialize results object ──────────────────────────────────────────
  // This will hold the output from each agent as they complete
  const results: Partial<Record<AgentId, AgentOutput>> = {};

  // ── Execute waves in sequence ──────────────────────────────────────────
  for (const wave of [1, 2, 3] as const) {
    const waveAgents = getAgentsByWave(wave);

    // Build context string from all previously completed agents
    // This lets later agents reference earlier outputs
    const contextFromPreviousWaves = buildContext(results);

    // Run all agents in this wave simultaneously (in parallel)
    const wavePromises = waveAgents.map(async (agentConfig) => {
      // ── Notify: agent starting ──────────────────────────────────────
      onProgress?.({
        type: "agent-start",
        agentId: agentConfig.id,
      });

      try {
        // ── Run the agent ─────────────────────────────────────────────
        const output = await runAgent(
          agentConfig,
          input,
          wave > 1 ? contextFromPreviousWaves : undefined
        );

        // ── Store result ──────────────────────────────────────────────
        results[agentConfig.id] = output;

        // ── Notify: agent completed ───────────────────────────────────
        onProgress?.({
          type: output.status === "completed" ? "agent-complete" : "agent-error",
          agentId: agentConfig.id,
          output,
          error: output.error,
        });

        return output;
      } catch (error) {
        // ── Handle unexpected errors ──────────────────────────────────
        const errorOutput: AgentOutput = {
          agentId: agentConfig.id,
          status: "error",
          title: `${agentConfig.name} — Failed`,
          summary: "Agent encountered an unexpected error",
          sections: [],
          metadata: {},
          error: error instanceof Error ? error.message : "Unknown error",
        };

        results[agentConfig.id] = errorOutput;

        onProgress?.({
          type: "agent-error",
          agentId: agentConfig.id,
          error: errorOutput.error,
        });

        return errorOutput;
      }
    });

    // ── Wait for ALL agents in this wave to finish before next wave ────
    await Promise.all(wavePromises);
  }

  return results as Record<AgentId, AgentOutput>;
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPER: Build context string from completed agents
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Summarizes all completed agent outputs into a context string.
 * This context is passed to later-wave agents so they can
 * build on previous analysis.
 *
 * TODO (Team Member B):
 * - Consider using the orchestrator model (Gemini 2.5 Pro) to
 *   create a more intelligent summary instead of concatenation
 * - Add relevance filtering (not all previous outputs are useful)
 */
function buildContext(
  results: Partial<Record<AgentId, AgentOutput>>
): string {
  const entries = Object.entries(results);

  if (entries.length === 0) return "";

  return entries
    .filter(([, output]) => output?.status === "completed")
    .map(([agentId, output]) => {
      const config = AGENT_CONFIGS[agentId as AgentId];
      return `### ${config.name}\n${output!.summary}\n${
        output!.sections.map((s) => `#### ${s.heading}\n${s.content}`).join("\n\n")
      }`;
    })
    .join("\n\n---\n\n");
}

// ─────────────────────────────────────────────────────────────────────────────
// UTILITY: Run a single agent (for re-running one agent)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Re-run a single agent. Useful when one agent errored and you want to retry.
 *
 * TODO (Team Member B):
 * - Add retry logic with exponential backoff
 * - Add ability to pass custom context override
 */
export async function runSingleAgent(
  agentId: AgentId,
  input: StartupInput,
  existingResults?: Partial<Record<AgentId, AgentOutput>>
): Promise<AgentOutput> {
  const config = AGENT_CONFIGS[agentId];
  const context = existingResults ? buildContext(existingResults) : undefined;
  return runAgent(config, input, context);
}
