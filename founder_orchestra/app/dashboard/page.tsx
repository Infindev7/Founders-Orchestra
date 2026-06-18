/**
 * =============================================================================
 * PAGE — Dashboard
 * =============================================================================
 *
 * The main Intelligence Dashboard — a single scrollable page with all
 * agent outputs displayed in sections matching the HTML reference.
 *
 * SECTIONS (in order):
 * 1. Agent Orbit (status ring + agent rows)
 * 2. Stats Row (TAM, competitors, PMF, artifacts)
 * 3. Market Intelligence (TAM bars + trends)
 * 4. Competitive Landscape (table)
 * 5. Product Intelligence (user stories + roadmap)
 * 6. Architecture (schema tables)
 * 7. Engineering Execution (issues + sprint board)
 * 8. Marketing Assets (copy + social)
 *
 * Owner: Frontend Lead (Team Member A)
 * =============================================================================
 */

"use client";

import { useEffect } from "react";
import { useProjectStore, getAgentStatus } from "@/lib/store/project-store";
import { motion, AnimatePresence } from "framer-motion";
import type { AgentStatus } from "@/lib/types";

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
                <MarketSizing />
                <TrendList />
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
                <CompetitorTable />
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
                <UserStories />
                <ProductRoadmap />
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
                <SchemaGrid />
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
                <GithubIssues />
                <SprintBoard />
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
                <MarketingAssets />
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
