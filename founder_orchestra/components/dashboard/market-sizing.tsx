/**
 * =============================================================================
 * COMPONENT — Market Sizing Card (Recharts)
 * =============================================================================
 *
 * TAM/SAM/SOM horizontal bar chart implemented with Recharts and Custom Tooltips.
 *
 * Owner: Frontend Lead (Team Member A)
 * =============================================================================
 */

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
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

// Custom tooltip component matching the dark theme
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#0D121F] border border-border px-3 py-2 rounded-lg shadow-xl text-xs">
        <div className="font-semibold text-fo-text mb-1 font-display">{data.fullName}</div>
        <div className="text-fo-sub">
          Value: <span className="font-mono text-fo-text font-bold">{data.valueStr}</span>
        </div>
      </div>
    );
  }
  return null;
};

export function MarketSizing({ entries = DEFAULT_ENTRIES, insight = DEFAULT_INSIGHT }: MarketSizingProps) {
  // Map entries into the format expected by Recharts
  const chartData = entries.map((entry) => {
    const shortName = entry.label.split(" — ")[0]; // e.g. "TAM"
    return {
      name: shortName,
      fullName: entry.label,
      barPercent: entry.barPercent,
      valueStr: entry.value,
      color: entry.barColor,
    };
  });

  return (
    <Card>
      <CardContent className="pt-5 pb-5 flex flex-col justify-between h-full">
        <div>
          <div className="font-display text-[13px] font-semibold text-fo-sub uppercase tracking-[0.8px] mb-4 flex items-center gap-2">
            <BarChart3 size={14} />
            Market Sizing
          </div>

          {/* Recharts Horizontal Bar Chart */}
          <div className="h-[130px] w-full -ml-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 5, right: 15, left: -10, bottom: 5 }}
              >
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748B", fontSize: 11, fontWeight: 500 }}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "rgba(255, 255, 255, 0.02)" }}
                />
                <Bar dataKey="barPercent" radius={[0, 4, 4, 0]} barSize={10}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insight box */}
        {insight && (
          <div className="mt-3 p-2.5 rounded-lg bg-[rgba(16,185,129,0.07)] border border-[rgba(16,185,129,0.15)]">
            <div className="text-[11px] font-bold text-fo-emerald mb-1">AI INSIGHT</div>
            <div className="text-[12.5px] text-fo-sub leading-relaxed">{insight}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
