/**
 * =============================================================================
 * COMPONENT — Idea Form
 * =============================================================================
 *
 * The form where founders enter their startup idea.
 * Collects: startup name, idea description, and optional fields.
 * On submit, either triggers the orchestration or navigates to dashboard.
 *
 * Owner: Frontend Lead (Team Member A)
 * =============================================================================
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProjectStore } from "@/lib/store/project-store";
import { MOCK_INPUT, MOCK_AGENT_OUTPUTS } from "@/lib/mock-data";
import { Rocket, Sparkles, Loader2 } from "lucide-react";
import type { StartupInput } from "@/lib/types";

export function IdeaForm() {
  const router = useRouter();
  const setInput = useProjectStore((s) => s.setInput);
  const updateAgent = useProjectStore((s) => s.updateAgent);
  const setOverallStatus = useProjectStore((s) => s.setOverallStatus);
  const setProjectId = useProjectStore((s) => s.setProjectId);
  const reset = useProjectStore((s) => s.reset);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOptional, setShowOptional] = useState(false);
  const [formData, setFormData] = useState<StartupInput>({
    startupName: "",
    idea: "",
    industry: "",
    targetAudience: "",
    budget: "",
    additionalContext: "",
  });

  // ── Handle form field changes ───────────────────────────────────────────
  const handleChange = (
    field: keyof StartupInput,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // ── Handle form submission ──────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.startupName.trim() || !formData.idea.trim()) return;

    setIsSubmitting(true);

    // Reset previous project state
    reset();

    // Save input to store
    setInput(formData);
    setOverallStatus("in-progress");

    try {
      // ── Call the orchestration API ──────────────────────────────────
      const response = await fetch("/api/orchestrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: formData }),
      });

      if (!response.ok) throw new Error("Orchestration failed");

      // ── Read the SSE stream ─────────────────────────────────────────
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      // Navigate to dashboard immediately
      router.push("/dashboard");

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const text = decoder.decode(value);
          // Parse SSE events (format: "data: {json}\n\n")
          const events = text
            .split("\n\n")
            .filter((line) => line.startsWith("data: "))
            .map((line) => {
              try {
                return JSON.parse(line.slice(6));
              } catch {
                return null;
              }
            })
            .filter(Boolean);

          for (const event of events) {
            if (event.type === "project-created") {
              setProjectId(event.projectId);
            }
            if (event.type === "agent-complete" && event.output) {
              updateAgent(event.agentId, event.output);
            }
            if (event.type === "orchestration-complete") {
              setOverallStatus(event.overallStatus || "completed");
            }
          }
        }
      }
    } catch (error) {
      console.error("Orchestration error:", error);
      setOverallStatus("partial");
      // Still navigate to dashboard to show any partial results
      router.push("/dashboard");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Load mock data (for development without API key) ────────────────────
  const handleLoadMock = () => {
    reset();
    setInput(MOCK_INPUT);
    // Load all mock agent outputs
    for (const [agentId, output] of Object.entries(MOCK_AGENT_OUTPUTS)) {
      updateAgent(agentId as keyof typeof MOCK_AGENT_OUTPUTS, output);
    }
    setOverallStatus("completed");
    setProjectId("mock-project-001");
    router.push("/dashboard");
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border-border/50 shadow-2xl">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl">Describe Your Startup</CardTitle>
        <p className="text-sm text-muted-foreground">
          Enter your idea and let our AI agents do the heavy lifting
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ── Startup Name ──────────────────────────────────────────── */}
          <div>
            <label
              htmlFor="startupName"
              className="block text-sm font-medium mb-1.5"
            >
              Startup Name *
            </label>
            <Input
              id="startupName"
              placeholder="e.g., FitCoach AI"
              value={formData.startupName}
              onChange={(e) => handleChange("startupName", e.target.value)}
              required
            />
          </div>

          {/* ── Idea Description ──────────────────────────────────────── */}
          <div>
            <label htmlFor="idea" className="block text-sm font-medium mb-1.5">
              Describe Your Idea *
            </label>
            <Textarea
              id="idea"
              placeholder="e.g., An AI-powered fitness coaching app that creates personalized workout plans..."
              value={formData.idea}
              onChange={(e) => handleChange("idea", e.target.value)}
              rows={4}
              required
            />
          </div>

          {/* ── Optional Fields Toggle ────────────────────────────────── */}
          <button
            type="button"
            onClick={() => setShowOptional(!showOptional)}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {showOptional ? "▾ Hide" : "▸ Show"} optional fields
          </button>

          {showOptional && (
            <div className="space-y-4 pl-4 border-l-2 border-border">
              <div>
                <label htmlFor="industry" className="block text-sm font-medium mb-1.5">
                  Industry / Sector
                </label>
                <Input
                  id="industry"
                  placeholder="e.g., Health & Fitness Technology"
                  value={formData.industry}
                  onChange={(e) => handleChange("industry", e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="targetAudience" className="block text-sm font-medium mb-1.5">
                  Target Audience
                </label>
                <Input
                  id="targetAudience"
                  placeholder="e.g., Health-conscious millennials aged 22-38"
                  value={formData.targetAudience}
                  onChange={(e) => handleChange("targetAudience", e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="budget" className="block text-sm font-medium mb-1.5">
                  Estimated Budget
                </label>
                <Input
                  id="budget"
                  placeholder="e.g., $50,000 - $100,000"
                  value={formData.budget}
                  onChange={(e) => handleChange("budget", e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="additionalContext" className="block text-sm font-medium mb-1.5">
                  Additional Context
                </label>
                <Textarea
                  id="additionalContext"
                  placeholder="Any other information that might help the analysis..."
                  value={formData.additionalContext}
                  onChange={(e) => handleChange("additionalContext", e.target.value)}
                  rows={2}
                />
              </div>
            </div>
          )}

          {/* ── Submit Button ─────────────────────────────────────────── */}
          <div className="flex flex-col gap-3 pt-4">
            <Button
              type="submit"
              size="lg"
              disabled={
                isSubmitting ||
                !formData.startupName.trim() ||
                !formData.idea.trim()
              }
              className="w-full"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" data-icon="inline-start" />
                  Launching Agents...
                </>
              ) : (
                <>
                  <Rocket size={18} data-icon="inline-start" />
                  Launch Orchestration
                </>
              )}
            </Button>

            {/* Mock data button (development only) */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleLoadMock}
              className="text-muted-foreground"
            >
              <Sparkles size={14} data-icon="inline-start" />
              Load demo data (no API key needed)
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
