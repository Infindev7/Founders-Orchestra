/**
 * =============================================================================
 * COMPONENT — Product Roadmap
 * =============================================================================
 *
 * 3-phase product roadmap with colored cards (Q1/Q2/Q3).
 *
 * Owner: Frontend Lead (Team Member A)
 * =============================================================================
 */

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Map } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RoadmapPhase } from "@/lib/types";
import { motion } from "framer-motion";

interface ProductRoadmapProps {
  phases?: RoadmapPhase[];
}

const DEFAULT_PHASES: RoadmapPhase[] = [
  { label: "Q1 — MVP", title: "Foundation", quarter: "q1", items: ["User auth + onboarding", "AI workout generator", "Basic progress tracking", "iOS app launch"] },
  { label: "Q2 — Growth", title: "Intelligence", quarter: "q2", items: ["Wearable integrations", "Adaptive AI coach", "Social / accountability", "Android launch"] },
  { label: "Q3 — Scale", title: "Monetization", quarter: "q3", items: ["Premium tier ($19/mo)", "B2B / enterprise", "Nutrition module", "Coach marketplace"] },
];

const QUARTER_STYLES = {
  q1: { bg: "bg-[rgba(99,102,241,.07)]", border: "border-[rgba(99,102,241,.25)]", label: "text-fo-indigo" },
  q2: { bg: "bg-[rgba(56,189,248,.07)]", border: "border-[rgba(56,189,248,.25)]", label: "text-fo-sky" },
  q3: { bg: "bg-[rgba(16,185,129,.07)]", border: "border-[rgba(16,185,129,.25)]", label: "text-fo-emerald" },
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const columnVariants = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 160,
      damping: 18,
    },
  },
} as const;

export function ProductRoadmap({ phases = DEFAULT_PHASES }: ProductRoadmapProps) {
  return (
    <Card>
      <CardContent className="pt-5 pb-5">
        <div className="font-display text-[13px] font-semibold text-fo-sub uppercase tracking-[0.8px] mb-4 flex items-center gap-2">
          <Map size={14} />
          Product Roadmap
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-3"
        >
          {phases.map((phase, idx) => {
            const style = QUARTER_STYLES[phase.quarter] || QUARTER_STYLES.q3;
            return (
              <motion.div
                key={`${phase.label}-${idx}`}
                variants={columnVariants}
                whileHover={{ y: -3, scale: 1.015 }}
                transition={{ y: { duration: 0.15 }, scale: { duration: 0.15 } }}
                className={cn(
                  "rounded-[10px] p-3.5 border cursor-default",
                  style.bg,
                  style.border
                )}
              >
                <div className={cn("font-mono text-[10px] font-semibold uppercase tracking-[1px] mb-2", style.label)}>
                  {phase.label}
                </div>
                <div className="font-display text-sm font-semibold mb-2">{phase.title}</div>
                <ul className="space-y-1">
                  {phase.items.map((item) => (
                    <li key={item} className="text-xs text-fo-sub flex items-center gap-1.5">
                      <span className="text-[10px] text-fo-muted">—</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </motion.div>
      </CardContent>
    </Card>
  );
}
