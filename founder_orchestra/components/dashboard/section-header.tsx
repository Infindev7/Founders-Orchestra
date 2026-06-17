/**
 * =============================================================================
 * COMPONENT — Section Header
 * =============================================================================
 *
 * Reusable section header used throughout the dashboard.
 * Shows a colored dot, title, and optional action button.
 *
 * USAGE:
 *   <SectionHeader color="sky" title="Market Intelligence" action="View full report →" />
 *
 * Owner: Frontend Lead (Team Member A)
 * =============================================================================
 */

"use client";

import { Button } from "@/components/ui/button";

interface SectionHeaderProps {
  title: string;
  color: string;            // CSS color value (e.g. "var(--color-fo-sky)")
  action?: string;          // Optional action button text
  onAction?: () => void;
  badge?: string;           // Optional badge text (e.g. "⚡ Generating…")
  badgeColor?: string;      // Badge text color
  suffix?: string;          // Optional suffix text (e.g. "(queued)")
}

export function SectionHeader({
  title,
  color,
  action,
  onAction,
  badge,
  badgeColor,
  suffix,
}: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-3.5">
      <div className="flex items-center gap-2">
        {/* Colored dot */}
        <div
          className="w-2 h-2 rounded-full"
          style={{ background: color }}
        />
        {/* Title */}
        <h2 className="font-display text-[15px] font-semibold">
          {title}
          {suffix && (
            <span className="text-fo-muted font-normal font-sans ml-2">
              {suffix}
            </span>
          )}
        </h2>
        {/* Optional badge */}
        {badge && (
          <span
            className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border"
            style={{
              color: badgeColor,
              background: `${badgeColor}15`,
              borderColor: `${badgeColor}30`,
            }}
          >
            {badge}
          </span>
        )}
      </div>
      {/* Optional action button */}
      {action && (
        <Button
          variant="link"
          className="text-xs text-fo-indigo font-medium p-0 h-auto"
          onClick={onAction}
        >
          {action}
        </Button>
      )}
    </div>
  );
}
