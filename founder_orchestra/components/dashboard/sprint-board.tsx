/**
 * =============================================================================
 * COMPONENT — Sprint Board
 * =============================================================================
 *
 * 3-column kanban board: To Do / In Progress / Done
 *
 * Owner: Frontend Lead (Team Member A)
 * =============================================================================
 */

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Rocket } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SprintCard } from "@/lib/types";

interface SprintBoardProps {
  cards?: SprintCard[];
}

const DEFAULT_CARDS: SprintCard[] = [
  { title: "Onboarding quiz UI", points: 3, linkedId: "US-005", column: "todo" },
  { title: "Progress dashboard", points: 5, linkedId: "US-004", column: "todo" },
  { title: "Stripe webhooks", points: 5, column: "todo" },
  { title: "DB schema + migrations", points: 3, linkedId: "#004", column: "inprog" },
  { title: "AI workout API", points: 8, linkedId: "#002", column: "inprog" },
  { title: "JWT auth setup", points: 5, linkedId: "#001", column: "done" },
];

const COLUMN_CONFIG = {
  todo: { label: "To Do", className: "text-fo-muted" },
  inprog: { label: "In Progress", className: "text-fo-amber" },
  done: { label: "Done", className: "text-fo-emerald" },
};

const CARD_BORDER = {
  todo: "",
  inprog: "border-[rgba(245,158,11,.25)]",
  done: "border-[rgba(16,185,129,.2)]",
};

export function SprintBoard({ cards = DEFAULT_CARDS }: SprintBoardProps) {
  const columns = (["todo", "inprog", "done"] as const).map((col) => ({
    key: col,
    ...COLUMN_CONFIG[col],
    cards: cards.filter((c) => c.column === col),
  }));

  return (
    <Card>
      <CardContent className="pt-5 pb-5">
        <div className="font-display text-[13px] font-semibold text-fo-sub uppercase tracking-[0.8px] mb-4 flex items-center gap-2">
          <Rocket size={14} />
          Sprint 1 — 2 Weeks
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {columns.map((col) => (
            <div key={col.key}>
              {/* Column header */}
              <div className={cn(
                "text-[11px] font-semibold uppercase tracking-[0.8px] pb-2.5 mb-2 border-b border-border flex items-center justify-between",
                col.className
              )}>
                {col.label}
                <span className="font-mono text-[11px] font-medium">{col.cards.length}</span>
              </div>
              {/* Cards */}
              {col.cards.map((card) => (
                <div
                  key={card.title}
                  className={cn(
                    "p-2.5 rounded-lg bg-[rgba(255,255,255,.025)] border border-[rgba(255,255,255,.05)] mb-1.5 text-[12.5px] font-medium",
                    CARD_BORDER[card.column]
                  )}
                >
                  {card.title}
                  <div className="font-mono text-[10px] text-fo-muted mt-1">
                    {card.points} sp{card.linkedId ? ` · ${card.linkedId}` : ""}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
