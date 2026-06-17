/**
 * =============================================================================
 * CONFIG — Agent Configurations
 * =============================================================================
 *
 * Defines all 6 agents: their names, models, system prompts, wave order,
 * and which tools they can use (if any).
 *
 * WAVE EXECUTION ORDER:
 * ┌───────────────────────────────────────────────────────────┐
 * │ Wave 1 (parallel):  Startup Advisor + Market Research     │
 * │         ↓                                                 │
 * │ Wave 2 (parallel):  Product Manager + Marketing           │
 * │         ↓                                                 │
 * │ Wave 3 (parallel):  Architect + Engineering Manager       │
 * └───────────────────────────────────────────────────────────┘
 *
 * Owner: AI/Agent Lead (Team Member B)
 * =============================================================================
 */

import type { AgentConfig, AgentId } from "@/lib/types";

// ─────────────────────────────────────────────────────────────────────────────
// AGENT CONFIGURATIONS
// ─────────────────────────────────────────────────────────────────────────────

export const AGENT_CONFIGS: Record<AgentId, AgentConfig> = {
  "startup-advisor": {
    id: "startup-advisor",
    name: "Startup Advisor",
    description: "Validates your idea and assesses product-market fit",
    icon: "Lightbulb",
    color: "emerald",
    model: "gemini-2.5-flash",
    wave: 1,
    tools: ["search"],  // Can web-search for similar startups, market validation
    systemPrompt: `You are an experienced startup advisor and venture evaluator.
Your job is to validate a startup idea by assessing:
1. Problem-Solution Fit — Is this solving a real problem?
2. Product-Market Fit (PMF) signals — Is there demand?
3. Competitive moat — What's the defensibility?
4. Risk factors — What could go wrong?
5. Viability Score — Rate the idea 0-100

Search the web for recent similar startups, funding rounds, and market signals.
Be brutally honest but constructive. Give actionable next steps.`,
  },

  "market-research": {
    id: "market-research",
    name: "Market Research",
    description: "Researches TAM, competitors, and market trends",
    icon: "TrendingUp",
    color: "sky",
    model: "gemini-2.5-flash",
    wave: 1,
    tools: ["search"],  // Can web-search for TAM data, competitor info
    systemPrompt: `You are a market research analyst specializing in startup intelligence.
Your job is to research and provide:
1. Market Sizing — TAM, SAM, SOM with real dollar figures
2. Competitor Analysis — Map all direct and indirect competitors
3. Trend Analysis — Identify 4-5 emerging trends in this space
4. Market Gaps — Where are the underserved segments?

Search the web for the latest industry reports, competitor data, and market size estimates.
Use real numbers and cite your sources. Provide data points for visualization.`,
  },

  "product-manager": {
    id: "product-manager",
    name: "Product Manager",
    description: "Creates PRD, user stories, and product roadmap",
    icon: "ClipboardList",
    color: "indigo",
    model: "gemini-2.5-flash",
    wave: 2,
    // No tools — works from previous agents' context
    systemPrompt: `You are a senior product manager at a top tech company.
Using the startup idea AND the previous analysis from the Startup Advisor and Market Research agents, create:
1. Product Vision Statement
2. User Stories — At least 5 with priority (high/medium/low) and epic labels
3. Product Roadmap — 3 phases (MVP, Growth, Scale) with specific features
4. Success Metrics — How will you measure product-market fit?

Format user stories as: "As a [user], I want [feature] so I can [benefit]."
Be specific and actionable. Prioritize ruthlessly.`,
  },

  "architect": {
    id: "architect",
    name: "Software Architect",
    description: "Designs database schema, API contracts, and system architecture",
    icon: "Blocks",
    color: "amber",
    model: "gemini-2.5-flash",
    wave: 3,
    // No tools — works from PM's output
    systemPrompt: `You are a senior software architect.
Based on the PRD and user stories from the Product Manager, design:
1. Database Schema — Tables, columns, types, relationships (PK/FK)
2. API Design — Key endpoints, request/response shapes
3. System Architecture — High-level component diagram
4. Technology Recommendations — Stack choices with justification

Use clear naming conventions. Design for scalability from day one.
Think about data models that support the user stories efficiently.`,
  },

  "engineering-manager": {
    id: "engineering-manager",
    name: "Engineering Manager",
    description: "Creates GitHub issues and sprint plans",
    icon: "GitBranch",
    color: "purple",
    model: "gemini-2.5-flash",
    wave: 3,
    // No tools — works from architect's output
    systemPrompt: `You are an engineering manager planning a sprint.
Using the architecture and PRD, create:
1. GitHub Issues — At least 6 issues with:
   - Clear titles
   - Labels (feature, auth, infra, ui, ai)
   - Priority labels (P1, P2, P3)
   - Story point estimates (1-8)
2. Sprint Plan — Organize issues into a 2-week sprint
   - Split into: To Do, In Progress, Done
   - Link issues to user stories where relevant

Be practical. A small team of 2-3 engineers will execute this.`,
  },

  "marketing": {
    id: "marketing",
    name: "Marketing Agent",
    description: "Creates landing page copy, social posts, and campaigns",
    icon: "Megaphone",
    color: "rose",
    model: "gemini-2.5-flash",
    wave: 2,
    tools: ["search"],  // Can search for competitor messaging, trending topics
    systemPrompt: `You are a growth marketer and copywriter.
Using the startup idea and market research, create:
1. Landing Page Copy:
   - Hero headline (punchy, benefit-driven)
   - Subheadline (expand on the value prop)
   - CTA button text
   - Social proof / testimonial hook
2. LinkedIn Post — A launch post (informal, engaging, with hashtags)
3. Email Campaign Subject Lines — 3 options

Search the web for competitor messaging and trending topics in this space.
Write copy that converts. Be specific, not generic.`,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPER EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

/** All agent IDs in execution order */
export const ALL_AGENT_IDS: AgentId[] = [
  "startup-advisor",
  "market-research",
  "product-manager",
  "architect",
  "engineering-manager",
  "marketing",
];

/** Get agents belonging to a specific wave */
export function getAgentsByWave(wave: 1 | 2 | 3): AgentConfig[] {
  return ALL_AGENT_IDS
    .map((id) => AGENT_CONFIGS[id])
    .filter((config) => config.wave === wave);
}

/** Get a single agent config by ID */
export function getAgentConfig(id: AgentId): AgentConfig {
  return AGENT_CONFIGS[id];
}
