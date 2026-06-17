/**
 * =============================================================================
 * MOCK DATA — Sample agent outputs for development
 * =============================================================================
 *
 * This file contains realistic sample data for ALL 6 agents.
 * Use this to develop and test the dashboard WITHOUT needing
 * an AI API key or running actual agents.
 *
 * HOW TO USE:
 * - The dashboard has a "Mock Data" toggle
 * - When enabled, it uses this data instead of calling the AI
 * - This is great for:
 *   - Frontend development (Team Member A)
 *   - UI testing
 *   - Demos and presentations
 *
 * Owner: Shared (all team members can add/modify)
 * =============================================================================
 */

import type { AgentId, AgentOutput, StartupInput, ProjectState } from "@/lib/types";

// ─────────────────────────────────────────────────────────────────────────────
// SAMPLE STARTUP INPUT
// ─────────────────────────────────────────────────────────────────────────────

export const MOCK_INPUT: StartupInput = {
  startupName: "FitCoach AI",
  idea: "An AI-powered fitness coaching app that creates personalized workout plans, tracks progress through computer vision, and adapts routines based on user performance and goals.",
  industry: "Health & Fitness Technology",
  targetAudience: "Health-conscious millennials and Gen-Z (ages 22-38) who want gym-quality coaching without the cost of a personal trainer.",
  budget: "$50,000 - $100,000",
  additionalContext: "Focusing on mobile-first experience. Plan to monetize through freemium model with premium tier at $14.99/month.",
};

// ─────────────────────────────────────────────────────────────────────────────
// MOCK AGENT OUTPUTS
// ─────────────────────────────────────────────────────────────────────────────

