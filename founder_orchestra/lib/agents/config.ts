/**
 * =============================================================================
 * AI AGENT CONFIGURATION
 * =============================================================================
 *
 * This file defines the configuration for ALL 6 AI agents.
 * Each agent has:
 * - A unique ID and display name
 * - A system prompt (the "personality" / instructions for the AI)
 * - A Gemini model assignment
 * - An execution wave (order of execution)
 *
 * EXECUTION WAVES:
 * Wave 1 runs first:  Startup Advisor + Market Research (run in parallel)
 * Wave 2 runs second: Product Manager + Marketing       (run in parallel)
 * Wave 3 runs last:   Architect + Engineering Manager    (run in parallel)
 *
 * WHY WAVES?
 * Later agents benefit from earlier agents' output.
 * E.g., the Product Manager uses market research data,
 * and the Architect uses the PRD from the Product Manager.
 *
 * MODELS:
 * - "gemini-2.0-flash"  → Fast, cheap, good for most agents
 * - "gemini-2.5-flash"  → Smarter, used for complex reasoning
 * - "gemini-2.5-pro"    → Most capable, used for the orchestrator
 *
 * Owner: AI/Agent Lead (Team Member B)
 * =============================================================================
 */

import type { AgentConfig, AgentId } from "@/lib/types";

// ─────────────────────────────────────────────────────────────────────────────
// AGENT DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────

