/**
 * =============================================================================
 * BASE AGENT — LangGraph-powered AI agent runner
 * =============================================================================
 *
 * This file provides functions that RUN AI agents using LangChain/LangGraph.
 * There are two modes:
 *
 * 1. runAgentWithTools() — For agents that need web search (Tavily)
 *    Uses a LangGraph ReAct agent that can search the web, reason about
 *    results, and search again until it has enough data. Then formats
 *    the result into our structured schema.
 *
 * 2. runAgent() — For agents that DON'T need tools
 *    Uses a simple ChatGoogleGenerativeAI.withStructuredOutput() call.
 *    Directly returns structured JSON matching our Zod schema.
 *
 * WHY TWO MODES?
 * Gemini can't reliably do tool-calling AND structured output in the same
 * call. So tool-using agents have a 2-step process:
 *   Step 1: ReAct agent gathers research (tool-calling mode)
 *   Step 2: Formatter structures the research (structured output mode)
 *
 * Owner: AI/Agent Lead (Team Member B)
 * =============================================================================
 */

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { SystemMessage, HumanMessage, isAIMessage } from "@langchain/core/messages";
import { TavilySearch } from "@langchain/tavily";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { z } from "zod";
import type { AgentConfig, AgentOutput, StartupInput } from "@/lib/types";

type AgentProgressCallback = (partialText: string) => void;

function extractChunkText(chunk: any): string {
  if (!chunk) return "";
  if (typeof chunk.text === "string") return chunk.text;
  if (typeof chunk.content === "string") return chunk.content;
  return "";
}

// ─────────────────────────────────────────────────────────────────────────────
// OUTPUT SCHEMA (Zod)
// ─────────────────────────────────────────────────────────────────────────────
// Zod validates that the AI returns data in the exact shape we expect.
// If the AI returns malformed data, Zod catches it.
// Learn more: https://zod.dev

/** Schema for a single chart data point */
const chartDataPointSchema = z.object({
  name: z.string().describe("Label for this data point"),
  value: z.number().describe("Numeric value"),
});

/** Schema for table data */
const tableDataSchema = z.object({
  headers: z.array(z.string()).describe("Column headers"),
  rows: z.array(z.array(z.string())).describe("Table rows"),
});

/** Schema for one section of the agent's output */
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

/** The complete output schema that every agent must return */
const agentOutputSchema = z.object({
  title: z.string().describe("Title of this analysis"),
  summary: z.string().describe("1-2 sentence executive summary"),
  sections: z.array(outputSectionSchema)
    .describe("Detailed output broken into logical sections"),
  metadata: z.record(z.string(), z.unknown())
    .describe("Extra metadata like scores, counts, or key metrics"),
});

// ─────────────────────────────────────────────────────────────────────────────
// RUN AGENT (No Tools) — Direct structured output
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Runs an AI agent WITHOUT tools (PM, Architect, Eng Manager).
 * Uses ChatGoogleGenerativeAI.withStructuredOutput() for a direct
 * prompt → structured JSON response.
 *
 * @param config   - The agent's configuration (from config.ts)
 * @param input    - The founder's startup idea
 * @param context  - Optional: outputs from previous agents
 * @returns        - The structured AgentOutput
 */
