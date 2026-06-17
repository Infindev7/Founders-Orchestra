/**
 * =============================================================================
 * COMPONENT — Dashboard Charts
 * =============================================================================
 *
 * Reusable chart components built with Recharts.
 * These render the data that AI agents return in their OutputSections.
 *
 * AVAILABLE CHARTS:
 * - DashboardBarChart    → Horizontal/vertical bars
 * - DashboardPieChart    → Pie/donut charts
 * - DashboardAreaChart   → Area/line charts
 * - DashboardRadarChart  → Radar/spider charts
 * - ChartRenderer        → Auto-picks the right chart based on type
 *
 * USAGE:
 *   <ChartRenderer
 *     type="bar"
 *     data={[{ name: "Q1", value: 100 }, { name: "Q2", value: 200 }]}
 *     title="Revenue Growth"
 *   />
 *
 * TODO (Team Member A):
 * - Add tooltips with more detail
 * - Add responsive sizing
 * - Add animation on mount
 * - Add dark mode color adjustments
 *
 * Owner: Frontend Lead (Team Member A)
 * =============================================================================
 */

"use client";

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { ChartDataPoint, ChartType } from "@/lib/types";

// ── Color palette for charts ────────────────────────────────────────────────
// These colors work well in both light and dark mode.
// TODO (Team Member A): Adjust for your brand colors
const CHART_COLORS = [
  "#6366f1", // Indigo
  "#8b5cf6", // Violet
  "#ec4899", // Pink
  "#f59e0b", // Amber
  "#10b981", // Emerald
  "#3b82f6", // Blue
  "#f97316", // Orange
  "#06b6d4", // Cyan
];

interface ChartProps {
  data: ChartDataPoint[];
  title?: string;
  height?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// CHART RENDERER — Picks the right chart automatically
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Use this component when you don't know which chart type to render.
 * Just pass the `type` from the agent's OutputSection and it picks
 * the right visualization.
 */
export function ChartRenderer({
  type,
  data,
  title,
  height = 300,
}: ChartProps & { type: ChartType }) {
  if (!data || data.length === 0) return null;

  switch (type) {
    case "bar":
      return <DashboardBarChart data={data} title={title} height={height} />;
    case "pie":
    case "funnel":
      return <DashboardPieChart data={data} title={title} height={height} />;
    case "area":
    case "line":
      return <DashboardAreaChart data={data} title={title} height={height} />;
    case "radar":
      return <DashboardRadarChart data={data} title={title} height={height} />;
    default:
      return <DashboardBarChart data={data} title={title} height={height} />;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// BAR CHART
// ─────────────────────────────────────────────────────────────────────────────

export function DashboardBarChart({ data, title, height = 300 }: ChartProps) {
  return (
    <div>
      {title && (
        <p className="text-sm font-medium text-muted-foreground mb-2">
          {title}
        </p>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12 }}
            className="text-muted-foreground"
          />
          <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={CHART_COLORS[index % CHART_COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PIE CHART
// ─────────────────────────────────────────────────────────────────────────────

export function DashboardPieChart({ data, title, height = 300 }: ChartProps) {
  return (
    <div>
      {title && (
        <p className="text-sm font-medium text-muted-foreground mb-2">
          {title}
        </p>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
            label={({ name, value }) => `${name}: ${value}`}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={CHART_COLORS[index % CHART_COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AREA CHART
// ─────────────────────────────────────────────────────────────────────────────

export function DashboardAreaChart({ data, title, height = 300 }: ChartProps) {
  return (
    <div>
      {title && (
        <p className="text-sm font-medium text-muted-foreground mb-2">
          {title}
        </p>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12 }}
            className="text-muted-foreground"
          />
          <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={CHART_COLORS[0]}
            fill={`${CHART_COLORS[0]}33`}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RADAR CHART
// ─────────────────────────────────────────────────────────────────────────────

export function DashboardRadarChart({ data, title, height = 300 }: ChartProps) {
  return (
    <div>
      {title && (
        <p className="text-sm font-medium text-muted-foreground mb-2">
          {title}
        </p>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid className="opacity-30" />
          <PolarAngleAxis dataKey="name" tick={{ fontSize: 11 }} />
          <PolarRadiusAxis tick={{ fontSize: 10 }} />
          <Radar
            dataKey="value"
            stroke={CHART_COLORS[0]}
            fill={`${CHART_COLORS[0]}44`}
            fillOpacity={0.6}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
