/**
 * =============================================================================
 * COMPONENT — Progress Ring
 * =============================================================================
 *
 * A circular progress indicator (SVG-based).
 * Used to show overall orchestration progress on the dashboard.
 *
 * USAGE:
 *   <ProgressRing progress={75} />        // 75% complete
 *   <ProgressRing progress={100} size={80} />  // Full, larger size
 *
 * Owner: Frontend Lead (Team Member A)
 * =============================================================================
 */

"use client";

import { cn } from "@/lib/utils";

interface ProgressRingProps {
  /** Progress percentage (0-100) */
  progress: number;
  /** Diameter in pixels */
  size?: number;
  /** Stroke width in pixels */
  strokeWidth?: number;
  className?: string;
}

export function ProgressRing({
  progress,
  size = 48,
  strokeWidth = 4,
  className,
}: ProgressRingProps) {
  // ── SVG math ──────────────────────────────────────────────────────────
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  // ── Color based on progress ───────────────────────────────────────────
  const getColor = () => {
    if (progress >= 100) return "text-emerald-500";
    if (progress >= 50) return "text-blue-500";
    if (progress > 0) return "text-amber-500";
    return "text-muted-foreground/30";
  };

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/50"
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={cn("transition-all duration-500 ease-out", getColor())}
        />
      </svg>
      {/* Percentage text in the center */}
      <span className="absolute text-xs font-semibold">
        {Math.round(progress)}%
      </span>
    </div>
  );
}
