"use client"

import { AlertTriangle } from "lucide-react"
import type { ThreatAssessment } from "@/lib/types"
import { threatTone } from "@/lib/status"
import { cn } from "@/lib/utils"
import { Panel, StatusBadge } from "./panel"

export function RiskSummary({ assessment }: { assessment: ThreatAssessment }) {
  const tone = threatTone[assessment.level]
  const warn = assessment.level !== "SAFE"

  return (
    <Panel eyebrow="Section 07" title="Call Risk Summary" contentClassName="flex flex-col gap-4">
      <div className="flex items-end justify-between gap-4">
        <div className="flex flex-col">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Risk Score</span>
          <div className="flex items-baseline gap-1">
            <span className={cn("font-mono text-5xl font-semibold tabular-nums leading-none", tone.text)}>
              {assessment.riskScore}
            </span>
            <span className="font-mono text-lg text-muted-foreground">/ 100</span>
          </div>
        </div>
        <StatusBadge tone={cn(tone.border, tone.bg, tone.text)} className="px-2 py-1 text-xs">
          {assessment.level}
        </StatusBadge>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full transition-[width,background-color] duration-700"
          style={{ width: `${assessment.riskScore}%`, backgroundColor: tone.var }}
        />
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
        <Row label="Classification" value={assessment.level} tone={tone.text} />
        <Row label="Synthetic Probability" value={`${assessment.syntheticProbability.toFixed(1)}%`} />
        <Row label="Evidence Reliability" value={`${assessment.evidenceReliability.toFixed(1)}%`} />
        <Row label="Confidence" value={`${assessment.confidence.toFixed(1)}%`} />
      </dl>

      <div className="flex flex-col gap-1 rounded-md border border-border bg-secondary/40 p-3">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Recommended Action
        </span>
        <p className="text-sm font-medium">{assessment.recommendedAction}</p>
      </div>

      {warn && (
        <div
          role="alert"
          className={cn("flex items-start gap-3 rounded-md border p-3", tone.border, tone.bg)}
        >
          <AlertTriangle className={cn("mt-0.5 size-4 shrink-0", tone.text)} aria-hidden />
          <p className="text-pretty text-xs leading-relaxed">
            <span className={cn("font-semibold", tone.text)}>Warning: </span>
            This call may contain a synthetic or cloned voice. Do not share passwords, one-time codes, or
            financial details. Verify the caller through a known, trusted channel.
          </p>
        </div>
      )}
    </Panel>
  )
}

function Row({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-[11px] text-muted-foreground">{label}</dt>
      <dd className={cn("font-mono font-semibold tabular-nums", tone)}>{value}</dd>
    </div>
  )
}
