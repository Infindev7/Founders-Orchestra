/**
 * =============================================================================
 * COMPONENT — Stats Row
 * =============================================================================
 *
 * 4-column grid of key metric stat cards.
 * Each card has an eyebrow label, large value, subtitle, and delta indicator.
 *
 * Owner: Frontend Lead (Team Member A)
 * =============================================================================
 */

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useProjectStore, getAgentStatus } from "@/lib/store/project-store";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";

interface StatCardData {
  eyebrow: string;
  value: string;
  subtitle: string;
  delta: string;
  color: string;          // CSS variable name
  accentClass: string;    // Tailwind text color for the value
  isLoading: boolean;
}

export function StatsRow() {
  const agents = useProjectStore((s) => s.agents);

  // ── Extract metrics from agent outputs ──────────────────────────────────
  const tam = (agents["market-research"]?.metadata?.tam as string) ?? "$42B";
  const competitors = (agents["market-research"]?.metadata?.competitorCount as string) ?? "7";
  const pmfScore = (agents["startup-advisor"]?.metadata?.viabilityScore as string) ?? "82";
  const artifacts = (agents["engineering-manager"]?.metadata?.totalIssues as string) ?? "23";

  // ── Compute loading flags based on agent status ─────────────────────────
  const marketStatus = getAgentStatus(agents, "market-research");
  const advisorStatus = getAgentStatus(agents, "startup-advisor");
  const engStatus = getAgentStatus(agents, "engineering-manager");

  const isMarketLoading = marketStatus === "running" || marketStatus === "idle";
  const isAdvisorLoading = advisorStatus === "running" || advisorStatus === "idle";
  const isEngLoading = engStatus === "running" || engStatus === "idle";

  const stats: StatCardData[] = [
    {
      eyebrow: "Total Addressable Market",
      value: tam,
      subtitle: "Global fitness app market by 2028",
      delta: "↑ 23% CAGR projected",
      color: "#6366F1",
      accentClass: "text-fo-indigo",
      isLoading: isMarketLoading,
    },
    {
      eyebrow: "Competitors Mapped",
      value: competitors,
      subtitle: "Direct + indirect competitors",
      delta: "↑ 2 gaps identified",
      color: "#10B981",
      accentClass: "text-fo-emerald",
      isLoading: isMarketLoading,
    },
    {
      eyebrow: "PMF Score",
      value: pmfScore,
      subtitle: "Based on demand & competition signals",
      delta: "↑ Strong signal",
      color: "#F59E0B",
      accentClass: "text-fo-amber",
      isLoading: isAdvisorLoading,
    },
    {
      eyebrow: "Artifacts Generated",
      value: artifacts,
      subtitle: "Docs, schemas, issues, copy blocks",
      delta: "↑ 14 more in progress",
      color: "#38BDF8",
      accentClass: "text-fo-sky",
      isLoading: isEngLoading,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-7">
      {stats.map((stat) => (
        <motion.div
          key={stat.eyebrow}
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="w-full rounded-xl overflow-hidden"
        >
          <Card className="relative overflow-hidden h-full">
            {/* Bottom colored accent line */}
            <div
              className="absolute bottom-0 left-0 right-0 h-[2px]"
              style={{ background: stat.color }}
            />
            <CardContent className="pt-4.5 pb-5 px-5">
              <div className="text-[11px] font-semibold text-fo-muted uppercase tracking-[0.8px] mb-2">
                {stat.eyebrow}
              </div>
              <div className="relative min-h-[72px]">
                <AnimatePresence mode="wait">
                  {stat.isLoading ? (
                    <motion.div
                      key="skeleton"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="space-y-3 pt-1"
                    >
                      <Skeleton className="h-[30px] w-20" />
                      <Skeleton className="h-3 w-36" />
                      <Skeleton className="h-3.5 w-24" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="content"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                    >
                      <div className={`font-display text-[30px] font-bold leading-none ${stat.accentClass}`}>
                        {stat.value}
                        {stat.eyebrow === "PMF Score" && (
                          <span className="text-lg">/100</span>
                        )}
                      </div>
                      <div className="text-xs text-fo-sub mt-1.5">{stat.subtitle}</div>
                      <div className="text-[11px] font-semibold text-fo-emerald flex items-center gap-1 mt-1">
                        {stat.delta}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
