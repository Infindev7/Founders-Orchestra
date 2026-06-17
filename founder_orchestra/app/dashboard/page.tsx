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
import { useProjectStore } from "@/lib/store/project-store";

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

export default function DashboardPage() {
  const loadMockData = useProjectStore((s) => s.loadMockData);
  const input = useProjectStore((s) => s.input);

  // Auto-load mock data if no project is loaded
  useEffect(() => {
    if (!input) {
      loadMockData();
    }
  }, [input, loadMockData]);

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
        />
        <div className="grid grid-cols-2 gap-5 mb-7">
          <MarketSizing />
          <TrendList />
        </div>
      </section>

      {/* ── Competitive Landscape ──────────────────────────────────────────── */}
      <section id="competitors">
        <SectionHeader
          title="Competitive Landscape"
          color="#F43F5E"
          action="Full matrix →"
        />
        <CompetitorTable />
      </section>

      {/* ── Product Intelligence ───────────────────────────────────────────── */}
      <section id="product">
        <SectionHeader
          title="Product Intelligence"
          color="#6366F1"
        />
        <div className="grid grid-cols-2 gap-5 mb-7">
          <UserStories />
          <ProductRoadmap />
        </div>
      </section>

      {/* ── Architecture ───────────────────────────────────────────────────── */}
      <section id="architecture">
        <SectionHeader
          title="Architecture — In Progress"
          color="#F59E0B"
          badge="⚡ Generating…"
          badgeColor="#F59E0B"
        />
        <SchemaGrid />
      </section>

      {/* ── Engineering Execution ──────────────────────────────────────────── */}
      <section id="engineering">
        <SectionHeader
          title="Engineering Execution"
          color="#64748B"
          suffix="(queued)"
        />
        <div className="grid grid-cols-2 gap-5 mb-7">
          <GithubIssues />
          <SprintBoard />
        </div>
      </section>

      {/* ── Marketing Assets ───────────────────────────────────────────────── */}
      <section id="marketing">
        <SectionHeader
          title="Marketing Assets"
          color="#64748B"
          suffix="(queued)"
        />
        <MarketingAssets />
      </section>
    </div>
  );
}
