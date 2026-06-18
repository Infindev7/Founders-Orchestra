/**
 * =============================================================================
 * COMPONENT — Schema Grid
 * =============================================================================
 *
 * 2×2 grid of database schema tables for the Architecture section.
 *
 * Owner: Frontend Lead (Team Member A)
 * =============================================================================
 */

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, Key, Link } from "lucide-react";
import type { SchemaTable } from "@/lib/types";

interface SchemaGridProps {
  tables?: SchemaTable[];
}

const DEFAULT_TABLES: SchemaTable[] = [
  { name: "users", columns: [
    { name: "id", type: "uuid", isKey: true, badge: "PK" },
    { name: "email", type: "varchar(255)", isKey: false },
    { name: "name", type: "varchar(100)", isKey: false },
    { name: "fitness_level", type: "enum", isKey: false },
    { name: "goals", type: "jsonb", isKey: false },
    { name: "created_at", type: "timestamp", isKey: false },
  ]},
  { name: "workouts", columns: [
    { name: "id", type: "uuid", isKey: true, badge: "PK" },
    { name: "user_id", type: "uuid", isKey: true, badge: "FK" },
    { name: "plan", type: "jsonb", isKey: false },
    { name: "duration_min", type: "int", isKey: false },
    { name: "ai_model_version", type: "varchar", isKey: false },
    { name: "completed_at", type: "timestamp", isKey: false },
  ]},
  { name: "progress_logs", columns: [
    { name: "id", type: "uuid", isKey: true, badge: "PK" },
    { name: "user_id", type: "uuid", isKey: true, badge: "FK" },
    { name: "workout_id", type: "uuid", isKey: true, badge: "FK" },
    { name: "metrics", type: "jsonb", isKey: false },
    { name: "wearable_data", type: "jsonb", isKey: false },
    { name: "logged_at", type: "timestamp", isKey: false },
  ]},
  { name: "subscriptions", columns: [
    { name: "id", type: "uuid", isKey: true, badge: "PK" },
    { name: "user_id", type: "uuid", isKey: true, badge: "FK" },
    { name: "plan", type: "enum", isKey: false },
    { name: "stripe_sub_id", type: "varchar", isKey: false },
    { name: "status", type: "enum", isKey: false },
    { name: "renews_at", type: "timestamp", isKey: false },
  ]},
];

export function SchemaGrid({ tables = DEFAULT_TABLES }: SchemaGridProps) {
  return (
    <Card className="mb-7">
      <CardContent className="pt-5 pb-5">
        <div className="font-display text-[13px] font-semibold text-fo-sub uppercase tracking-[0.8px] mb-4 flex items-center gap-2">
          <Database size={14} />
          Database Schema
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {tables.map((table) => (
            <div
              key={table.name}
              className="rounded-lg overflow-hidden border border-[rgba(99,102,241,.2)]"
            >
              {/* Table header */}
              <div className="bg-[rgba(99,102,241,.15)] px-3 py-2 font-mono text-xs font-semibold text-fo-indigo flex items-center gap-1.5">
                <Database size={10} />
                {table.name}
              </div>
              {/* Columns */}
              {table.columns.map((col) => (
                <div
                  key={col.name}
                  className="flex items-center gap-2 px-3 py-1.5 border-t border-[rgba(255,255,255,.04)] font-mono text-[11px] hover:bg-[rgba(255,255,255,.03)]"
                >
                  {/* Key icon */}
                  <span className="text-fo-amber w-4 flex-shrink-0">
                    {col.badge === "PK" && <Key size={10} />}
                    {col.badge === "FK" && <Link size={10} className="text-fo-sky" />}
                  </span>
                  {/* Column name */}
                  <span className="flex-1 text-fo-text">{col.name}</span>
                  {/* Type */}
                  <span className="text-fo-muted">{col.type}</span>
                  {/* Badge */}
                  {col.badge && (
                    <Badge
                      className={`text-[9px] px-1.5 py-0 h-4 border-0 ${
                        col.badge === "PK"
                          ? "bg-[rgba(245,158,11,.15)] text-fo-amber"
                          : "bg-[rgba(56,189,248,.1)] text-fo-sky"
                      }`}
                    >
                      {col.badge}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