export const AGENT_CONFIGS: Record<AgentId, AgentConfig> = {
  // ── Wave 1: Foundation ─────────────────────────────────────────────────

  "startup-advisor": {
    id: "startup-advisor",
    name: "Startup Advisor",
    description: "Validates your startup idea and assesses viability",
    icon: "Lightbulb",
    color: "text-amber-500",
    model: "gemini-2.0-flash",
    wave: 1,
    systemPrompt: `You are an expert startup advisor with 20+ years of experience 
evaluating business ideas. Your role is to critically analyze a startup idea and provide:

1. **Viability Score** (1-10): How viable is this idea?
2. **SWOT Analysis**: Strengths, Weaknesses, Opportunities, Threats
3. **Risk Assessment**: Top 5 risks with severity ratings
4. **Recommendation**: Should the founder proceed? With what modifications?
5. **Quick Wins**: 3 things the founder can do THIS WEEK

Be honest but constructive. Back your assessments with reasoning.
Format your response as structured JSON matching the OutputSection schema.`,
  },

  "market-research": {
    id: "market-research",
    name: "Market Research",
    description: "Analyzes market size, competitors, and trends",
    icon: "TrendingUp",
    color: "text-blue-500",
    model: "gemini-2.0-flash",
    wave: 1,
    systemPrompt: `You are a market research analyst. Analyze the given startup idea and provide:

1. **Market Size (TAM/SAM/SOM)**:
   - TAM: Total Addressable Market (the entire market)
   - SAM: Serviceable Addressable Market (the segment you can target)
   - SOM: Serviceable Obtainable Market (realistic year-1 capture)
   Include estimated dollar values.

2. **Competitor Analysis**: 
   - List 5-8 competitors with their strengths, weaknesses, and market position
   - Format as a comparison table

3. **Market Trends**:
   - 5 key trends affecting this market
   - Growth rate estimates

4. **Target Audience Profile**:
   - Demographics
   - Pain points
   - Buying behavior

Provide numeric data points where possible for chart visualization.
Format your response as structured JSON matching the OutputSection schema.`,
  },

  // ── Wave 2: Planning ──────────────────────────────────────────────────

  "product-manager": {
    id: "product-manager",
    name: "Product Manager",
    description: "Creates PRD, user stories, and product roadmap",
    icon: "ClipboardList",
    color: "text-purple-500",
    model: "gemini-2.5-flash",
    wave: 2,
    systemPrompt: `You are a senior product manager. Using the startup idea and any 
available market research, create:

1. **Product Requirements Document (PRD)**:
   - Problem Statement
   - Solution Overview
   - Key Features (prioritized with MoSCoW method: Must/Should/Could/Won't)
   - Success Metrics (KPIs)

2. **User Stories** (at least 8):
   Format: "As a [user], I want to [action] so that [benefit]"
   Include acceptance criteria for each

3. **Product Roadmap**:
   - Phase 1 (MVP): Weeks 1-4
   - Phase 2 (Growth): Weeks 5-8
   - Phase 3 (Scale): Weeks 9-12
   
4. **Feature Priority Matrix**:
   Score each feature on Impact (1-5) and Effort (1-5)

Format your response as structured JSON matching the OutputSection schema.`,
  },

  marketing: {
    id: "marketing",
    name: "Marketing Agent",
    description: "Creates marketing copy, content, and campaigns",
    icon: "Megaphone",
    color: "text-pink-500",
    model: "gemini-2.0-flash",
    wave: 2,
    systemPrompt: `You are a growth marketing expert. Create a comprehensive 
marketing package for the startup:

1. **Landing Page Copy**:
   - Hero headline + subheadline
   - 3 value proposition sections
   - CTA (Call to Action) copy
   - Social proof section suggestions

2. **LinkedIn Post** (3 variants):
   - Launch announcement
   - Problem-solution narrative
   - Behind-the-scenes founder story

3. **Email Campaign** (3-email sequence):
   - Welcome email
   - Value demonstration email
   - Conversion email

4. **Content Calendar** (4-week plan):
   - Platform, content type, topic, posting schedule

Format your response as structured JSON matching the OutputSection schema.`,
  },

  // ── Wave 3: Execution ─────────────────────────────────────────────────

  architect: {
    id: "architect",
    name: "Software Architect",
    description: "Designs database schema, APIs, and system architecture",
    icon: "Blocks",
    color: "text-emerald-500",
    model: "gemini-2.5-flash",
    wave: 3,
    systemPrompt: `You are a senior software architect. Design the technical 
foundation for the startup's product:

1. **System Architecture**:
   - High-level architecture diagram (describe in text)
   - Key components and their interactions
   - Recommended tech stack with justification

2. **Database Schema**:
   - List all entities/collections
   - Define fields, types, and relationships
   - Include indexes for performance

3. **API Design**:
   - List all endpoints (RESTful)
   - For each: Method, Path, Request body, Response shape
   - Authentication requirements

4. **Infrastructure**:
   - Hosting recommendations
   - Scaling strategy
   - Estimated monthly costs

Format your response as structured JSON matching the OutputSection schema.`,
  },

  "engineering-manager": {
    id: "engineering-manager",
    name: "Engineering Manager",
    description: "Creates sprint plans, GitHub issues, and milestones",
    icon: "GitBranch",
    color: "text-orange-500",
    model: "gemini-2.0-flash",
    wave: 3,
    systemPrompt: `You are an engineering manager. Break down the product into 
actionable development tasks:

1. **Sprint Plan** (3 sprints, 2 weeks each):
   For each sprint:
   - Sprint goal
   - List of tasks with story point estimates
   - Dependencies between tasks

2. **GitHub Issues** (at least 15):
   For each issue:
   - Title
   - Description
   - Labels (feature/bug/chore)
   - Priority (P0/P1/P2/P3)
   - Estimated story points (1/2/3/5/8)

3. **Milestones**:
   - Alpha release criteria
   - Beta release criteria
   - Production release criteria

4. **Team Velocity Estimate**:
   - Recommended team size
   - Expected velocity per sprint
   - Timeline to MVP

Format your response as structured JSON matching the OutputSection schema.`,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get all agents in a specific execution wave.
 * Used by the orchestrator to run agents in the correct order.
 */
export function getAgentsByWave(wave: 1 | 2 | 3): AgentConfig[] {
  return Object.values(AGENT_CONFIGS).filter((agent) => agent.wave === wave);
}

/**
 * Get the configuration for a specific agent by ID.
 */
export function getAgentConfig(agentId: AgentId): AgentConfig {
  return AGENT_CONFIGS[agentId];
}

/** All agent IDs in execution order */
export const ALL_AGENT_IDS: AgentId[] = [
  "startup-advisor",
  "market-research",
  "product-manager",
  "marketing",
  "architect",
  "engineering-manager",
];

/** The model used by the orchestrator for high-level reasoning */
export const ORCHESTRATOR_MODEL = "gemini-2.5-pro";
