/**
 * =============================================================================
 * COMPONENT — Marketing Assets
 * =============================================================================
 *
 * Landing page copy and LinkedIn post draft side by side.
 * Supports custom props for dynamic rendering of agent outputs.
 *
 * Owner: Frontend Lead (Team Member A)
 * =============================================================================
 */

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, Briefcase } from "lucide-react";

interface MarketingAssetsProps {
  headline?: string;
  subheadline?: string;
  cta?: string;
  socialProof?: string;
  linkedinPost?: string;
}

const DEFAULT_HEADLINE = "Your AI fitness coach that works as hard as you do — in 10 minutes a day.";
const DEFAULT_SUBHEADLINE = "No gym. No schedules. Just a coach that adapts to your body, your calendar, and your goals. Built for people who don't have time to not be fit.";
const DEFAULT_CTA = "Start free →";
const DEFAULT_SOCIAL_PROOF = "“I've tried 12 fitness apps. This is the only one that felt like it actually knew me.” — Sarah K., Product Manager";
const DEFAULT_LINKEDIN = `We just shipped something I've been dreaming about for 2 years.

An AI fitness coach that understands you're a busy professional — not a gym rat.

No 60-minute workouts. No cookie-cutter plans. Just 10 minutes, adapted in real-time to your body and schedule.

We're launching to a waitlist of 1,200 people next month. Spots are limited.

→ Link in bio to join the waitlist

#FitnessAI #ProductLaunch #StartupLife #HealthTech`;

export function MarketingAssets({
  headline = DEFAULT_HEADLINE,
  subheadline = DEFAULT_SUBHEADLINE,
  cta = DEFAULT_CTA,
  socialProof = DEFAULT_SOCIAL_PROOF,
  linkedinPost = DEFAULT_LINKEDIN,
}: MarketingAssetsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-10">
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
              {headline}
            </div>
            <div className="text-[13px] text-fo-sub leading-relaxed">
              {subheadline}
            </div>
            <Button size="sm" className="mt-2.5 bg-fo-indigo text-white text-xs font-semibold hover:opacity-85">
              {cta}
            </Button>
          </div>

          {/* Social proof */}
          <div className="p-3 px-3.5 rounded-lg bg-[rgba(255,255,255,.025)] border border-[rgba(255,255,255,.05)]">
            <div className="text-[10px] font-bold uppercase tracking-[0.8px] text-fo-sub mb-1.5">
              Social Proof Hook
            </div>
            <div className="text-[13px] text-fo-sub leading-relaxed italic">
              {socialProof}
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

          <div className="p-3.5 rounded-lg bg-[rgba(255,255,255,.025)] border border-[rgba(255,255,255,.05)] text-[13.5px] leading-relaxed text-fo-sub white-space-pre-line">
            {linkedinPost.split("\n\n").map((para, i) => {
              const isHighlight = para.trim().startsWith("→");
              const isHashtags = para.trim().startsWith("#");
              if (isHighlight) {
                return (
                  <p key={i} className="text-fo-indigo font-semibold">
                    {para}
                  </p>
                );
              }
              if (isHashtags) {
                return (
                  <p key={i} className="text-xs text-fo-muted">
                    {para}
                  </p>
                );
              }
              // First paragraph is usually headline highlight
              if (i === 0) {
                return (
                  <p key={i} className="text-fo-text font-semibold">
                    {para}
                  </p>
                );
              }
              return <p key={i}>{para}</p>;
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
