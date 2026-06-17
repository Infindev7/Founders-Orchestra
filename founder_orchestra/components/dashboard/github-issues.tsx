/**
 * =============================================================================
 * COMPONENT — GitHub Issues
 * =============================================================================
 *
 * Issue list with labels, story points, and open status indicators.
 *
 * Owner: Frontend Lead (Team Member A)
 * =============================================================================
 */

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GitBranch } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GithubIssue, IssueLabel } from "@/lib/types";

interface GithubIssuesProps {
  issues?: GithubIssue[];
}

const DEFAULT_ISSUES: GithubIssue[] = [
  { number: "#001", title: "Implement JWT auth with refresh token rotation", labels: [{ text: "auth", variant: "auth" }, { text: "P1", variant: "p1" }], storyPoints: 5 },
  { number: "#002", title: "Build AI workout generation API endpoint", labels: [{ text: "ai", variant: "ai" }, { text: "feature", variant: "feat" }, { text: "P1", variant: "p1" }], storyPoints: 8 },
  { number: "#003", title: "Design onboarding quiz UI + data model", labels: [{ text: "ui", variant: "ui" }, { text: "P2", variant: "p2" }], storyPoints: 3 },
  { number: "#004", title: "Set up PostgreSQL + Prisma schema migrations", labels: [{ text: "infra", variant: "infra" }, { text: "P1", variant: "p1" }], storyPoints: 3 },
  { number: "#005", title: "Integrate Stripe subscriptions + webhook handler", labels: [{ text: "feature", variant: "feat" }, { text: "P2", variant: "p2" }], storyPoints: 5 },
  { number: "#006", title: "Create progress tracking dashboard (mobile)", labels: [{ text: "ui", variant: "ui" }, { text: "P3", variant: "p3" }], storyPoints: 5 },
];

const LABEL_STYLES: Record<string, string> = {
  feat: "bg-[rgba(99,102,241,.15)] text-fo-indigo",
  auth: "bg-[rgba(245,158,11,.12)] text-fo-amber",
  infra: "bg-[rgba(56,189,248,.12)] text-fo-sky",
  ui: "bg-[rgba(167,139,250,.15)] text-[#A78BFA]",
  ai: "bg-[rgba(244,63,94,.12)] text-fo-rose",
  p1: "bg-[rgba(244,63,94,.15)] text-fo-rose",
  p2: "bg-[rgba(245,158,11,.12)] text-fo-amber",
  p3: "bg-[rgba(16,185,129,.1)] text-fo-emerald",
};

export function GithubIssues({ issues = DEFAULT_ISSUES }: GithubIssuesProps) {
  return (
    <Card>
      <CardContent className="pt-5 pb-5">
        <div className="font-display text-[13px] font-semibold text-fo-sub uppercase tracking-[0.8px] mb-4 flex items-center gap-2">
          <GitBranch size={14} />
          GitHub Issues
          <span className="font-mono text-[11px] text-fo-muted font-normal ml-auto">Sprint 1</span>
        </div>

        <div className="flex flex-col gap-1.5">
          {issues.map((issue) => (
            <div
              key={issue.number}
              className="flex items-center gap-3 p-2.5 px-3.5 rounded-lg bg-[rgba(255,255,255,.025)] border border-[rgba(255,255,255,.05)] hover:border-[rgba(99,102,241,.3)] transition-colors"
            >
              {/* Issue number */}
              <span className="font-mono text-[11px] text-fo-muted w-9 flex-shrink-0">
                {issue.number}
              </span>
              {/* Open indicator */}
              <div className="w-3.5 h-3.5 rounded-full border-2 border-fo-emerald flex-shrink-0" />
              {/* Title & labels */}
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-medium">{issue.title}</div>
                <div className="flex gap-1.5 mt-1 flex-wrap">
                  {issue.labels.map((label) => (
                    <Badge
                      key={label.text}
                      className={cn("text-[10px] font-semibold px-[7px] py-0 h-4 border-0 rounded-full", LABEL_STYLES[label.variant])}
                    >
                      {label.text}
                    </Badge>
                  ))}
                </div>
              </div>
              {/* Story points */}
              <span className="font-mono text-[11px] text-fo-muted flex-shrink-0">{issue.storyPoints} sp</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
