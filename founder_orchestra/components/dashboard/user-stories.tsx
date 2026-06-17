/**
 * =============================================================================
 * COMPONENT — User Stories
 * =============================================================================
 *
 * List of user stories with priority dots, story IDs, and epic labels.
 *
 * Owner: Frontend Lead (Team Member A)
 * =============================================================================
 */

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserStory } from "@/lib/types";

interface UserStoriesProps {
  stories?: UserStory[];
}

const DEFAULT_STORIES: UserStory[] = [
  { id: "US-001", text: "As a busy professional, I want a 10-min adaptive workout so I can train without scheduling conflicts.", epic: "Core Workout Engine", priority: "high" },
  { id: "US-002", text: "As a user, I want the AI coach to adjust intensity based on my wearable data so recovery is optimized.", epic: "AI Personalization", priority: "high" },
  { id: "US-003", text: "As a user, I want daily check-ins via WhatsApp so I stay accountable without opening the app.", epic: "Engagement", priority: "medium" },
  { id: "US-004", text: "As a premium user, I want progress reports emailed weekly so I can share with my doctor.", epic: "Reporting", priority: "medium" },
  { id: "US-005", text: "As a new user, I want an onboarding quiz to calibrate my fitness level and goals.", epic: "Onboarding", priority: "low" },
];

const PRIORITY_COLORS = {
  high: "bg-fo-rose",
  medium: "bg-fo-amber",
  low: "bg-fo-emerald",
};

export function UserStories({ stories = DEFAULT_STORIES }: UserStoriesProps) {
  return (
    <Card>
      <CardContent className="pt-5 pb-5">
        <div className="font-display text-[13px] font-semibold text-fo-sub uppercase tracking-[0.8px] mb-4 flex items-center gap-2">
          <FileText size={14} />
          User Stories
          <span className="font-mono text-[11px] text-fo-muted font-normal ml-auto">{stories.length} total</span>
        </div>

        <div className="flex flex-col gap-2">
          {stories.map((story) => (
            <div
              key={story.id}
              className="flex items-start gap-3 p-3 px-3.5 rounded-lg bg-[rgba(255,255,255,.025)] border border-[rgba(255,255,255,.05)]"
            >
              {/* Priority dot */}
              <div className={cn("w-[7px] h-[7px] rounded-full flex-shrink-0 mt-1", PRIORITY_COLORS[story.priority])} />

              <div>
                <div className="font-mono text-[10px] text-fo-indigo font-semibold">{story.id}</div>
                <div className="text-[13px] leading-snug mt-0.5">{story.text}</div>
                <div className="text-[10px] text-fo-sub mt-1">Epic: {story.epic}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
