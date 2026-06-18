"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart3,
  TrendingUp,
  FileText,
  Map,
  Database,
  GitBranch,
  Rocket,
  Globe,
  Briefcase,
} from "lucide-react";

// ── Market Sizing Skeleton ───────────────────────────────────────────────────
export function MarketSizingSkeleton() {
  return (
    <Card>
      <CardContent className="pt-5 pb-5">
        <div className="font-display text-[13px] font-semibold text-fo-sub uppercase tracking-[0.8px] mb-4 flex items-center gap-2">
          <BarChart3 size={14} />
          Market Sizing
        </div>

        {/* TAM/SAM/SOM bars */}
        <div className="flex flex-col gap-4">
          {[85, 45, 20].map((width, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <Skeleton className="h-3 w-40" />
                <Skeleton className="h-3 w-12" />
              </div>
              <div className="h-[7px] bg-[rgba(255,255,255,.06)] rounded overflow-hidden relative">
                <Skeleton
                  className="absolute left-0 top-0 h-full rounded"
                  style={{ width: `${width}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* AI Insight box */}
        <div className="mt-4 p-2.5 rounded-lg bg-[rgba(16,185,129,.03)] border border-[rgba(16,185,129,.08)]">
          <div className="text-[11px] font-bold text-fo-emerald/75 mb-1.5">AI INSIGHT</div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Trend List Skeleton ───────────────────────────────────────────────────────
export function TrendListSkeleton() {
  return (
    <Card>
      <CardContent className="pt-5 pb-5">
        <div className="font-display text-[13px] font-semibold text-fo-sub uppercase tracking-[0.8px] mb-4 flex items-center gap-2">
          <TrendingUp size={14} />
          Emerging Trends
        </div>

        <div className="flex flex-col gap-2.5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-2.5 px-3 rounded-lg bg-[rgba(255,255,255,.025)] border border-[rgba(255,255,255,.05)]"
            >
              {/* Rank */}
              <Skeleton className="h-3 w-4 font-mono" />

              {/* Body */}
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-2.5 w-48" />
              </div>

              {/* Sparkline (simulated vertical lines) */}
              <div className="flex items-end gap-[2px] h-6 px-2">
                {[30, 50, 40, 70, 60, 90].map((h, idx) => (
                  <Skeleton
                    key={idx}
                    className="w-1 rounded-t-sm"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>

              {/* Momentum */}
              <Skeleton className="h-3 w-10" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ── Competitor Table Skeleton ──────────────────────────────────────────────────
export function CompetitorTableSkeleton() {
  return (
    <Card className="mb-7">
      <CardContent className="pt-5">
        <div className="w-full overflow-hidden">
          {/* Simulated Table Header */}
          <div className="flex border-b border-border hover:bg-transparent pb-3.5 mb-2.5 px-2">
            <div className="w-[30%] text-[11px] font-semibold text-fo-muted uppercase tracking-[0.6px]">Company</div>
            <div className="w-[25%] text-[11px] font-semibold text-fo-muted uppercase tracking-[0.6px]">AI Coaching</div>
            <div className="w-[25%] text-[11px] font-semibold text-fo-muted uppercase tracking-[0.6px]">Personalization</div>
            <div className="w-[10%] text-[11px] font-semibold text-fo-muted uppercase tracking-[0.6px]">Price/mo</div>
            <div className="w-[10%] text-[11px] font-semibold text-fo-muted uppercase tracking-[0.6px]">Threat Level</div>
          </div>

          {/* Simulated Table Rows */}
          <div className="space-y-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-center py-3 px-2 border-t border-[rgba(255,255,255,.04)] bg-transparent"
              >
                {/* Company info */}
                <div className="w-[30%] space-y-1.5 pr-4">
                  <Skeleton className="h-3.5 w-24" />
                  <Skeleton className="h-2.5 w-36" />
                </div>
                {/* AI Coaching */}
                <div className="w-[25%] flex items-center gap-2 pr-6">
                  <Skeleton className="h-[5px] flex-1 rounded-sm" />
                  <Skeleton className="h-3 w-6" />
                </div>
                {/* Personalization */}
                <div className="w-[25%] flex items-center gap-2 pr-6">
                  <Skeleton className="h-[5px] flex-1 rounded-sm" />
                  <Skeleton className="h-3 w-6" />
                </div>
                {/* Price/mo */}
                <div className="w-[10%]">
                  <Skeleton className="h-3 w-8" />
                </div>
                {/* Threat Level Badge */}
                <div className="w-[10%]">
                  <Skeleton className="h-5 w-14 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ── User Stories Skeleton ────────────────────────────────────────────────────
export function UserStoriesSkeleton() {
  return (
    <Card>
      <CardContent className="pt-5 pb-5">
        <div className="font-display text-[13px] font-semibold text-fo-sub uppercase tracking-[0.8px] mb-4 flex items-center gap-2">
          <FileText size={14} />
          User Stories
          <Skeleton className="h-3.5 w-14 ml-auto" />
        </div>

        <div className="flex flex-col gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 px-3.5 rounded-lg bg-[rgba(255,255,255,.025)] border border-[rgba(255,255,255,.05)]"
            >
              {/* Priority dot indicator */}
              <div className="w-[7px] h-[7px] rounded-full bg-fo-muted/40 flex-shrink-0 mt-1.5" />

              <div className="flex-1 space-y-2">
                <Skeleton className="h-2.5 w-12" />
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3 w-5/6" />
                <Skeleton className="h-2.5 w-24" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ── Product Roadmap Skeleton ──────────────────────────────────────────────────
export function ProductRoadmapSkeleton() {
  return (
    <Card>
      <CardContent className="pt-5 pb-5">
        <div className="font-display text-[13px] font-semibold text-fo-sub uppercase tracking-[0.8px] mb-4 flex items-center gap-2">
          <Map size={14} />
          Product Roadmap
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-[10px] p-3.5 border border-[rgba(255,255,255,.05)] bg-[rgba(255,255,255,.01)] space-y-3"
            >
              <Skeleton className="h-2.5 w-16" />
              <Skeleton className="h-3.5 w-24" />
              <div className="space-y-2 pt-1">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="flex items-center gap-1.5">
                    <span className="text-[10px] text-fo-muted">—</span>
                    <Skeleton className="h-2.5 flex-1" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ── Database Schema Skeleton ─────────────────────────────────────────────────
export function SchemaGridSkeleton() {
  return (
    <Card className="mb-7">
      <CardContent className="pt-5 pb-5">
        <div className="font-display text-[13px] font-semibold text-fo-sub uppercase tracking-[0.8px] mb-4 flex items-center gap-2">
          <Database size={14} />
          Database Schema
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-lg overflow-hidden border border-[rgba(255,255,255,.08)]"
            >
              {/* Table header */}
              <div className="bg-[rgba(255,255,255,.03)] px-3 py-2 flex items-center gap-1.5">
                <Database size={10} className="text-fo-muted" />
                <Skeleton className="h-3 w-16" />
              </div>
              {/* Columns list */}
              <div className="divide-y divide-[rgba(255,255,255,.04)]">
                {[1, 2, 3, 4, 5].map((j) => (
                  <div
                    key={j}
                    className="flex items-center gap-2 px-3 py-1.5 font-mono text-[11px]"
                  >
                    <div className="w-4 flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-fo-muted/30" />
                    </div>
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-12 ml-auto" />
                    <Skeleton className="h-4 w-6 rounded" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ── GitHub Issues Skeleton ───────────────────────────────────────────────────
export function GithubIssuesSkeleton() {
  return (
    <Card>
      <CardContent className="pt-5 pb-5">
        <div className="font-display text-[13px] font-semibold text-fo-sub uppercase tracking-[0.8px] mb-4 flex items-center gap-2">
          <GitBranch size={14} />
          GitHub Issues
          <span className="font-mono text-[11px] text-fo-muted font-normal ml-auto">Sprint 1</span>
        </div>

        <div className="flex flex-col gap-1.5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-2.5 px-3.5 rounded-lg bg-[rgba(255,255,255,.025)] border border-[rgba(255,255,255,.05)]"
            >
              {/* Issue number */}
              <Skeleton className="h-3.5 w-7 font-mono" />
              {/* Open indicator */}
              <div className="w-3.5 h-3.5 rounded-full border-2 border-fo-muted/30 flex-shrink-0" />
              {/* Title & labels */}
              <div className="flex-1 space-y-2 min-w-0">
                <Skeleton className="h-3 w-5/6" />
                <div className="flex gap-1.5">
                  <Skeleton className="h-4 w-10 rounded-full" />
                  <Skeleton className="h-4 w-8 rounded-full" />
                </div>
              </div>
              {/* Story points */}
              <Skeleton className="h-3 w-8 font-mono" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ── Sprint Board Skeleton ────────────────────────────────────────────────────
export function SprintBoardSkeleton() {
  return (
    <Card>
      <CardContent className="pt-5 pb-5">
        <div className="font-display text-[13px] font-semibold text-fo-sub uppercase tracking-[0.8px] mb-4 flex items-center gap-2">
          <Rocket size={14} />
          Sprint 1 — 2 Weeks
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {["To Do", "In Progress", "Done"].map((label, i) => (
            <div key={label}>
              {/* Column header */}
              <div className="text-[11px] font-semibold uppercase tracking-[0.8px] pb-2.5 mb-2 border-b border-border flex items-center justify-between text-fo-muted">
                {label}
                <Skeleton className="h-3 w-4" />
              </div>
              {/* Cards */}
              <div className="space-y-1.5">
                {[1, 2].map((j) => (
                  <div
                    key={j}
                    className="p-2.5 rounded-lg bg-[rgba(255,255,255,.025)] border border-[rgba(255,255,255,.05)] space-y-2"
                  >
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-2 w-12" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ── Marketing Assets Skeleton ────────────────────────────────────────────────
export function MarketingAssetsSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-10">
      {/* Landing Page Copy Card */}
      <Card>
        <CardContent className="pt-5 pb-5">
          <div className="font-display text-[13px] font-semibold text-fo-sub uppercase tracking-[0.8px] mb-4 flex items-center gap-2">
            <Globe size={14} />
            Landing Page Copy
          </div>

          {/* Hero block */}
          <div className="p-4 rounded-lg bg-[rgba(255,255,255,.025)] border border-[rgba(255,255,255,.05)] mb-2.5 space-y-2.5">
            <Skeleton className="h-2.5 w-24" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
            <div className="space-y-1.5 pt-1">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-11/12" />
            </div>
            <Skeleton className="h-7 w-20 rounded mt-1.5" />
          </div>

          {/* Social proof */}
          <div className="p-3 px-3.5 rounded-lg bg-[rgba(255,255,255,.025)] border border-[rgba(255,255,255,.05)] space-y-2">
            <Skeleton className="h-2.5 w-28" />
            <Skeleton className="h-3.5 w-full" />
          </div>
        </CardContent>
      </Card>

      {/* LinkedIn Post Card */}
      <Card>
        <CardContent className="pt-5 pb-5">
          <div className="font-display text-[13px] font-semibold text-fo-sub uppercase tracking-[0.8px] mb-4 flex items-center gap-2">
            <Briefcase size={14} />
            LinkedIn Post Draft
          </div>

          <div className="p-3.5 rounded-lg bg-[rgba(255,255,255,.025)] border border-[rgba(255,255,255,.05)] space-y-3">
            <Skeleton className="h-3.5 w-5/6" />
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-4/5" />
            <Skeleton className="h-3.5 w-2/3" />
            <Skeleton className="h-3.5 w-1/3" />
            <Skeleton className="h-2.5 w-32" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
