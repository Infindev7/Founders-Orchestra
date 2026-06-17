/**
 * =============================================================================
 * COMPONENT — Marketing Assets
 * =============================================================================
 *
 * Landing page copy and LinkedIn post draft side by side.
 *
 * Owner: Frontend Lead (Team Member A)
 * =============================================================================
 */

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, Briefcase } from "lucide-react";

export function MarketingAssets() {
  return (
    <div className="grid grid-cols-2 gap-5 mb-10">
      {/* ── Landing Page Copy ─────────────────────────────────────────────── */}
      <Card>
        <CardContent className="pt-5 pb-5">
          <div className="font-display text-[13px] font-semibold text-fo-sub uppercase tracking-[0.8px] mb-4 flex items-center gap-2">
            <Globe size={14} />
            Landing Page Copy
          </div>

          {/* Hero block */}
          <div className="p-4 rounded-lg bg-[rgba(255,255,255,.025)] border border-[rgba(255,255,255,.05)] mb-2.5">
            <div className="text-[10px] font-bold uppercase tracking-[0.8px] text-fo-indigo mb-2">
              Hero — Above the Fold
            </div>
            <div className="font-display text-[17px] font-bold leading-snug mb-1.5">
              Your AI fitness coach that works as hard as you do — in 10 minutes a day.
            </div>
            <div className="text-[13px] text-fo-sub leading-relaxed">
              No gym. No schedules. Just a coach that adapts to your body, your calendar, and your goals. Built for people who don&apos;t have time to not be fit.
            </div>
            <Button size="sm" className="mt-2.5 bg-fo-indigo text-white text-xs font-semibold hover:opacity-85">
              Start free →
            </Button>
          </div>

          {/* Social proof */}
          <div className="p-3 px-3.5 rounded-lg bg-[rgba(255,255,255,.025)] border border-[rgba(255,255,255,.05)]">
            <div className="text-[10px] font-bold uppercase tracking-[0.8px] text-fo-sub mb-1.5">
              Social Proof Hook
            </div>
            <div className="text-[13px] text-fo-sub leading-relaxed italic">
              &ldquo;I&apos;ve tried 12 fitness apps. This is the only one that felt like it actually knew me.&rdquo; — Sarah K., Product Manager
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── LinkedIn Post ─────────────────────────────────────────────────── */}
      <Card>
        <CardContent className="pt-5 pb-5">
          <div className="font-display text-[13px] font-semibold text-fo-sub uppercase tracking-[0.8px] mb-4 flex items-center gap-2">
            <Briefcase size={14} />
            LinkedIn Post Draft
          </div>

          <div className="p-3.5 rounded-lg bg-[rgba(255,255,255,.025)] border border-[rgba(255,255,255,.05)] text-[13.5px] leading-relaxed text-fo-sub space-y-2">
            <p className="text-fo-text font-semibold">
              We just shipped something I&apos;ve been dreaming about for 2 years.
            </p>
            <p>
              An AI fitness coach that understands you&apos;re a busy professional — not a gym rat.
            </p>
            <p>
              No 60-minute workouts. No cookie-cutter plans. Just 10 minutes, adapted in real-time to your body and schedule.
            </p>
            <p>
              We&apos;re launching to a waitlist of 1,200 people next month. Spots are limited.
            </p>
            <p className="text-fo-indigo font-semibold">
              → Link in bio to join the waitlist
            </p>
            <p className="text-xs text-fo-muted">
              #FitnessAI #ProductLaunch #StartupLife #HealthTech
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
