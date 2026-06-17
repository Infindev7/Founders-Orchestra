/**
 * =============================================================================
 * COMPONENT — Trend List
 * =============================================================================
 *
 * Vertical list of emerging market trends with sparkline bars.
 *
 * Owner: Frontend Lead (Team Member A)
 * =============================================================================
 */

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TrendItem } from "@/lib/types";

interface TrendListProps {
  trends?: TrendItem[];
}

const DEFAULT_TRENDS: TrendItem[] = [
  { rank: "01", name: "AI Personalization in Health", subtitle: "Real-time adaptive workout plans", sparkData: [40, 55, 50, 75, 90, 100], sparkColor: "#6366F1", momentum: "+187%", direction: "up" },
  { rank: "02", name: "Wearable Integration", subtitle: "Apple Watch, Whoop, Oura Ring sync", sparkData: [50, 60, 65, 70, 80, 85], sparkColor: "#38BDF8", momentum: "+134%", direction: "up" },
  { rank: "03", name: "Micro-workout Content", subtitle: "<15 min sessions for time-poor users", sparkData: [30, 45, 70, 75, 90, 95], sparkColor: "#10B981", momentum: "+211%", direction: "up" },
  { rank: "04", name: "Subscription Fatigue", subtitle: "Users consolidating fitness apps", sparkData: [80, 70, 60, 55, 45, 40], sparkColor: "#F43F5E", momentum: "−28%", direction: "down" },
];

export function TrendList({ trends = DEFAULT_TRENDS }: TrendListProps) {
  return (
    <Card>
      <CardContent className="pt-5 pb-5">
        <div className="font-display text-[13px] font-semibold text-fo-sub uppercase tracking-[0.8px] mb-4 flex items-center gap-2">
          <TrendingUp size={14} />
          Emerging Trends
        </div>

        <div className="flex flex-col gap-2.5">
          {trends.map((trend) => (
            <div
              key={trend.rank}
              className="flex items-center gap-3 p-2.5 px-3 rounded-lg bg-[rgba(255,255,255,.025)] border border-[rgba(255,255,255,.05)]"
            >
              {/* Rank */}
              <span className="font-mono text-[11px] text-fo-muted w-[18px]">
                {trend.rank}
              </span>

              {/* Body */}
              <div className="flex-1">
                <div className="text-[13px] font-medium">{trend.name}</div>
                <div className="text-[11px] text-fo-sub mt-0.5">{trend.subtitle}</div>
              </div>

              {/* Sparkline */}
              <div className="flex items-end gap-[2px] h-6">
                {trend.sparkData.map((h, i) => (
                  <div
                    key={i}
                    className="w-1 rounded-t-sm"
                    style={{
                      height: `${h}%`,
                      background:
                        i === trend.sparkData.length - 1
                          ? trend.sparkColor
                          : "#6366F1",
                      opacity: i === trend.sparkData.length - 1 ? 1 : 0.5,
                    }}
                  />
                ))}
              </div>

              {/* Momentum */}
              <span
                className={cn(
                  "font-mono text-xs font-semibold",
                  trend.direction === "up" ? "text-fo-emerald" : "text-fo-rose"
                )}
                style={trend.direction === "up" && trend.sparkColor !== "#10B981" ? { color: trend.sparkColor } : undefined}
              >
                {trend.momentum}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
