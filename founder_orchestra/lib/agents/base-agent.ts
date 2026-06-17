/**
 * =============================================================================
 * BASE AGENT — Factory for creating AI agents
 * =============================================================================
 *
 * This file provides the function that actually RUNS an AI agent.
 * All 6 agents use this same function — the only difference is their
 * configuration (system prompt, model, etc.) from config.ts.
 *
 * WHAT HAPPENS WHEN AN AGENT RUNS:
 * 1. We build a prompt combining the system prompt + startup idea
 * 2. We send it to Google Gemini via the Vercel AI SDK
 * 3. Gemini generates a structured JSON response
 * 4. We parse and return it as an AgentOutput
 *
 * Owner: AI/Agent Lead (Team Member B)
 * =============================================================================
 */

import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import type { AgentConfig, AgentOutput, StartupInput } from "@/lib/types";

// ─────────────────────────────────────────────────────────────────────────────
// OUTPUT SCHEMA (Zod)
// ─────────────────────────────────────────────────────────────────────────────
// Zod is a validation library that ensures the AI returns data in the
// exact shape we expect. If the AI returns malformed data, Zod catches it.
// Learn more: https://zod.dev

/**
 * Schema for a single chart data point.
 * The AI can include these so we can render charts on the dashboard.
 */
const chartDataPointSchema = z.object({
  name: z.string().describe("Label for this data point"),
  value: z.number().describe("Numeric value"),
});

/**
 * Schema for table data.
 */
const tableDataSchema = z.object({
  headers: z.array(z.string()).describe("Column headers"),
  rows: z.array(z.array(z.string())).describe("Table rows"),
});

/**
 * Schema for one section of the agent's output.
 * Each agent produces multiple sections.
 */
const outputSectionSchema = z.object({
  heading: z.string().describe("Section title"),
  content: z.string().describe("Detailed content in Markdown format"),
  data: z.array(chartDataPointSchema).optional()
    .describe("Optional chart data points for visualization"),
  chartType: z.enum(["bar", "pie", "radar", "line", "area", "funnel"]).optional()
    .describe("Type of chart to render with the data"),
  tableData: tableDataSchema.optional()
    .describe("Optional table data"),
});

/**
 * The complete output schema that every agent must return.
 */
const agentOutputSchema = z.object({
  title: z.string().describe("Title of this analysis"),
  summary: z.string().describe("1-2 sentence executive summary"),
  sections: z.array(outputSectionSchema)
    .describe("Detailed output broken into logical sections"),
  metadata: z.record(z.string(), z.unknown())
    .describe("Extra metadata like scores, counts, or key metrics"),
});

// ─────────────────────────────────────────────────────────────────────────────
// RUN AGENT FUNCTION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Runs a single AI agent and returns its structured output.
 *
 * @param config   - The agent's configuration (from config.ts)
 * @param input    - The founder's startup idea
 * @param context  - Optional: outputs from previous agents (for waves 2 & 3)
 * @returns        - The structured AgentOutput
 *
 * HOW TO USE:
 *   import { runAgent } from "@/lib/agents/base-agent";
 *   import { getAgentConfig } from "@/lib/agents/config";
 *
 *   const config = getAgentConfig("startup-advisor");
 *   const output = await runAgent(config, userInput);
 */
export async function runAgent(
  config: AgentConfig,
  input: StartupInput,
  context?: string
): Promise<AgentOutput> {
  const startedAt = new Date().toISOString();

  try {
    // ── Build the user prompt ──────────────────────────────────────────
    // This combines the startup idea with any context from previous agents
    const userPrompt = buildPrompt(input, context);

    // ── Call the Gemini AI ─────────────────────────────────────────────
    // generateObject() forces the AI to return structured JSON
    // that matches our Zod schema — no free-form text!
    const { object } = await generateObject({
      model: google(config.model),
      schema: agentOutputSchema,
      system: config.systemPrompt,
      prompt: userPrompt,
    });

    // ── Return the structured output ──────────────────────────────────
    return {
      agentId: config.id,
      status: "completed",
      title: object.title,
      summary: object.summary,
      sections: object.sections,
      metadata: object.metadata,
      startedAt,
      completedAt: new Date().toISOString(),
    };
  } catch (error) {
    // ── Handle errors gracefully ──────────────────────────────────────
    console.error(`[Agent: ${config.name}] Error:`, error);

    return {
      agentId: config.id,
      status: "error",
      title: `${config.name} — Error`,
      summary: "This agent encountered an error during execution.",
      sections: [],
      metadata: {},
      startedAt,
      completedAt: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PROMPT BUILDER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Builds the user prompt that gets sent to the AI.
 *
 * TODO (Team Member B):
 * - Add more structured context from previous agents
 * - Add examples of good outputs (few-shot prompting)
 * - Add industry-specific context
 */
function buildPrompt(input: StartupInput, context?: string): string {
  let prompt = `
## Startup Idea to Analyze

**Startup Name:** ${input.startupName}
**Core Idea:** ${input.idea}
`;

  // Add optional fields if provided
  if (input.industry) {
    prompt += `**Industry:** ${input.industry}\n`;
  }
  if (input.targetAudience) {
    prompt += `**Target Audience:** ${input.targetAudience}\n`;
  }
  if (input.budget) {
    prompt += `**Budget Range:** ${input.budget}\n`;
  }
  if (input.additionalContext) {
    prompt += `**Additional Context:** ${input.additionalContext}\n`;
  }

  // Add context from previously completed agents
  if (context) {
    prompt += `
## Context from Previous Analysis
The following analysis has already been completed by other agents. 
Use this information to provide more relevant and connected output.

${context}
`;
  }

  return prompt;
}