export const MOCK_AGENT_OUTPUTS: Record<AgentId, AgentOutput> = {
  "startup-advisor": {
    agentId: "startup-advisor",
    status: "completed",
    title: "Startup Viability Assessment — FitCoach AI",
    summary: "FitCoach AI scores 7.5/10 on viability. Strong market demand and clear value proposition, but faces stiff competition from established players.",
    sections: [
      {
        heading: "Viability Score",
        content: "**Overall Score: 7.5 / 10**\n\nThe AI fitness coaching space is growing rapidly. Your idea addresses a real pain point — affordable personalized coaching. The computer vision angle is a strong differentiator.",
        data: [
          { name: "Market Fit", value: 8 },
          { name: "Feasibility", value: 7 },
          { name: "Differentiation", value: 8 },
          { name: "Revenue Potential", value: 7 },
          { name: "Team Readiness", value: 6 },
        ],
        chartType: "radar",
      },
      {
        heading: "SWOT Analysis",
        content: "### Strengths\n- AI-powered personalization at scale\n- Computer vision is a unique moat\n- Freemium model lowers adoption barrier\n\n### Weaknesses\n- High development cost for CV features\n- Requires large training dataset\n- Cold start problem for new users\n\n### Opportunities\n- Corporate wellness market ($61B by 2027)\n- Integration with wearables (Apple Watch, Fitbit)\n- Partnership with gyms\n\n### Threats\n- Apple Fitness+, Peloton, Fitbod\n- Data privacy regulations (HIPAA for health data)\n- User retention challenges",
      },
      {
        heading: "Risk Assessment",
        content: "Top risks identified for this venture:",
        data: [
          { name: "Competition", value: 8 },
          { name: "Tech Complexity", value: 7 },
          { name: "User Retention", value: 7 },
          { name: "Funding", value: 5 },
          { name: "Regulation", value: 4 },
        ],
        chartType: "bar",
      },
    ],
    metadata: {
      viabilityScore: 7.5,
      recommendation: "PROCEED_WITH_CAUTION",
      topRisk: "Competition from Apple Fitness+ and Peloton",
    },
    startedAt: "2025-01-15T10:00:00Z",
    completedAt: "2025-01-15T10:00:12Z",
  },

  "market-research": {
    agentId: "market-research",
    status: "completed",
    title: "Market Research Report — AI Fitness Coaching",
    summary: "The global fitness app market is valued at $14.7B (2024) with 14.3% CAGR. AI-powered fitness represents a $3.2B sub-segment with room for differentiated players.",
    sections: [
      {
        heading: "Market Size (TAM/SAM/SOM)",
        content: "**Total Addressable Market (TAM):** $14.7B — The global fitness app market\n\n**Serviceable Addressable Market (SAM):** $3.2B — AI-powered fitness apps in English-speaking markets\n\n**Serviceable Obtainable Market (SOM):** $16M — Realistic year-1 capture (0.5% of SAM)",
        data: [
          { name: "TAM", value: 14700 },
          { name: "SAM", value: 3200 },
          { name: "SOM", value: 16 },
        ],
        chartType: "funnel",
      },
      {
        heading: "Competitor Landscape",
        content: "Key competitors in the AI fitness space:",
        tableData: {
          headers: ["Company", "Users", "Price", "AI Features", "Weakness"],
          rows: [
            ["Apple Fitness+", "43M", "$9.99/mo", "Basic", "No personalization"],
            ["Peloton", "6.7M", "$12.99/mo", "Moderate", "Hardware-dependent"],
            ["Fitbod", "3M", "$12.99/mo", "Strong", "Gym-only focus"],
            ["JEFIT", "10M", "Free/$6.99", "Basic", "Outdated UI"],
            ["Future", "100K", "$149/mo", "Premium", "Very expensive"],
          ],
        },
      },
      {
        heading: "Market Trends",
        content: "### Key Trends\n1. **AI Personalization** — 73% of fitness app users want AI-driven recommendations\n2. **Computer Vision** — Pose estimation tech is now viable on mobile\n3. **Wearable Integration** — 35% CAGR in smartwatch fitness data\n4. **Hybrid Fitness** — Post-COVID blend of home and gym workouts\n5. **Mental Wellness** — Fitness apps adding meditation and sleep features",
        data: [
          { name: "2023", value: 10.2 },
          { name: "2024", value: 14.7 },
          { name: "2025", value: 16.8 },
          { name: "2026", value: 19.2 },
          { name: "2027", value: 21.9 },
        ],
        chartType: "area",
      },
    ],
    metadata: {
      tam: 14700000000,
      sam: 3200000000,
      som: 16000000,
      cagr: "14.3%",
      topCompetitor: "Apple Fitness+",
    },
    startedAt: "2025-01-15T10:00:00Z",
    completedAt: "2025-01-15T10:00:15Z",
  },

  "product-manager": {
    agentId: "product-manager",
    status: "completed",
    title: "Product Requirements Document — FitCoach AI",
    summary: "MVP scoped for 4-week build with 5 core features. User stories defined for 3 personas. Roadmap spans 12 weeks across 3 phases.",
    sections: [
      {
        heading: "Feature Priority Matrix",
        content: "Features ranked by Impact × Effort analysis. Focus MVP on high-impact, low-effort items first.",
        data: [
          { name: "AI Workout Plans", value: 9 },
          { name: "Progress Tracking", value: 8 },
          { name: "Exercise Library", value: 7 },
          { name: "Form Check (CV)", value: 6 },
          { name: "Social Features", value: 4 },
          { name: "Meal Planning", value: 3 },
        ],
        chartType: "bar",
      },
      {
        heading: "User Stories",
        content: "### Core User Stories\n\n1. **As a beginner**, I want to input my fitness goals so that I receive a personalized plan\n2. **As a user**, I want to track my workouts so that I can see my progress over time\n3. **As a user**, I want the AI to adjust my plan based on my performance\n4. **As a gym-goer**, I want exercise video demonstrations so that I use proper form\n5. **As a premium user**, I want real-time form correction using my phone camera\n6. **As a user**, I want to set reminders so that I stay consistent\n7. **As a user**, I want to share achievements so that I stay motivated\n8. **As an admin**, I want to view analytics so that I understand user behavior",
      },
      {
        heading: "Product Roadmap",
        content: "### Phase 1: MVP (Weeks 1-4)\n- User onboarding & goal setting\n- AI workout plan generation\n- Basic progress tracking\n- Exercise library with videos\n\n### Phase 2: Growth (Weeks 5-8)\n- Computer vision form checking\n- Wearable integration (Apple Watch)\n- Social sharing & achievements\n- Push notifications\n\n### Phase 3: Scale (Weeks 9-12)\n- Meal planning integration\n- Premium tier & payments\n- Community features\n- Advanced analytics dashboard",
        data: [
          { name: "Phase 1 (MVP)", value: 4 },
          { name: "Phase 2 (Growth)", value: 4 },
          { name: "Phase 3 (Scale)", value: 4 },
        ],
        chartType: "bar",
      },
    ],
    metadata: {
      totalFeatures: 12,
      mvpFeatures: 5,
      userStories: 8,
      estimatedMvpWeeks: 4,
    },
    startedAt: "2025-01-15T10:00:16Z",
    completedAt: "2025-01-15T10:00:28Z",
  },

  marketing: {
    agentId: "marketing",
    status: "completed",
    title: "Marketing Package — FitCoach AI",
    summary: "Complete go-to-market package with landing page copy, 3 LinkedIn post variants, a 3-email nurture sequence, and a 4-week content calendar.",
    sections: [
      {
        heading: "Landing Page Copy",
        content: "### Hero Section\n**Headline:** Your AI Personal Trainer, Always in Your Pocket\n**Subheadline:** Get gym-quality coaching powered by AI — personalized workouts, real-time form correction, and adaptive plans that evolve with you.\n**CTA:** Start Training Free →\n\n### Value Props\n1. **Smart Plans, Not Templates** — Our AI builds unique workout plans based on your goals, equipment, and fitness level\n2. **See Your Form** — Computer vision watches your form in real-time and gives instant corrections\n3. **Adapt & Overcome** — Plans automatically adjust based on your progress, energy, and schedule",
      },
      {
        heading: "LinkedIn Posts",
        content: "### Post 1: Launch Announcement\n🚀 We just launched FitCoach AI — and the future of fitness is personal.\n\nAfter 6 months of building, we're live with an AI coach that:\n✅ Creates custom workout plans in seconds\n✅ Uses your phone camera to correct your form\n✅ Adapts every week based on your progress\n\nNo more cookie-cutter plans. No more expensive trainers.\n\nTry it free → [link]\n\n#fitness #AI #startup\n\n---\n\n### Post 2: Problem-Solution\nI spent $200/month on a personal trainer.\n\nNot because I wanted to.\nBecause generic workout apps didn't work.\n\nSo we built FitCoach AI — personal training quality at a fraction of the cost.\n\nHere's what makes it different: [thread] 🧵\n\n---\n\n### Post 3: Founder Story\n6 months ago, I was frustrated.\n\nI'd tried 12 fitness apps. None of them felt *personal*.\n\nSo I asked: what if AI could coach like a human?\n\nToday we're launching FitCoach AI — and the early results are insane.\n\nOur beta users are seeing 40% better consistency.\n\nHere's what we learned building it 👇",
      },
      {
        heading: "Content Calendar",
        content: "4-week content plan across platforms:",
        tableData: {
          headers: ["Week", "Platform", "Content Type", "Topic"],
          rows: [
            ["Week 1", "LinkedIn", "Launch Post", "Product announcement"],
            ["Week 1", "Twitter/X", "Thread", "How AI coaches differently"],
            ["Week 2", "Blog", "Article", "5 Signs Your Workout Plan Isn't Working"],
            ["Week 2", "Instagram", "Reel", "AI form correction demo"],
            ["Week 3", "LinkedIn", "Case Study", "Beta user transformation"],
            ["Week 3", "Email", "Newsletter", "Fitness tips + product update"],
            ["Week 4", "YouTube", "Video", "Behind the scenes: Our AI tech"],
            ["Week 4", "Twitter/X", "Poll", "What matters most in a fitness app?"],
          ],
        },
      },
    ],
    metadata: {
      linkedInPosts: 3,
      emailSequenceLength: 3,
      contentCalendarWeeks: 4,
    },
    startedAt: "2025-01-15T10:00:16Z",
    completedAt: "2025-01-15T10:00:25Z",
  },

  architect: {
    agentId: "architect",
    status: "completed",
    title: "Technical Architecture — FitCoach AI",
    summary: "Proposed a serverless architecture on AWS with React Native mobile app, Node.js API, and MongoDB. Estimated infrastructure cost: $150-300/month for MVP.",
    sections: [
      {
        heading: "System Architecture",
        content: "### High-Level Architecture\n```\n┌──────────────┐     ┌──────────────┐     ┌──────────────┐\n│  Mobile App  │────▶│   API Layer  │────▶│   Database   │\n│ React Native │     │   Node.js    │     │   MongoDB    │\n└──────────────┘     └──────┬───────┘     └──────────────┘\n                            │\n                     ┌──────▼───────┐\n                     │   AI Layer   │\n                     │  Gemini API  │\n                     └──────────────┘\n```\n\n### Recommended Tech Stack\n- **Frontend:** React Native (cross-platform mobile)\n- **Backend:** Node.js + Express (or Next.js API routes)\n- **Database:** MongoDB Atlas (flexible schema for workout data)\n- **AI:** Google Gemini API (workout generation)\n- **CV:** MediaPipe (on-device pose estimation)\n- **Hosting:** Vercel (web) + AWS Lambda (API)\n- **Auth:** NextAuth.js / Firebase Auth",
      },
      {
        heading: "Database Schema",
        content: "### Collections\n\n**Users**\n- _id, email, name, goals, fitnessLevel, equipment[]\n- subscription: { tier, startDate, endDate }\n\n**WorkoutPlans**\n- _id, userId, exercises[], schedule, difficulty\n- aiGenerated: boolean, generatedAt\n\n**WorkoutSessions**\n- _id, userId, planId, exercises[], duration\n- formScores[], completionRate, caloriesBurned\n\n**Exercises**\n- _id, name, muscleGroups[], equipment, difficulty\n- videoUrl, instructions, landmarks[] (for CV)",
      },
      {
        heading: "API Endpoints",
        content: "Core REST API design:",
        tableData: {
          headers: ["Method", "Path", "Description", "Auth"],
          rows: [
            ["POST", "/api/auth/register", "Create account", "No"],
            ["POST", "/api/auth/login", "Sign in", "No"],
            ["GET", "/api/workouts/plan", "Get current plan", "Yes"],
            ["POST", "/api/workouts/generate", "AI generates new plan", "Yes"],
            ["POST", "/api/workouts/session", "Log completed workout", "Yes"],
            ["GET", "/api/progress/stats", "Get progress analytics", "Yes"],
            ["POST", "/api/form-check", "Analyze form from video", "Premium"],
          ],
        },
      },
      {
        heading: "Infrastructure Costs",
        content: "Estimated monthly costs for MVP (1K-5K users):",
        data: [
          { name: "MongoDB Atlas", value: 57 },
          { name: "Vercel Pro", value: 20 },
          { name: "Gemini API", value: 50 },
          { name: "AWS Lambda", value: 30 },
          { name: "CDN / Storage", value: 15 },
        ],
        chartType: "pie",
      },
    ],
    metadata: {
      estimatedMonthlyCost: "$150-300",
      collections: 4,
      apiEndpoints: 7,
      techStack: ["React Native", "Node.js", "MongoDB", "Gemini API"],
    },
    startedAt: "2025-01-15T10:00:29Z",
    completedAt: "2025-01-15T10:00:42Z",
  },

  "engineering-manager": {
    agentId: "engineering-manager",
    status: "completed",
    title: "Engineering Plan — FitCoach AI",
    summary: "3-sprint plan covering 6 weeks. 18 GitHub issues defined. Recommended team: 2 developers, 1 designer. Expected velocity: 20 story points/sprint.",
    sections: [
      {
        heading: "Sprint Plan Overview",
        content: "### Sprint 1: Foundation (Weeks 1-2)\n**Goal:** Core app shell + authentication\n- Set up React Native project (3 pts)\n- Implement auth flow (5 pts)\n- Create user onboarding screens (5 pts)\n- Set up MongoDB schemas (3 pts)\n- Build basic navigation (3 pts)\n**Total: 19 story points**\n\n### Sprint 2: Core Features (Weeks 3-4)\n**Goal:** AI workout generation + tracking\n- Integrate Gemini API for plan generation (8 pts)\n- Build workout display UI (5 pts)\n- Implement workout logging (5 pts)\n- Create exercise library (3 pts)\n**Total: 21 story points**\n\n### Sprint 3: Polish & Launch (Weeks 5-6)\n**Goal:** Progress tracking + launch prep\n- Build progress dashboard (5 pts)\n- Add push notifications (3 pts)\n- Implement settings & profile (3 pts)\n- Testing & bug fixes (8 pts)\n- App store submission (2 pts)\n**Total: 21 story points**",
        data: [
          { name: "Sprint 1", value: 19 },
          { name: "Sprint 2", value: 21 },
          { name: "Sprint 3", value: 21 },
        ],
        chartType: "bar",
      },
      {
        heading: "Issue Breakdown by Priority",
        content: "Distribution of tasks by priority level:",
        data: [
          { name: "P0 — Critical", value: 4 },
          { name: "P1 — High", value: 6 },
          { name: "P2 — Medium", value: 5 },
          { name: "P3 — Nice to Have", value: 3 },
        ],
        chartType: "pie",
      },
      {
        heading: "Team & Velocity",
        content: "### Recommended Team\n- **1 Full-stack Developer** — Core features & API\n- **1 Mobile Developer** — React Native & UI\n- **1 Designer** — UX/UI & visual assets\n\n### Velocity Metrics\n- **Sprint Length:** 2 weeks\n- **Target Velocity:** 20 story points/sprint\n- **Total Story Points:** 61\n- **Estimated Completion:** 6 weeks\n- **Buffer:** 1 week for unknowns\n\n### Milestones\n| Milestone | Criteria | Target Date |\n|-----------|----------|-------------|\n| Alpha | Auth + basic workout gen | Week 2 |\n| Beta | Full core features | Week 4 |\n| Launch | Production-ready | Week 6 |",
      },
    ],
    metadata: {
      totalIssues: 18,
      totalStoryPoints: 61,
      sprintCount: 3,
      recommendedTeamSize: 3,
      estimatedWeeks: 6,
    },
    startedAt: "2025-01-15T10:00:29Z",
    completedAt: "2025-01-15T10:00:38Z",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPLETE MOCK PROJECT
// ─────────────────────────────────────────────────────────────────────────────

export const MOCK_PROJECT: ProjectState = {
  _id: "mock-project-001",
  userId: "mock-user-001",
  input: MOCK_INPUT,
  agents: MOCK_AGENT_OUTPUTS,
  overallStatus: "completed",
  createdAt: "2025-01-15T10:00:00Z",
  updatedAt: "2025-01-15T10:00:42Z",
};
