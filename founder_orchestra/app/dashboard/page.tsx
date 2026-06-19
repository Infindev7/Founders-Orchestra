/**
 * =============================================================================
 * PAGE — Dashboard
 * =============================================================================
 *
 * The main Intelligence Dashboard — a single scrollable page with all
 * agent outputs displayed in sections matching the HTML reference.
 *
 * Owner: Frontend Lead (Team Member A)
 * =============================================================================
 */

"use client";

import { useEffect } from "react";
import { useProjectStore, getAgentStatus } from "@/lib/store/project-store";
import { motion, AnimatePresence } from "framer-motion";
import type { AgentStatus } from "@/lib/types";
import { toast } from "@/hooks/use-toast";

// Dashboard sections
import { AgentOrbit } from "@/components/dashboard/agent-orbit";
import { StatsRow } from "@/components/dashboard/stats-row";
import { SectionHeader } from "@/components/dashboard/section-header";
import { MarketSizing } from "@/components/dashboard/market-sizing";
import { TrendList } from "@/components/dashboard/trend-list";
import { CompetitorTable } from "@/components/dashboard/competitor-table";
import { UserStories } from "@/components/dashboard/user-stories";
import { ProductRoadmap } from "@/components/dashboard/product-roadmap";
import { SchemaGrid } from "@/components/dashboard/schema-grid";
import { GithubIssues } from "@/components/dashboard/github-issues";
import { SprintBoard } from "@/components/dashboard/sprint-board";
import { MarketingAssets } from "@/components/dashboard/marketing-assets";

// Loading skeletons
import {
  MarketSizingSkeleton,
  TrendListSkeleton,
  CompetitorTableSkeleton,
  UserStoriesSkeleton,
  ProductRoadmapSkeleton,
  SchemaGridSkeleton,
  GithubIssuesSkeleton,
  SprintBoardSkeleton,
  MarketingAssetsSkeleton,
} from "@/components/dashboard/dashboard-skeletons";

// Helper to determine badge/suffix based on agent status
function getHeaderStatusProps(status: AgentStatus) {
  switch (status) {
    case "running":
      return {
        badge: "⚡ Generating…",
        badgeColor: "#F59E0B",
        suffix: undefined,
      };
    case "idle":
      return {
        badge: undefined,
        badgeColor: undefined,
        suffix: "(queued)",
      };
    case "error":
      return {
        badge: "⚠️ Error",
        badgeColor: "#F43F5E",
        suffix: undefined,
      };
    case "completed":
    default:
      return {
        badge: undefined,
        badgeColor: undefined,
        suffix: undefined,
      };
  }
}

