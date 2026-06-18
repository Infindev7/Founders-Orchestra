/**
 * =============================================================================
 * COMPONENT — Competitor Table
 * =============================================================================
 *
 * Competitive landscape table with score bars and threat level pills.
 * Uses shadcn Table + Badge components.
 *
 * Owner: Frontend Lead (Team Member A)
 * =============================================================================
 */

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { CompetitorEntry } from "@/lib/types";
import { motion } from "framer-motion";

interface CompetitorTableProps {
  competitors?: CompetitorEntry[];
}

const DEFAULT_COMPETITORS: CompetitorEntry[] = [
  { name: "Whoop", tag: "Recovery-focused wearable + app", aiCoachingScore: 55, personalizationScore: 70, pricePerMonth: "$30", threatLevel: "high" },
  { name: "Freeletics", tag: "Bodyweight AI training", aiCoachingScore: 80, personalizationScore: 65, pricePerMonth: "$14", threatLevel: "high" },
  { name: "Future", tag: "Human coach matching via app", aiCoachingScore: 40, personalizationScore: 90, pricePerMonth: "$199", threatLevel: "medium" },
  { name: "Nike Training Club", tag: "Free app, brand-heavy", aiCoachingScore: 30, personalizationScore: 35, pricePerMonth: "$0", threatLevel: "low" },
  { name: "Peloton", tag: "Hardware + content ecosystem", aiCoachingScore: 45, personalizationScore: 50, pricePerMonth: "$44", threatLevel: "low" },
];

const THREAT_STYLES = {
  high: "bg-[rgba(244,63,94,.15)] text-fo-rose border-0",
  medium: "bg-[rgba(245,158,11,.15)] text-fo-amber border-0",
  low: "bg-[rgba(16,185,129,.15)] text-fo-emerald border-0",
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const rowVariants = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 22,
    },
  },
};

const MotionTableBody = motion.create(TableBody);
const MotionTableRow = motion.create(TableRow);

export function CompetitorTable({ competitors = DEFAULT_COMPETITORS }: CompetitorTableProps) {
  return (
    <Card className="mb-7">
      <CardContent className="pt-5">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-[11px] font-semibold text-fo-muted uppercase tracking-[0.6px]">Company</TableHead>
              <TableHead className="text-[11px] font-semibold text-fo-muted uppercase tracking-[0.6px]">AI Coaching</TableHead>
              <TableHead className="text-[11px] font-semibold text-fo-muted uppercase tracking-[0.6px]">Personalization</TableHead>
              <TableHead className="text-[11px] font-semibold text-fo-muted uppercase tracking-[0.6px]">Price/mo</TableHead>
              <TableHead className="text-[11px] font-semibold text-fo-muted uppercase tracking-[0.6px]">Threat Level</TableHead>
            </TableRow>
          </TableHeader>
          <MotionTableBody variants={containerVariants} initial="hidden" animate="show">
            {competitors.map((comp) => (
              <MotionTableRow
                key={comp.name}
                variants={rowVariants}
                className="border-[rgba(255,255,255,.04)] hover:bg-[rgba(255,255,255,.02)]"
              >
                <TableCell>
                  <span className="font-semibold text-[13px]">{comp.name}</span>
                  <span className="block text-[11px] text-fo-sub">{comp.tag}</span>
                </TableCell>
                <TableCell>
                  <ScoreBar score={comp.aiCoachingScore} />
                </TableCell>
                <TableCell>
                  <ScoreBar score={comp.personalizationScore} />
                </TableCell>
                <TableCell>
                  <span className="font-mono text-xs">{comp.pricePerMonth}</span>
                </TableCell>
                <TableCell>
                  <Badge className={cn("text-[10px] font-bold capitalize", THREAT_STYLES[comp.threatLevel])}>
                    {comp.threatLevel}
                  </Badge>
                </TableCell>
              </MotionTableRow>
            ))}
          </MotionTableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function ScoreBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-[5px] bg-[rgba(255,255,255,.06)] rounded-sm overflow-hidden">
        <motion.div
          className="h-full rounded-sm bg-fo-indigo"
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      <span className="font-mono text-xs text-fo-sub w-6">{score}</span>
    </div>
  );
}
