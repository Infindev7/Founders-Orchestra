/**
 * =============================================================================
 * COMPONENT — Market Sizing Card
 * =============================================================================
 *
 * TAM/SAM/SOM horizontal bar chart with AI Insight box.
 *
 * Owner: Frontend Lead (Team Member A)
 * =============================================================================
 */

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import type { MarketSizingEntry } from "@/lib/types";

interface MarketSizingProps {
  entries?: MarketSizingEntry[];
  insight?: string;
}

const DEFAULT_ENTRIES: MarketSizingEntry[] = [
  { label: "TAM — Total Addressable Market", value: "$42B", barPercent: 100, barColor: "#6366F1" },
  { label: "SAM — Serviceable Addressable", value: "$9.8B", barPercent: 24, barColor: "#38BDF8" },
  { label: "SOM — Serviceable Obtainable", value: "$490M", barPercent: 6, barColor: "#10B981" },
];

const DEFAULT_INSIGHT =
  'Busy professionals (25–45, $80K+) represent an underserved segment. Niche positioning in "micro-workout" category shows 3× lower CAC than broad fitness apps.';

export function MarketSizing({ entries = DEFAULT_ENTRIES, insight = DEFAULT_INSIGHT }: MarketSizingProps) {
  return (
    <Card>
      <CardContent className="pt-5 pb-5">
        <div className="font-display text-[13px] font-semibold text-fo-sub uppercase tracking-[0.8px] mb-4 flex items-center gap-2">
          <BarChart3 size={14} />
          Market Sizing
        </div>

        {/* TAM/SAM/SOM bars */}
        <div className="flex flex-col gap-3">
          {entries.map((entry, i) => (
            <div key={entry.label} className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-fo-sub">{entry.label}</span>
                <span className="font-mono font-medium text-fo-text">{entry.value}</span>
              </div>
              <div className="h-[7px] bg-[rgba(255,255,255,.06)] rounded overflow-hidden">
                <div
                  className="h-full rounded fo-fill-anim"
                  style={{
                    width: `${entry.barPercent}%`,
                    background: entry.barColor,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* AI Insight box */}
        {insight && (
          <div className="mt-3 p-2.5 rounded-lg bg-[rgba(16,185,129,.07)] border border-[rgba(16,185,129,.15)]">
            <div className="text-[11px] font-bold text-fo-emerald mb-1">AI INSIGHT</div>
            <div className="text-[12.5px] text-fo-sub leading-relaxed">{insight}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
