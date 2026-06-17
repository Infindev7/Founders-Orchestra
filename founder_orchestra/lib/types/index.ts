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
  model: string;             // Gemini model to use (e.g. "gemini-2.5-flash")
  systemPrompt: string;      // Instructions that tell the AI how to behave
  wave: 1 | 2 | 3;          // Execution order: wave 1 runs first, then 2, then 3
  tools?: AgentTool[];       // Which tools this agent can use (empty = no tools)
}

/**
 * Tools that can be assigned to agents.
 * - "search": Tavily web search for real-time data (TAM, competitors, trends)
 */
export type AgentTool = "search";

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
// DASHBOARD DATA TYPES — Rich structures from the HTML reference
// ─────────────────────────────────────────────────────────────────────────────

/** A competitor entry for the Competitive Landscape table */
export interface CompetitorEntry {
  name: string;
  tag: string;              // e.g. "Recovery-focused wearable + app"
  aiCoachingScore: number;  // 0–100
  personalizationScore: number; // 0–100
  pricePerMonth: string;    // e.g. "$30"
  threatLevel: "high" | "medium" | "low";
}

/** A user story for the Product Intelligence section */
export interface UserStory {
  id: string;               // e.g. "US-001"
  text: string;             // The user story text
  epic: string;             // e.g. "Core Workout Engine"
  priority: "high" | "medium" | "low";
}

/** A phase in the product roadmap */
export interface RoadmapPhase {
  label: string;            // e.g. "Q1 — MVP"
  title: string;            // e.g. "Foundation"
  quarter: "q1" | "q2" | "q3";
  items: string[];          // List of features/milestones
}

/** A database schema table for the Architecture section */
export interface SchemaTable {
  name: string;             // Table name, e.g. "users"
  columns: SchemaColumn[];
}

/** A column within a schema table */
export interface SchemaColumn {
  name: string;
  type: string;             // e.g. "uuid", "varchar(255)", "jsonb"
  isKey: boolean;           // Has a key icon
  badge?: "PK" | "FK";     // Primary key or foreign key badge
}

/** A GitHub issue for the Engineering section */
export interface GithubIssue {
  number: string;           // e.g. "#001"
  title: string;
  labels: IssueLabel[];
  storyPoints: number;
}

/** A label on a GitHub issue */
export interface IssueLabel {
  text: string;             // e.g. "auth", "feature", "P1"
  variant: "feat" | "auth" | "infra" | "ui" | "ai" | "p1" | "p2" | "p3";
}

/** A card on the sprint board */
export interface SprintCard {
  title: string;
  points: number;
  linkedId?: string;        // e.g. "US-005" or "#004"
  column: "todo" | "inprog" | "done";
}

/** A market trend item */
export interface TrendItem {
  rank: string;             // e.g. "01"
  name: string;
  subtitle: string;
  sparkData: number[];      // Array of heights (0–100%) for sparkline bars
  sparkColor: string;       // CSS color for the last bar
  momentum: string;         // e.g. "+187%"
  direction: "up" | "down";
}

/** TAM/SAM/SOM market sizing entry */
export interface MarketSizingEntry {
  label: string;            // e.g. "TAM — Total Addressable Market"
  value: string;            // e.g. "$42B"
  barPercent: number;       // 0–100, width of the bar
  barColor: string;         // CSS color variable
}

/** Marketing copy block */
export interface MarketingCopy {
  label: string;            // e.g. "Hero — Above the Fold"
  headline: string;
  subtitle: string;
  cta: string;
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

/** Navigation section in the sidebar */
export interface SidebarSection {
  label: string;            // Section heading, e.g. "Research"
  items: SidebarNavItem[];
}

/** A single navigation item in the sidebar */
export interface SidebarNavItem {
  label: string;
  icon: string;             // Lucide icon name
  sectionId: string;        // HTML id to scroll to
}
