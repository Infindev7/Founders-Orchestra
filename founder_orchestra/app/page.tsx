/**
 * =============================================================================
 * PAGE — Landing Page
 * =============================================================================
 *
 * The entry point where founders enter their startup idea.
 * Styled to match the FounderOS dark theme.
 *
 * Owner: Frontend Lead (Team Member A)
 * =============================================================================
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useProjectStore } from "@/lib/store/project-store";
import { Zap, ArrowRight, Sparkles, BarChart3, ClipboardList, Building2, Rocket, Megaphone } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const setInput = useProjectStore((s) => s.setInput);
  const loadMockData = useProjectStore((s) => s.loadMockData);

  const [form, setForm] = useState({
    startupName: "",
    idea: "",
    industry: "",
    targetAudience: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.idea.trim() || submitting) return;

    setSubmitting(true);
    const startupInput = {
      startupName: form.startupName || "My Startup",
      idea: form.idea,
      industry: form.industry || undefined,
      targetAudience: form.targetAudience || undefined,
    };

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: startupInput }),
      });

      if (!response.ok) {
        throw new Error("Failed to save project to database");
      }

      const project = await response.json();
      useProjectStore.getState().loadProject(project);
      router.push("/dashboard");
    } catch (error) {
      console.warn("Failed to save project to database, using client-only fallback:", error);
      setInput(startupInput);
      router.push("/dashboard");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemo = () => {
    loadMockData();
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-fo-bg flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        {/* ── Logo ───────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <img src="/favicon.png" alt="FounderOS Logo" className="w-10 h-10 object-contain" />
          <h1 className="font-display text-3xl font-bold tracking-tight">
            Founder<span className="text-fo-indigo">OS</span>
          </h1>
        </div>

        {/* ── Tagline ────────────────────────────────────────────────────── */}
        <p className="text-center text-fo-sub text-lg mb-10 max-w-md mx-auto leading-relaxed">
          Enter your startup idea. Six AI agents will validate, research, plan, architect, and market it for you.
        </p>

        {/* ── Form Card ──────────────────────────────────────────────────── */}
        <Card className="bg-fo-surface border-border">
          <CardHeader>
            <CardTitle className="font-display text-xl">Launch your idea</CardTitle>
            <CardDescription className="text-fo-sub">
              Tell us about your startup and we&apos;ll run the full intelligence pipeline.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-fo-muted font-medium uppercase tracking-[0.8px] mb-1.5 block">
                    Startup Name
                  </label>
                  <Input
                    placeholder="e.g. FitCoach AI"
                    value={form.startupName}
                    onChange={(e) => setForm({ ...form, startupName: e.target.value })}
                    className="bg-fo-surface2 border-border text-fo-text placeholder:text-fo-muted"
                  />
                </div>
                <div>
                  <label className="text-xs text-fo-muted font-medium uppercase tracking-[0.8px] mb-1.5 block">
                    Industry
                  </label>
                  <Input
                    placeholder="e.g. Health & Fitness"
                    value={form.industry}
                    onChange={(e) => setForm({ ...form, industry: e.target.value })}
                    className="bg-fo-surface2 border-border text-fo-text placeholder:text-fo-muted"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-fo-muted font-medium uppercase tracking-[0.8px] mb-1.5 block">
                  Your Idea *
                </label>
                <Textarea
                  placeholder="Describe your startup idea in a few sentences..."
                  rows={3}
                  value={form.idea}
                  onChange={(e) => setForm({ ...form, idea: e.target.value })}
                  className="bg-fo-surface2 border-border text-fo-text placeholder:text-fo-muted resize-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-fo-muted font-medium uppercase tracking-[0.8px] mb-1.5 block">
                  Target Audience
                </label>
                <Input
                  placeholder="e.g. Busy professionals aged 25-45"
                  value={form.targetAudience}
                  onChange={(e) => setForm({ ...form, targetAudience: e.target.value })}
                  className="bg-fo-surface2 border-border text-fo-text placeholder:text-fo-muted"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  className="flex-1 bg-fo-indigo text-white hover:opacity-85 gap-2 font-semibold"
                  disabled={!form.idea.trim() || submitting}
                >
                  <Sparkles size={16} />
                  {submitting ? "Initializing Pipeline..." : "Run AI Pipeline"}
                  <ArrowRight size={16} />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="border-border text-fo-sub hover:text-fo-text hover:border-fo-indigo"
                  onClick={handleDemo}
                >
                  Load Demo
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="border-border text-fo-sub hover:text-fo-text hover:border-fo-indigo"
                  onClick={() => router.push("/dashboard")}
                >
                  Go to Dashboard
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* ── Agent Icons ────────────────────────────────────────────────── */}
        <div className="flex justify-center gap-6 mt-10">
          {[
            { icon: Sparkles, label: "Advisor" },
            { icon: BarChart3, label: "Research" },
            { icon: ClipboardList, label: "Product" },
            { icon: Building2, label: "Architect" },
            { icon: Rocket, label: "Engineering" },
            { icon: Megaphone, label: "Marketing" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-1.5">
              <div className="w-10 h-10 rounded-lg bg-fo-surface border border-border flex items-center justify-center">
                <Icon size={18} className="text-fo-sub" />
              </div>
              <span className="text-[10px] text-fo-muted font-medium uppercase tracking-wider">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
