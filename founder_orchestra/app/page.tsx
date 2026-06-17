/**
 * =============================================================================
 * PAGE — Landing Page (/)
 * =============================================================================
 *
 * The first page users see. Contains:
 * - Hero section with animated background
 * - Tagline and description
 * - The startup idea input form
 * - Visual indicators of the 6 AI agents
 *
 * Owner: Frontend Lead (Team Member A)
 * =============================================================================
 */

import { IdeaForm } from "@/components/landing/idea-form";
import {
  Lightbulb,
  TrendingUp,
  ClipboardList,
  Megaphone,
  Blocks,
  GitBranch,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Hero Section ─────────────────────────────────────────────────── */}
      <section className="relative flex-1 flex flex-col items-center justify-center px-4 py-16 overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-background to-purple-500/10 dark:from-indigo-500/5 dark:to-purple-500/5" />
        {/* Animated grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center mb-12">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            AI-Powered Startup Analysis
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            Your AI{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
              Founding Team
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Enter your startup idea and let 6 specialized AI agents validate,
            research, plan, architect, and market it for you — all in minutes.
          </p>

          {/* Agent icons row */}
          <div className="flex items-center justify-center gap-6 mb-12">
            <AgentIcon icon={<Lightbulb size={20} />} label="Advisor" color="text-amber-500" />
            <AgentIcon icon={<TrendingUp size={20} />} label="Research" color="text-blue-500" />
            <AgentIcon icon={<ClipboardList size={20} />} label="Product" color="text-purple-500" />
            <AgentIcon icon={<Megaphone size={20} />} label="Marketing" color="text-pink-500" />
            <AgentIcon icon={<Blocks size={20} />} label="Architect" color="text-emerald-500" />
            <AgentIcon icon={<GitBranch size={20} />} label="Engineer" color="text-orange-500" />
          </div>
        </div>

        {/* The startup idea form */}
        <div className="relative z-10 w-full">
          <IdeaForm />
        </div>
      </section>
    </div>
  );
}

// ── Agent Icon Component ────────────────────────────────────────────────────
function AgentIcon({
  icon,
  label,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  color: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className={`p-2.5 rounded-xl bg-card border border-border shadow-sm ${color}`}
      >
        {icon}
      </div>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}
