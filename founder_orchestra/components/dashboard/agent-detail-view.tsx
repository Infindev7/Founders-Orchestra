/**
 * =============================================================================
 * COMPONENT — Agent Detail View
 * =============================================================================
 *
 * Full-page detail view for a specific agent's output.
 * Displayed when a user clicks on an agent card in the sidebar or overview.
 *
 * RENDERS:
 * - Agent header (name, status, timing)
 * - Summary text
 * - All OutputSections with:
 *   - Markdown content
 *   - Charts (if data is provided)
 *   - Tables (if tableData is provided)
 *
 * Owner: Frontend Lead (Team Member A)
 * =============================================================================
 */

"use client";

import { useProjectStore } from "@/lib/store/project-store";
import { AGENT_CONFIGS } from "@/lib/agents/config";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChartRenderer } from "@/components/dashboard/charts";
import { ArrowLeft, Clock } from "lucide-react";
import type { AgentId, OutputSection } from "@/lib/types";

interface AgentDetailViewProps {
  agentId: AgentId;
}

export function AgentDetailView({ agentId }: AgentDetailViewProps) {
  const output = useProjectStore((s) => s.agents[agentId]);
  const selectAgent = useProjectStore((s) => s.selectAgent);
  const config = AGENT_CONFIGS[agentId];

  // ── Handle case where agent hasn't run yet ──────────────────────────────
  if (!output || output.status === "idle") {
    return (
      <div className="space-y-4">
        <BackButton onClick={() => selectAgent(null)} />
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <p className="text-muted-foreground">
            {config.name} hasn&apos;t run yet.
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Launch the orchestration to see results here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Back button ──────────────────────────────────────────────────── */}
      <BackButton onClick={() => selectAgent(null)} />

      {/* ── Agent Header ─────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{output.title}</h1>
          <p className="text-muted-foreground mt-1">{output.summary}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant={
              output.status === "completed"
                ? "default"
                : output.status === "error"
                ? "destructive"
                : "secondary"
            }
          >
            {output.status}
          </Badge>
          {output.startedAt && output.completedAt && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock size={12} />
              {calculateDuration(output.startedAt, output.completedAt)}
            </span>
          )}
        </div>
      </div>

      {/* ── Output Sections ──────────────────────────────────────────────── */}
      {output.sections.map((section, index) => (
        <SectionCard key={index} section={section} />
      ))}

      {/* ── Error Display ────────────────────────────────────────────────── */}
      {output.error && (
        <Card className="border-red-500/30 bg-red-500/5">
          <CardContent className="pt-6">
            <p className="text-sm text-red-500">{output.error}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// INTERNAL — Section Card
// ─────────────────────────────────────────────────────────────────────────────

function SectionCard({ section }: { section: OutputSection }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{section.heading}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* ── Markdown Content ─────────────────────────────────────────── */}
        {section.content && (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <MarkdownContent content={section.content} />
          </div>
        )}

        {/* ── Chart ────────────────────────────────────────────────────── */}
        {section.data && section.chartType && (
          <div className="mt-4 p-4 rounded-lg bg-muted/50">
            <ChartRenderer
              type={section.chartType}
              data={section.data}
              height={250}
            />
          </div>
        )}

        {/* ── Table ────────────────────────────────────────────────────── */}
        {section.tableData && (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border">
                  {section.tableData.headers.map((header, i) => (
                    <th
                      key={i}
                      className="text-left py-2 px-3 font-medium text-muted-foreground"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {section.tableData.rows.map((row, i) => (
                  <tr key={i} className="border-b border-border/50">
                    {row.map((cell, j) => (
                      <td key={j} className="py-2 px-3">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// INTERNAL — Simple Markdown Renderer
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Basic markdown renderer (no external library needed).
 * Handles: headers, bold, lists, code blocks.
 *
 * TODO (Team Member A):
 * - Replace with a proper markdown library (react-markdown) for production
 * - Add syntax highlighting for code blocks
 */
function MarkdownContent({ content }: { content: string }) {
  // Split by line and process basic markdown
  const lines = content.split("\n");

  return (
    <div className="space-y-2">
      {lines.map((line, i) => {
        // Headers
        if (line.startsWith("### "))
          return (
            <h4 key={i} className="font-semibold text-sm mt-4 mb-1">
              {line.slice(4)}
            </h4>
          );
        if (line.startsWith("## "))
          return (
            <h3 key={i} className="font-semibold text-base mt-4 mb-1">
              {line.slice(3)}
            </h3>
          );

        // List items
        if (line.startsWith("- ") || line.startsWith("* "))
          return (
            <li key={i} className="ml-4 list-disc text-sm">
              <InlineFormat text={line.slice(2)} />
            </li>
          );

        // Numbered list
        if (/^\d+\.\s/.test(line))
          return (
            <li key={i} className="ml-4 list-decimal text-sm">
              <InlineFormat text={line.replace(/^\d+\.\s/, "")} />
            </li>
          );

        // Empty line
        if (line.trim() === "") return <br key={i} />;

        // Regular paragraph
        return (
          <p key={i} className="text-sm">
            <InlineFormat text={line} />
          </p>
        );
      })}
    </div>
  );
}

/** Process inline markdown (bold, code) */
function InlineFormat({ text }: { text: string }) {
  // Replace **bold** with <strong>
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);

  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**"))
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        if (part.startsWith("`") && part.endsWith("`"))
          return (
            <code key={i} className="bg-muted px-1 py-0.5 rounded text-xs">
              {part.slice(1, -1)}
            </code>
          );
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// INTERNAL — Helpers
// ─────────────────────────────────────────────────────────────────────────────

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <Button variant="ghost" size="sm" onClick={onClick}>
      <ArrowLeft size={16} data-icon="inline-start" />
      Back to Overview
    </Button>
  );
}

function calculateDuration(start: string, end: string): string {
  const ms = new Date(end).getTime() - new Date(start).getTime();
  const seconds = Math.round(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
}