export default function DashboardPage() {
  const loadMockData = useProjectStore((s) => s.loadMockData);
  const input = useProjectStore((s) => s.input);
  const agents = useProjectStore((s) => s.agents);

  // Auto-load mock data if no project is loaded
  useEffect(() => {
    if (!input) {
      loadMockData();
    }
  }, [input, loadMockData]);

  // Retrieve statuses of the corresponding agents
  const marketStatus = getAgentStatus(agents, "market-research");
  const pmStatus = getAgentStatus(agents, "product-manager");
  const architectStatus = getAgentStatus(agents, "architect");
  const engStatus = getAgentStatus(agents, "engineering-manager");
  const marketingStatus = getAgentStatus(agents, "marketing");

  // Retrieve outputs
  const marketOutput = agents["market-research"];
  const pmOutput = agents["product-manager"];
  const architectOutput = agents["architect"];
  const engOutput = agents["engineering-manager"];
  const marketingOutput = agents["marketing"];

  // Map outputs to component structures
  const marketSizingProps = getMarketSizingData(marketOutput);
  const trendListTrends = getTrendListData(marketOutput);
  const competitorEntries = getCompetitorData(marketOutput);
  const userStoriesList = getUserStoriesData(pmOutput);
  const roadmapPhases = getRoadmapData(pmOutput);
  const schemaTables = getSchemaGridData(architectOutput);
  const githubIssuesList = getGithubIssuesData(engOutput);
  const sprintBoardCards = getSprintCardsData(githubIssuesList);
  const marketingAssetsProps = getMarketingAssetsData(marketingOutput);

  return (
    <div>
      {/* ── Agent Orbit ────────────────────────────────────────────────────── */}
      <AgentOrbit />

      {/* ── Stats Row ──────────────────────────────────────────────────────── */}
      <StatsRow />

      {/* ── Market Intelligence ────────────────────────────────────────────── */}
      <section id="market">
        <SectionHeader
          title="Market Intelligence"
          color="#38BDF8"
          action="View full report →"
          {...getHeaderStatusProps(marketStatus)}
        />
        <div className="relative min-h-[200px]">
          <AnimatePresence mode="wait">
            {marketStatus === "completed" ? (
              <motion.div
                key="market-content"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-7"
              >
                <MarketSizing {...marketSizingProps} />
                <TrendList trends={trendListTrends} />
              </motion.div>
            ) : (
              <motion.div
                key="market-skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-7"
              >
                <MarketSizingSkeleton />
                <TrendListSkeleton />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── Competitive Landscape ──────────────────────────────────────────── */}
      <section id="competitors">
        <SectionHeader
          title="Competitive Landscape"
          color="#F43F5E"
          action="Full matrix →"
          {...getHeaderStatusProps(marketStatus)}
        />
        <div className="relative min-h-[250px] mb-7">
          <AnimatePresence mode="wait">
            {marketStatus === "completed" ? (
              <motion.div
                key="competitor-content"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              >
                <CompetitorTable competitors={competitorEntries} />
              </motion.div>
            ) : (
              <motion.div
                key="competitor-skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <CompetitorTableSkeleton />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── Product Intelligence ───────────────────────────────────────────── */}
      <section id="product">
        <SectionHeader
          title="Product Intelligence"
          color="#6366F1"
          {...getHeaderStatusProps(pmStatus)}
        />
        <div className="relative min-h-[220px]">
          <AnimatePresence mode="wait">
            {pmStatus === "completed" ? (
              <motion.div
                key="product-content"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-7"
              >
                <UserStories stories={userStoriesList} />
                <ProductRoadmap phases={roadmapPhases} />
              </motion.div>
            ) : (
              <motion.div
                key="product-skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-7"
              >
                <UserStoriesSkeleton />
                <ProductRoadmapSkeleton />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── Architecture ───────────────────────────────────────────────────── */}
      <section id="architecture">
        <SectionHeader
          title="Architecture"
          color="#F59E0B"
          {...getHeaderStatusProps(architectStatus)}
        />
        <div className="relative min-h-[180px] mb-7">
          <AnimatePresence mode="wait">
            {architectStatus === "completed" ? (
              <motion.div
                key="architecture-content"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              >
                <SchemaGrid tables={schemaTables} />
              </motion.div>
            ) : (
              <motion.div
                key="architecture-skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <SchemaGridSkeleton />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── Engineering Execution ──────────────────────────────────────────── */}
      <section id="engineering">
        <SectionHeader
          title="Engineering Execution"
          color="#8B5CF6"
          {...getHeaderStatusProps(engStatus)}
        />
        <div className="relative min-h-[220px]">
          <AnimatePresence mode="wait">
            {engStatus === "completed" ? (
              <motion.div
                key="engineering-content"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-7"
              >
                <GithubIssues issues={githubIssuesList} />
                <SprintBoard cards={sprintBoardCards} />
              </motion.div>
            ) : (
              <motion.div
                key="engineering-skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-7"
              >
                <GithubIssuesSkeleton />
                <SprintBoardSkeleton />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── Marketing Assets ───────────────────────────────────────────────── */}
      <section id="marketing">
        <SectionHeader
          title="Marketing Assets"
          color="#F43F5E"
          {...getHeaderStatusProps(marketingStatus)}
        />
        <div className="relative min-h-[180px]">
          <AnimatePresence mode="wait">
            {marketingStatus === "completed" ? (
              <motion.div
                key="marketing-content"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              >
                <MarketingAssets {...marketingAssetsProps} />
              </motion.div>
            ) : (
              <motion.div
                key="marketing-skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <MarketingAssetsSkeleton />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PARSING HELPERS — Format raw agent outputs into structured component props
// ─────────────────────────────────────────────────────────────────────────────

function formatNumber(num: number): string {
  if (num >= 1_000_000_000_000) return (num / 1_000_000_000_000).toFixed(1).replace(/\.0$/, "") + "T";
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return num.toString();
}

function getMarketSizingData(agentOutput: any): { entries?: any[]; insight?: string } {
  if (!agentOutput || !agentOutput.sections) return {};
  const section = agentOutput.sections.find((s: any) =>
    s.heading.toLowerCase().includes("size") || s.heading.toLowerCase().includes("sizing")
  );
  if (!section) return {};

  const insight = section.content;

  if (section.data && section.data.length > 0) {
    const entries = section.data.map((dp: any) => {
      let color = "#6366F1";
      let percent = 100;
      if (dp.name.toLowerCase().includes("sam")) {
        color = "#38BDF8";
        percent = 24;
      } else if (dp.name.toLowerCase().includes("som")) {
        color = "#10B981";
        percent = 6;
      }
      return {
        label: dp.name.includes(" — ") ? dp.name : `${dp.name} — ${dp.name.toLowerCase().includes("tam") ? "Total Addressable Market" : dp.name.toLowerCase().includes("sam") ? "Serviceable Addressable" : "Serviceable Obtainable"}`,
        value: typeof dp.value === "number" ? `$${formatNumber(dp.value)}` : String(dp.value),
        barPercent: percent,
        barColor: color,
      };
    });

    try {
      const numericValues = section.data.map((e: any) => typeof e.value === "number" ? e.value : parseFloat(String(e.value).replace(/[^0-9.]/g, "")));
      const max = Math.max(...numericValues);
      if (max > 0) {
        entries.forEach((e: any, i: number) => {
          e.barPercent = Math.max(5, Math.round((numericValues[i] / max) * 100));
        });
      }
    } catch (err) {}

    return { entries, insight };
  }

  const lines = section.content.split("\n");
  const entries: any[] = [];
  lines.forEach((line: string) => {
    const match = line.match(/(TAM|SAM|SOM)\s*[:—-]\s*(\$[0-9.]+[A-Z]?)/i);
    if (match) {
      const type = match[1].toUpperCase();
      const val = match[2];
      let color = "#6366F1";
      let percent = 100;
      if (type === "SAM") {
        color = "#38BDF8";
        percent = 24;
      } else if (type === "SOM") {
        color = "#10B981";
        percent = 6;
      }
      entries.push({
        label: `${type} — ${type === "TAM" ? "Total Addressable Market" : type === "SAM" ? "Serviceable Addressable" : "Serviceable Obtainable"}`,
        value: val,
        barPercent: percent,
        barColor: color,
      });
    }
  });

  if (entries.length > 0) {
    try {
      const numericValues = entries.map(e => {
        const raw = e.value.replace(/[^0-9.]/g, "");
        const parsed = parseFloat(raw);
        if (e.value.toLowerCase().includes("t")) return parsed * 1_000_000_000_000;
        if (e.value.toLowerCase().includes("b")) return parsed * 1_000_000_000;
        if (e.value.toLowerCase().includes("m")) return parsed * 1_000_000;
        if (e.value.toLowerCase().includes("k")) return parsed * 1_000;
        return parsed;
      });
      const max = Math.max(...numericValues);
      if (max > 0) {
        entries.forEach((e, i) => {
          e.barPercent = Math.max(5, Math.round((numericValues[i] / max) * 100));
        });
      }
    } catch (err) {}
    return { entries, insight };
  }

  return {};
}

function getTrendListData(agentOutput: any): any[] | undefined {
  if (!agentOutput || !agentOutput.sections) return undefined;
  const section = agentOutput.sections.find((s: any) =>
    s.heading.toLowerCase().includes("trend")
  );
  if (!section) return undefined;

  const lines = section.content.split("\n");
  const trends: any[] = [];
  let rank = 1;
  lines.forEach((line: string) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    // Clean up rank prefix, e.g. "1. ", "- "
    let cleanLine = trimmed.replace(/^[-•*\d.)\s]+/, "").trim();
    
    // Extract momentum if present, e.g. (+187%) or (-28%)
    let momentum = "";
    let direction: "up" | "down" = "up";
    const momentumMatch = cleanLine.match(/\(([-+−\d%]+)\)/);
    if (momentumMatch) {
      momentum = momentumMatch[1];
      cleanLine = cleanLine.replace(momentumMatch[0], "").trim();
      if (momentum.startsWith("-") || momentum.startsWith("−") || momentum.toLowerCase().includes("down")) {
        direction = "down";
      } else {
        direction = "up";
      }
    }

    // Split title and description using a colon or em-dash/double-dash.
    // Avoid splitting on a single hyphen so we don't break words like "Micro-workout"
    let name = cleanLine;
    let subtitle = "";
    const splitMatch = cleanLine.match(/^([^*:—]+)(?::|—|--)\s*(.*)/);
    if (splitMatch) {
      name = splitMatch[1].replace(/\*\*/g, "").trim();
      subtitle = splitMatch[2].replace(/\*\*/g, "").trim();
    } else {
      name = name.replace(/\*\*/g, "").trim();
    }

    if (name) {
      const color = rank === 1 ? "#6366F1" : rank === 2 ? "#38BDF8" : rank === 3 ? "#10B981" : "#F43F5E";
      
      // Generate momentum if not extracted
      if (!momentum) {
        direction = name.toLowerCase().includes("fatigue") || name.toLowerCase().includes("churn") || name.toLowerCase().includes("drop") ? "down" : "up";
        momentum = direction === "up" ? `+${Math.round(50 + Math.random()*150)}%` : `-${Math.round(10 + Math.random()*40)}%`;
      }

      trends.push({
        rank: String(rank).padStart(2, '0'),
        name,
        subtitle: subtitle || "Emerging growth opportunity",
        sparkData: direction === "up" ? [30 + Math.random()*20, 40 + Math.random()*20, 50 + Math.random()*20, 70 + Math.random()*20, 80 + Math.random()*20, 100] : [80 + Math.random()*20, 70 + Math.random()*20, 60 + Math.random()*20, 50, 45, 40],
        sparkColor: color,
        momentum,
        direction,
      });
      rank++;
    }
  });

  return trends.length > 0 ? trends : undefined;
}

function getCompetitorData(agentOutput: any): any[] | undefined {
  if (!agentOutput || !agentOutput.sections) return undefined;
  const section = agentOutput.sections.find((s: any) =>
    s.heading.toLowerCase().includes("competit")
  );
  if (!section) return undefined;

  if (section.tableData && section.tableData.rows.length > 0) {
    return section.tableData.rows.map((row: any) => ({
      name: row[0],
      tag: row[1] || "",
      aiCoachingScore: parseInt(row[2]) || Math.round(30 + Math.random()*60),
      personalizationScore: parseInt(row[3]) || Math.round(30 + Math.random()*60),
      pricePerMonth: row[4] || "$19",
      threatLevel: (row[5] || "medium").toLowerCase().includes("high") ? "high" : (row[5] || "").toLowerCase().includes("low") ? "low" : "medium",
    }));
  }

  const lines = section.content.split("\n");
  const competitors: any[] = [];
  lines.forEach((line: string) => {
    const trimmed = line.trim();
    const match = trimmed.match(/^[-•*\d.)\s]+(?:\*\*(.*?)\*\*|([^*:]+))\s*[:—-]\s*(.*)/);
    if (match) {
      const name = (match[1] || match[2] || "").trim();
      const desc = match[3].trim();
      if (name && desc) {
        competitors.push({
          name,
          tag: desc.substring(0, 60) + (desc.length > 60 ? "..." : ""),
          aiCoachingScore: Math.round(40 + Math.random()*55),
          personalizationScore: Math.round(40 + Math.random()*55),
          pricePerMonth: desc.includes("$") ? (desc.match(/\$\d+/)?.[0] || "$29") : "$29",
          threatLevel: desc.toLowerCase().includes("high") ? "high" : desc.toLowerCase().includes("low") ? "low" : "medium",
        });
      }
    }
  });

  return competitors.length > 0 ? competitors : undefined;
}

function getUserStoriesData(agentOutput: any): any[] | undefined {
  if (!agentOutput || !agentOutput.sections) return undefined;
  const section = agentOutput.sections.find((s: any) =>
    s.heading.toLowerCase().includes("stor")
  );
  if (!section) return undefined;

  const lines = section.content.split("\n");
  const stories: any[] = [];
  let idCounter = 1;
  lines.forEach((line: string) => {
    const trimmed = line.trim();
    if (trimmed.toLowerCase().includes("as a") || trimmed.toLowerCase().includes("as an")) {
      const cleanText = trimmed.replace(/^[-•*\d.)\s]+/, "").replace(/\*\*/g, "");
      stories.push({
        id: `US-${String(idCounter).padStart(3, '0')}`,
        text: cleanText,
        epic: cleanText.includes("workout") || cleanText.includes("exercise") ? "Workout Engine" : cleanText.includes("onboard") || cleanText.includes("sign up") ? "Onboarding" : "Core Platform",
        priority: cleanText.toLowerCase().includes("must") || cleanText.toLowerCase().includes("critical") || idCounter <= 2 ? "high" : idCounter <= 4 ? "medium" : "low",
      });
      idCounter++;
    }
  });

  return stories.length > 0 ? stories : undefined;
}

function getRoadmapData(agentOutput: any): any[] | undefined {
  if (!agentOutput || !agentOutput.sections) return undefined;
  const section = agentOutput.sections.find((s: any) =>
    s.heading.toLowerCase().includes("roadmap")
  );
  if (!section) return undefined;

  const lines = section.content.split("\n");
  const phases: any[] = [];
  let currentPhase: any = null;

  lines.forEach((line: string) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    const isPhaseHeader = trimmed.match(/^(?:Phase\s*\d+|Q\d+|\*\*Phase|\*\*Q\d+)/i) || trimmed.toLowerCase().includes("mvp") || trimmed.toLowerCase().includes("growth") || trimmed.toLowerCase().includes("scale");
    if (isPhaseHeader && !trimmed.startsWith("-") && !trimmed.startsWith("*")) {
      if (currentPhase) {
        // Fallback to extract inline features in parentheses if no items were added
        if (currentPhase.items.length === 0) {
          const parenMatch = currentPhase.title.match(/(.*)\(([^)]+)\)/);
          if (parenMatch) {
            currentPhase.title = parenMatch[1].trim();
            currentPhase.items = parenMatch[2].split(",").map((s: string) => s.trim());
          }
        }
        phases.push(currentPhase);
      }
      const idx = phases.length;
      const quarter = idx === 0 ? "q1" : idx === 1 ? "q2" : "q3";
      const label = idx === 0 ? "Q1 — MVP" : idx === 1 ? "Q2 — Growth" : idx === 2 ? "Q3 — Scale" : `Q${idx + 1} — Future`;
      currentPhase = {
        label,
        title: trimmed.replace(/[#*`]/g, "").replace(/^Phase\s*\d+[:\s-]*/i, "").trim(),
        quarter,
        items: [],
      };
    } else if (currentPhase && (trimmed.startsWith("-") || trimmed.startsWith("*") || trimmed.match(/^\d+[.)]/))) {
      currentPhase.items.push(trimmed.replace(/^[-•*\d.)\s]+/, "").replace(/\*\*/g, ""));
    }
  });

  if (currentPhase) {
    if (currentPhase.items.length === 0) {
      const parenMatch = currentPhase.title.match(/(.*)\(([^)]+)\)/);
      if (parenMatch) {
        currentPhase.title = parenMatch[1].trim();
        currentPhase.items = parenMatch[2].split(",").map((s: string) => s.trim());
      }
    }
    phases.push(currentPhase);
  }

  return phases.length > 0 ? phases : undefined;
}

function getSchemaGridData(agentOutput: any): any[] | undefined {
  if (!agentOutput || !agentOutput.sections) return undefined;
  const section = agentOutput.sections.find((s: any) =>
    s.heading.toLowerCase().includes("schema") || s.heading.toLowerCase().includes("database")
  );
  if (!section) return undefined;

  const lines = section.content.split("\n");
  const tables: any[] = [];
  let currentTable: any = null;

  lines.forEach((line: string) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    const isTableName = trimmed.startsWith("###") || trimmed.startsWith("Table:") || (trimmed.startsWith("**") && trimmed.endsWith("**") && !trimmed.includes(":") && !trimmed.includes("-"));
    if (isTableName) {
      if (currentTable) {
        tables.push(currentTable);
      }
      currentTable = {
        name: trimmed.replace(/[#*`]/g, "").replace(/^Table:\s*/i, "").trim(),
        columns: [],
      };
    } else if (currentTable && (trimmed.startsWith("-") || trimmed.startsWith("*") || trimmed.includes("|"))) {
      const colMatch = trimmed.match(/(?:-|\*|\|)\s*`?([a-zA-Z0-9_]+)`?\s*\(?\s*([a-zA-Z0-9_(),\s/]+)\)?/);
      if (colMatch) {
        const colName = colMatch[1];
        const colType = colMatch[2].split(",")[0].trim();
        const isPK = colMatch[2].toLowerCase().includes("pk") || colMatch[2].toLowerCase().includes("primary");
        const isFK = colMatch[2].toLowerCase().includes("fk") || colMatch[2].toLowerCase().includes("foreign");
        const exists = currentTable.columns.some((c: any) => c.name === colName);
        if (!exists) {
          currentTable.columns.push({
            name: colName,
            type: colType,
            isKey: isPK || isFK,
            badge: isPK ? "PK" : isFK ? "FK" : undefined,
          });
        }
      }
    }
  });

  if (currentTable) {
    tables.push(currentTable);
  }

  return tables.length > 0 ? tables : undefined;
}

function getGithubIssuesData(agentOutput: any): any[] | undefined {
  if (!agentOutput || !agentOutput.sections) return undefined;
  const section = agentOutput.sections.find((s: any) =>
    s.heading.toLowerCase().includes("issue")
  );
  if (!section) return undefined;

  const lines = section.content.split("\n");
  const issues: any[] = [];
  let issueCounter = 1;

  lines.forEach((line: string) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("-") || trimmed.startsWith("*") || trimmed.match(/^\d+[.)]/)) {
      const cleanText = trimmed.replace(/^[-•*\d.)\s]+/, "").replace(/\*\*/g, "");
      const spMatch = cleanText.match(/(?:\(|\[)\s*(\d+)\s*(?:sp|story|points?)\s*(?:\)|\])/i);
      const points = spMatch ? parseInt(spMatch[1]) : 5;
      const title = cleanText.replace(/(?:\(|\[)\s*\d+\s*(?:sp|story|points?)\s*(?:\)|\])/i, "").trim();

      const labels: any[] = [];
      if (title.toLowerCase().includes("auth") || title.toLowerCase().includes("jwt")) {
        labels.push({ text: "auth", variant: "auth" });
      }
      if (title.toLowerCase().includes("ai") || title.toLowerCase().includes("model")) {
        labels.push({ text: "ai", variant: "ai" });
      }
      if (title.toLowerCase().includes("ui") || title.toLowerCase().includes("page")) {
        labels.push({ text: "ui", variant: "ui" });
      }
      if (labels.length === 0) {
        labels.push({ text: "feature", variant: "feat" });
      }
      labels.push({ text: `P${issueCounter <= 2 ? 1 : issueCounter <= 4 ? 2 : 3}`, variant: `p${issueCounter <= 2 ? 1 : issueCounter <= 4 ? 2 : 3}` });

      issues.push({
        number: `#${String(issueCounter).padStart(3, '0')}`,
        title,
        labels,
        storyPoints: points,
      });
      issueCounter++;
    }
  });

  return issues.length > 0 ? issues : undefined;
}

function getSprintCardsData(issues: any[] | undefined): any[] | undefined {
  if (!issues || issues.length === 0) return undefined;
  return issues.map((issue, idx) => ({
    title: issue.title,
    points: issue.storyPoints,
    linkedId: issue.number,
    column: idx < 2 ? "done" : idx < 4 ? "inprog" : "todo",
  }));
}

function getMarketingAssetsData(agentOutput: any): { headline?: string; subheadline?: string; cta?: string; socialProof?: string; linkedinPost?: string } | undefined {
  if (!agentOutput || !agentOutput.sections) return undefined;

  const landingSection = agentOutput.sections.find((s: any) =>
    s.heading.toLowerCase().includes("landing")
  );
  const linkedinSection = agentOutput.sections.find((s: any) =>
    s.heading.toLowerCase().includes("linkedin") || s.heading.toLowerCase().includes("social")
  );

  const res: any = {};
  if (landingSection) {
    const content = landingSection.content;
    const headlineMatch = content.match(/(?:Headline|Hero\s*headline|Title)\s*[:—-]\s*(.*)/i);
    const subheadlineMatch = content.match(/(?:Subheadline|Subtitle)\s*[:—-]\s*(.*)/i);
    const ctaMatch = content.match(/(?:CTA|Button)\s*[:—-]\s*(.*)/i);
    const socialProofMatch = content.match(/(?:Social proof|Testimonial)\s*[:—-]\s*(.*)/i);

    if (headlineMatch) res.headline = headlineMatch[1].replace(/\*\*/g, "").trim();
    if (subheadlineMatch) res.subheadline = subheadlineMatch[1].replace(/\*\*/g, "").trim();
    if (ctaMatch) res.cta = ctaMatch[1].replace(/\*\*/g, "").trim();
    if (socialProofMatch) res.socialProof = socialProofMatch[1].replace(/\*\*/g, "").trim();
  }

  if (linkedinSection) {
    res.linkedinPost = linkedinSection.content;
  }

  return Object.keys(res).length > 0 ? res : undefined;
}
