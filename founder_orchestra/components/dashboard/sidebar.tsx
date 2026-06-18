/**
 * =============================================================================
 * COMPONENT — Dashboard Sidebar
 * =============================================================================
 *
 * Fixed 240px sidebar with logo, navigation sections, and agent status dots.
 * Navigation items scroll to their respective dashboard sections.
 *
 * Owner: Frontend Lead (Team Member A)
 * =============================================================================
 */

"use client";

import { cn } from "@/lib/utils";
import { useProjectStore, getAgentStatus } from "@/lib/store/project-store";
import { ALL_AGENT_IDS } from "@/lib/agents/config";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  LayoutDashboard,
  BarChart3,
  Flag,
  TrendingUp,
  FileText,
  Map,
  Building2,
  GitBranch,
  Rocket,
  Megaphone,
} from "lucide-react";

// ── Navigation structure ────────────────────────────────────────────────────
const NAV_SECTIONS = [
  {
    label: "Overview",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", sectionId: "orbit" },
    ],
  },
  {
    label: "Research",
    items: [
      { icon: BarChart3, label: "Market Analysis", sectionId: "market" },
      { icon: Flag, label: "Competitors", sectionId: "competitors" },
      { icon: TrendingUp, label: "Trends", sectionId: "market" },
    ],
  },
  {
    label: "Product",
    items: [
      { icon: FileText, label: "PRD", sectionId: "product" },
      { icon: Map, label: "Roadmap", sectionId: "product" },
      { icon: Building2, label: "Architecture", sectionId: "architecture" },
    ],
  },
  {
    label: "Execution",
    items: [
      { icon: GitBranch, label: "GitHub Issues", sectionId: "engineering" },
      { icon: Rocket, label: "Sprint Plan", sectionId: "engineering" },
      { icon: Megaphone, label: "Marketing", sectionId: "marketing" },
    ],
  },
];

// ── Status dot colors ───────────────────────────────────────────────────────
const STATUS_COLORS: Record<string, string> = {
  idle: "bg-fo-muted",
  running: "bg-fo-amber fo-pulse",
  completed: "bg-fo-emerald",
  error: "bg-fo-rose",
};

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export function Sidebar({ open = false, onClose }: SidebarProps) {
  const agents = useProjectStore((s) => s.agents);
  const activeSection = useProjectStore((s) => s.activeSection);
  const setActiveSection = useProjectStore((s) => s.setActiveSection);

  const handleNavClick = (sectionId: string) => {
    setActiveSection(sectionId);
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Desktop Sidebar (visible on md+) */}
      <aside className="w-[240px] min-h-screen bg-fo-surface border-r border-border md:flex hidden flex-col py-6 fixed top-0 left-0 bottom-0 z-50">
        <SidebarContent
          agents={agents}
          activeSection={activeSection}
          onNavClick={handleNavClick}
        />
      </aside>

      {/* Mobile Sidebar (slide-over sheet on md-) */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black z-40 md:hidden block"
            />
            {/* Slide-over panel */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="w-[240px] min-h-screen bg-fo-surface border-r border-border flex flex-col py-6 fixed top-0 left-0 bottom-0 z-50 md:hidden"
            >
              <SidebarContent
                agents={agents}
                activeSection={activeSection}
                onNavClick={(secId) => {
                  handleNavClick(secId);
                  onClose?.();
                }}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// INTERNAL — Sidebar Content Layout
// ─────────────────────────────────────────────────────────────────────────────

import type { AgentId, AgentOutput } from "@/lib/types";

interface SidebarContentProps {
  agents: Partial<Record<AgentId, AgentOutput>>;
  activeSection: string;
  onNavClick: (sectionId: string) => void;
}

function SidebarContent({ agents, activeSection, onNavClick }: SidebarContentProps) {
  return (
    <>
      {/* ── Logo ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2.5 px-5 pb-7 border-b border-border">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-fo-indigo to-purple-500 flex items-center justify-center">
          <Zap size={16} className="text-white" />
        </div>
        <span className="font-display text-lg font-bold tracking-tight">
          Founder<span className="text-fo-indigo">OS</span>
        </span>
      </div>

      {/* ── Nav Sections ─────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} className="px-3 pt-5 pb-2">
            <div className="text-[10px] font-semibold tracking-[1.2px] text-fo-muted uppercase px-2 mb-1.5">
              {section.label}
            </div>
            {section.items.map((item) => {
              const isActive = activeSection === item.sectionId;
              return (
                <button
                  key={item.label}
                  onClick={() => onNavClick(item.sectionId)}
                  className={cn(
                    "flex items-center gap-2.5 w-full rounded-lg px-2.5 py-2 text-[13.5px] font-medium transition-colors mb-0.5",
                    isActive
                      ? "bg-[rgba(99,102,241,.15)] text-fo-indigo"
                      : "text-fo-sub hover:bg-fo-surface2 hover:text-fo-text"
                  )}
                >
                  <item.icon size={18} />
                  {item.label}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* ── Bottom: Agent Status Dots ─────────────────────────────────────── */}
      <div className="mt-auto px-5 pt-4 border-t border-border">
        <div className="text-xs text-fo-sub mb-2.5">Agent activity</div>
        <div className="flex gap-1.5 flex-wrap">
          {ALL_AGENT_IDS.map((agentId) => {
            const status = getAgentStatus(agents, agentId);
            return (
              <div
                key={agentId}
                className={cn("w-2 h-2 rounded-full", STATUS_COLORS[status])}
                title={agentId}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
