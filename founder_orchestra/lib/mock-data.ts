/**
 * =============================================================================
 * MOCK DATA — Sample project data matching the HTML reference
 * =============================================================================
 *
 * This provides a complete mock project so the dashboard can be viewed
 * without needing a real API key. The data matches the HTML reference
 * exactly (FitCoach AI example).
 *
 * HOW TO USE:
 *   import { MOCK_PROJECT } from "@/lib/mock-data";
 *   // In the store: useProjectStore.getState().loadMockData();
 *
 * Owner: Shared
 * =============================================================================
 */

import type { AgentId, AgentOutput, StartupInput, OrchestrationStatus } from "@/lib/types";

const MOCK_INPUT: StartupInput = {
  startupName: "FitCoach AI",
  idea: "AI-powered fitness coach for busy professionals",
  industry: "Health & Fitness",
  targetAudience: "Busy professionals aged 25-45",
};

const MOCK_AGENTS: Record<AgentId, AgentOutput> = {
  "startup-advisor": {
    agentId: "startup-advisor",
    status: "completed",
    title: "Startup Validation — FitCoach AI",
    summary: "Idea validated — strong PMF signals detected",
    sections: [
      { heading: "Problem-Solution Fit", content: "The fitness app market is oversaturated but **lacks AI personalization** for time-constrained professionals." },
      { heading: "PMF Score", content: "**82/100** — Strong demand signals, moderate competition, clear differentiation path." },
    ],
    metadata: { viabilityScore: "82", pmfSignal: "strong" },
    startedAt: "2026-01-01T00:00:00Z",
    completedAt: "2026-01-01T00:00:10Z",
  },
  "market-research": {
    agentId: "market-research",
    status: "completed",
    title: "Market Intelligence — Fitness AI",
    summary: "TAM $42B · 7 competitors mapped · 5 trends",
    sections: [
      { heading: "Market Sizing", content: "TAM: $42B global fitness app market by 2028\nSAM: $9.8B AI-driven fitness\nSOM: $490M busy professionals niche" },
      { heading: "Competitors", content: "Mapped 7 competitors: Whoop, Freeletics, Future, Nike Training Club, Peloton, Noom, Fitbod." },
      { heading: "Trends", content: "1. AI Personalization (+187%)\n2. Wearable Integration (+134%)\n3. Micro-workout Content (+211%)\n4. Subscription Fatigue (-28%)" },
    ],
    metadata: { tam: "$42B", competitorCount: "7", trendCount: "5" },
    startedAt: "2026-01-01T00:00:00Z",
    completedAt: "2026-01-01T00:00:12Z",
  },
  "product-manager": {
    agentId: "product-manager",
    status: "completed",
    title: "Product Blueprint — FitCoach AI",
    summary: "PRD drafted · 12 user stories · 3-phase roadmap",
    sections: [
      { heading: "User Stories", content: "12 user stories created across 5 epics." },
      { heading: "Roadmap", content: "Q1: MVP (auth, AI workout gen, tracking)\nQ2: Growth (wearables, social)\nQ3: Scale (premium, B2B, nutrition)" },
    ],
    metadata: { storyCount: "12", epicCount: "5", phaseCount: "3" },
    startedAt: "2026-01-01T00:00:12Z",
    completedAt: "2026-01-01T00:00:22Z",
  },
  architect: {
    agentId: "architect",
    status: "running",
    title: "System Architecture — FitCoach AI",
    summary: "Designing DB schema and API contracts…",
    sections: [],
    metadata: {},
    startedAt: "2026-01-01T00:00:22Z",
  },
  "engineering-manager": {
    agentId: "engineering-manager",
    status: "idle",
    title: "Engineering Plan",
    summary: "Waiting for architecture output",
    sections: [],
    metadata: { totalIssues: "23" },
  },
  marketing: {
    agentId: "marketing",
    status: "idle",
    title: "Marketing Assets",
    summary: "Waiting for PRD finalization",
    sections: [],
    metadata: {},
  },
};

export const MOCK_PROJECT = {
  input: MOCK_INPUT,
  agents: MOCK_AGENTS,
  overallStatus: "in-progress" as OrchestrationStatus,
};