export async function runAgent(
  config: AgentConfig,
  input: StartupInput,
  context?: string,
  onProgress?: AgentProgressCallback
): Promise<AgentOutput> {
  const startedAt = new Date().toISOString();

  try {
    const userPrompt = buildPrompt(input, context);

    // ── Create model with structured output ──────────────────────────────
    const model = new ChatGoogleGenerativeAI({
      model: config.model,
      apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
      streaming: true,
    });

    const structuredModel = model.withStructuredOutput(agentOutputSchema);

    // ── Call the model in streaming mode and aggregate chunks ─────────────
    const stream = await structuredModel.stream([
      new SystemMessage(config.systemPrompt),
      new HumanMessage(userPrompt),
    ]);

    let aggregatedText = "";
    for await (const chunk of stream) {
      const partial = extractChunkText(chunk);
      if (partial) {
        aggregatedText += partial;
        onProgress?.(aggregatedText);
      }
    }

    const result = await stream.app();

    return {
      agentId: config.id,
      status: "completed",
      title: result.title,
      summary: result.summary,
      sections: result.sections,
      metadata: result.metadata,
      startedAt,
      completedAt: new Date().toISOString(),
      latestReasoning: aggregatedText,
    };
  } catch (error) {
    console.error(`[Agent: ${config.name}] Error:`, error);
    return createErrorOutput(config, startedAt, error);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// RUN AGENT WITH TOOLS — LangGraph ReAct agent + Tavily web search
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Runs an AI agent WITH tools (Advisor, Market Research, Marketing).
 * Two-step process:
 *   1. ReAct agent reasons and calls Tavily web search
 *   2. Formatter structures the result into our schema
 *
 * @param config   - The agent's configuration (from config.ts)
 * @param input    - The founder's startup idea
 * @param context  - Optional: outputs from previous agents
 * @returns        - The structured AgentOutput
 */
export async function runAgentWithTools(
  config: AgentConfig,
  input: StartupInput,
  context?: string
): Promise<AgentOutput> {
  const startedAt = new Date().toISOString();

  try {
    const userPrompt = buildPrompt(input, context);

    // ── Step 1: Create ReAct agent with tools ────────────────────────────
    const model = new ChatGoogleGenerativeAI({
      model: config.model,
      apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    });

    const tools = [
      new TavilySearch({
        maxResults: 3,
      }),
    ];

    // createReactAgent handles the ReAct reasoning loop:
    // Think → Act (search) → Observe → Think → ... → Final answer
    const agent = createReactAgent({
      llm: model,
      tools,
    });

    // Run the agent — it will search the web as needed
    const agentResult = await agent.invoke({
      messages: [
        new SystemMessage(config.systemPrompt),
        new HumanMessage(userPrompt),
      ],
    });

    // Extract the agent's final message (the last AI message)
    const lastMessage = agentResult.messages[agentResult.messages.length - 1];
    const researchText = typeof lastMessage.content === "string"
      ? lastMessage.content
      : JSON.stringify(lastMessage.content);

    // ── Step 2: Format research into structured output ───────────────────
    const formatter = new ChatGoogleGenerativeAI({
      model: config.model,
      apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    });

    const structuredFormatter = formatter.withStructuredOutput(agentOutputSchema);

    const result = await structuredFormatter.invoke([
      new SystemMessage(
        "You are a data formatter. Take the following research output and structure it into the required JSON format. Preserve all data, numbers, and insights exactly."
      ),
      new HumanMessage(researchText),
    ]);

    return {
      agentId: config.id,
      status: "completed",
      title: result.title,
      summary: result.summary,
      sections: result.sections,
      metadata: result.metadata,
      startedAt,
      completedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error(`[Agent: ${config.name}] Error (with tools):`, error);
    return createErrorOutput(config, startedAt, error);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/** Build the user prompt from input + optional context */
function buildPrompt(input: StartupInput, context?: string): string {
  let prompt = `
## Startup Idea to Analyze

**Startup Name:** ${input.startupName}
**Core Idea:** ${input.idea}
`;

  if (input.industry) prompt += `**Industry:** ${input.industry}\n`;
  if (input.targetAudience) prompt += `**Target Audience:** ${input.targetAudience}\n`;
  if (input.budget) prompt += `**Budget Range:** ${input.budget}\n`;
  if (input.additionalContext) prompt += `**Additional Context:** ${input.additionalContext}\n`;

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

/** Create a standardized error output */
function createErrorOutput(
  config: AgentConfig,
  startedAt: string,
  error: unknown
): AgentOutput {
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
