/**
 * =============================================================================
 * PAGE — Project History
 * =============================================================================
 *
 * Lists past runs of the AI orchestration pipeline.
 * Clicking a project loads its state into the Zustand store and routes
 * the user to the main Intelligence Dashboard.
 *
 * Owner: Frontend Lead (Team Member A)
 * =============================================================================
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useProjectStore } from "@/lib/store/project-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { History, ArrowRight, Trash2, Calendar, FileText, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { ProjectState, OrchestrationStatus } from "@/lib/types";

const STATUS_CONFIGS: Record<OrchestrationStatus, { label: string; className: string }> = {
  completed: { label: "Complete", className: "bg-[rgba(16,185,129,.15)] text-fo-emerald border-0" },
  partial: { label: "Partial", className: "bg-[rgba(245,158,11,.15)] text-fo-amber border-0" },
  "in-progress": { label: "Running", className: "bg-[rgba(99,102,241,.15)] text-fo-indigo border-0" },
  "not-started": { label: "Queued", className: "bg-[rgba(100,116,139,.1)] text-fo-muted border-0" },
};

export default function HistoryPage() {
  const router = useRouter();
  const loadProject = useProjectStore((s) => s.loadProject);
  const currentProjectId = useProjectStore((s) => s.projectId);

  const [projects, setProjects] = useState<ProjectState[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch past runs on mount
  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch("/api/projects");
        if (!response.ok) {
          throw new Error("Failed to fetch project list");
        }
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Failed to load project history:", error);
        toast({
          variant: "destructive",
          title: "Failed to Load History",
          description: "Could not retrieve your past runs from the database.",
        });
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const handleLoadProject = async (id: string) => {
    toast({
      title: "Loading Workspace",
      description: "Fetching project data...",
    });

    try {
      const response = await fetch(`/api/projects?id=${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch project details");
      }
      const projectDetails = await response.json();
      loadProject(projectDetails);
      toast({
        title: "Workspace Loaded",
        description: `Successfully loaded ${projectDetails.input.startupName}.`,
      });
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to load project details:", error);
      toast({
        variant: "destructive",
        title: "Failed to Load Workspace",
        description: "Could not retrieve project run details.",
      });
    }
  };

  // Simulated client-side deletion to keep all changes strictly inside frontend scope
  const handleDeleteProject = (id: string, name: string) => {
    setProjects((prev) => prev.filter((p) => p._id !== id));
    toast({
      title: "Project Removed",
      description: `Removed "${name}" from your history view.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2.5 pb-4 border-b border-border">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-fo-indigo to-purple-500 flex items-center justify-center">
          <History size={16} className="text-white" />
        </div>
        <div>
          <h1 className="font-display text-xl font-bold tracking-tight">Project History</h1>
          <p className="text-xs text-fo-sub mt-0.5">View and manage your past AI orchestration runs.</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse bg-fo-surface border-border">
              <div className="h-28" />
            </Card>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <Card className="bg-fo-surface border-border text-center py-12">
          <CardContent className="space-y-4">
            <div className="w-12 h-12 rounded-full bg-[rgba(255,255,255,.03)] border border-border flex items-center justify-center mx-auto text-fo-muted">
              <History size={20} />
            </div>
            <div className="space-y-1">
              <h3 className="font-display text-base font-semibold">No past runs found</h3>
              <p className="text-xs text-fo-sub max-w-sm mx-auto">
                Submit a new startup idea from the landing page to run the agent pipeline.
              </p>
            </div>
            <Button
              size="sm"
              className="bg-fo-indigo text-white hover:opacity-85 text-xs font-semibold"
              onClick={() => router.push("/")}
            >
              Start New Run
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => {
            const statusConfig = STATUS_CONFIGS[project.overallStatus] || STATUS_CONFIGS["not-started"];
            const formattedDate = project.createdAt
              ? new Date(project.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "Unknown date";
            const isActive = currentProjectId === project._id;

            return (
              <Card
                key={project._id}
                className={`bg-fo-surface border-border hover:border-[rgba(99,102,241,.45)] transition-all ${
                  isActive ? "ring-1 ring-fo-indigo border-[rgba(99,102,241,.45)]" : ""
                }`}
              >
                <CardHeader className="pb-3 flex flex-row items-start justify-between space-y-0">
                  <div className="space-y-1 max-w-[70%]">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-sm tracking-tight truncate block">
                        {project.input.startupName}
                      </span>
                      {isActive && (
                        <Badge className="bg-[rgba(99,102,241,.15)] text-fo-indigo hover:bg-[rgba(99,102,241,.15)] border-0 text-[10px] font-semibold py-0.5 px-2">
                          Active Workspace
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="text-xs text-fo-sub line-clamp-2">
                      {project.input.idea}
                    </CardDescription>
                  </div>
                  <Badge className={`text-[10px] font-semibold ${statusConfig.className}`}>
                    {statusConfig.label}
                  </Badge>
                </CardHeader>
                <CardContent className="pt-0 pb-4 flex items-center justify-between text-xs text-fo-muted">
                  <div className="flex items-center gap-1.5 font-mono">
                    <Calendar size={13} className="text-fo-muted" />
                    <span>{formattedDate}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-fo-rose hover:bg-[rgba(244,63,94,.1)] hover:text-fo-rose rounded-lg"
                      onClick={() => project._id && handleDeleteProject(project._id, project.input.startupName)}
                    >
                      <Trash2 size={13} />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs font-semibold border-border hover:border-fo-indigo hover:text-fo-indigo rounded-lg gap-1"
                      onClick={() => project._id && handleLoadProject(project._id)}
                    >
                      Load Workspace
                      <ArrowRight size={12} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
