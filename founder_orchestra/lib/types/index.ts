/**
 * =============================================================================
 * FOUNDERS ORCHESTRA — TYPE DEFINITIONS
 * =============================================================================
 *
 * This file contains ALL TypeScript types used across the entire application.
 * Think of it as the "dictionary" — every data shape is defined here.
 *
 * WHY THIS MATTERS:
 * - TypeScript types prevent bugs by catching errors before the code runs
 * - All team members should import types from this file
 * - If you need a new data shape, ADD IT HERE FIRST
 *
 * HOW TO USE:
 * In any file, import what you need like:
 *   import { AgentId, ProjectState } from "@/lib/types";
 *
 * Owner: Shared (all team members reference this)
 * =============================================================================
 */

// ─────────────────────────────────────────────────────────────────────────────
// AGENT TYPES — Define the AI agents and their behavior
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Each AI agent has a unique ID. These are the 6 agents in our system.
 * When you see "AgentId" in code, it can ONLY be one of these values.
 */
export type AgentId =
  | "startup-advisor"
  | "market-research"
  | "product-manager"
  | "architect"
  | "engineering-manager"
  | "marketing";

/**
 * An agent goes through these states during execution:
 * - idle:      Not started yet
 * - running:   Currently thinking / generating output
 * - completed: Done, output is ready
 * - error:     Something went wrong
 */
export type AgentStatus = "idle" | "running" | "completed" | "error";

/**
 * Configuration for one AI agent.
 * This tells the system HOW to run the agent.
 */
export interface AgentConfig {
  id: AgentId;
  name: string;              // Human-readable name, e.g. "Startup Advisor"
  description: string;       // What this agent does
  icon: string;              // Lucide icon name (see: https://lucide.dev/icons)
  color: string;             // Tailwind color class for UI theming
  model: string;             // Gemini model to use (e.g. "gemini-2.0-flash")
  systemPrompt: string;      // Instructions that tell the AI how to behave
  wave: 1 | 2 | 3;          // Execution order: wave 1 runs first, then 2, then 3
}

/**
 * The output that each agent produces.
 * This is what gets displayed on the dashboard.
 */
export interface AgentOutput {
  agentId: AgentId;
  status: AgentStatus;
  title: string;             // Title of the agent's output section
  summary: string;           // Brief 1-2 sentence summary
  sections: OutputSection[]; // Detailed output broken into sections
  metadata: Record<string, unknown>; // Any extra data (scores, counts, etc.)
  startedAt?: string;        // ISO timestamp when agent started
  completedAt?: string;      // ISO timestamp when agent finished
  error?: string;            // Error message if status is "error"
}

/**
 * One section within an agent's output.
 * Example: The Market Research agent might have sections for
 * "TAM Analysis", "Competitor Landscape", "Trend Analysis"
 */
export interface OutputSection {
  heading: string;           // Section title
  content: string;           // The actual content (supports Markdown formatting)
  data?: ChartDataPoint[];   // Optional: data points for rendering a chart
  chartType?: ChartType;     // Optional: what kind of chart to render
  tableData?: TableData;     // Optional: data for rendering a table
}

/** Supported chart types for data visualization */
export type ChartType = "bar" | "pie" | "radar" | "line" | "area" | "funnel";

/** A single data point for charts */
export interface ChartDataPoint {
  name: string;    // Label (x-axis or legend)
  value: number;   // Numeric value (y-axis)
  fill?: string;   // Optional color override
}

/** Table data structure for tabular displays */
export interface TableData {
  headers: string[];
  rows: string[][];
}

// ─────────────────────────────────────────────────────────────────────────────
// PROJECT TYPES — The founder's startup project
// ─────────────────────────────────────────────────────────────────────────────

/**
 * What the founder enters when they start a new project.
 * This is the INPUT to the orchestration system.
 */
export interface StartupInput {
  startupName: string;       // Name of the startup
  idea: string;              // The core idea description
  industry?: string;         // Optional: Industry/sector
  targetAudience?: string;   // Optional: Who is this for?
  budget?: string;           // Optional: Estimated budget range
  additionalContext?: string; // Optional: Any extra info
}

/**
 * The complete project state — input + all agent outputs.
 * This is what gets saved to the database and displayed on the dashboard.
 */
export interface ProjectState {
  _id?: string;              // MongoDB document ID
  userId?: string;           // Owner's user ID
  input: StartupInput;       // What the founder entered
  agents: Record<AgentId, AgentOutput>; // Output from each agent
  overallStatus: OrchestrationStatus;   // Overall pipeline status
  createdAt: string;         // ISO timestamp
  updatedAt: string;         // ISO timestamp
}

/**
 * Overall status of the orchestration pipeline.
 * - not-started: No agents have been triggered
 * - in-progress: At least one agent is running
 * - completed:   All agents finished successfully
 * - partial:     Some agents completed, some errored
 */
export type OrchestrationStatus =
  | "not-started"
  | "in-progress"
  | "completed"
  | "partial";

// ─────────────────────────────────────────────────────────────────────────────
// USER / AUTH TYPES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * User profile stored in the database.
 */
export interface User {
  _id?: string;
  name: string;
  email: string;
  image?: string;
  projects: string[];       // Array of project IDs
  createdAt: string;
  updatedAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// API TYPES — Request/Response shapes for API routes
// ─────────────────────────────────────────────────────────────────────────────

/** Request body for POST /api/orchestrate */
export interface OrchestrateRequest {
  input: StartupInput;
  projectId?: string;       // If re-running for an existing project
}

/** Streamed response from the orchestration API */
export interface OrchestrateEvent {
  type: "agent-start" | "agent-complete" | "agent-error" | "orchestration-complete";
  agentId?: AgentId;
  data?: AgentOutput;
  error?: string;
  timestamp: string;
}

/** Request body for POST /api/report */
export interface ReportRequest {
  projectId: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// UI TYPES — Props and state for frontend components
// ─────────────────────────────────────────────────────────────────────────────

/** Navigation item for the dashboard sidebar */
export interface SidebarNavItem {
  agentId: AgentId;
  label: string;
  icon: string;
  status: AgentStatus;
}

/** Props for chart components */
export interface ChartProps {
  data: ChartDataPoint[];
  title?: string;
  height?: number;
  className?: string;
}
