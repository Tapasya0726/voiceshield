"use client"

import { AlertTriangle, ShieldCheck } from "lucide-react"
import type { ThreatAssessment } from "@/lib/types"
import { threatTone } from "@/lib/status"
import { cn } from "@/lib/utils"
import { Eyebrow, Panel, StatusBadge } from "./panel"

export function RiskSummary({ assessment }: { assessment: ThreatAssessment }) {
  const tone = threatTone[assessment.level]
  const warn = assessment.level !== "SAFE"

  return (
    <Panel eyebrow="Section 07" title="Call Risk Summary" className="h-full" contentClassName="flex flex-col gap-5">
      <div className="flex items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <Eyebrow>Risk Score</Eyebrow>
          <div className="flex items-baseline gap-1.5">
            <span
              key={assessment.riskScore}
              className={cn(
                "animate-value-in font-mono text-[3.25rem] font-semibold tabular-nums leading-none tracking-tight transition-colors duration-500 sm:text-6xl",
                tone.text,
              )}
            >
              {assessment.riskScore}
            </span>
            <span className="font-mono text-base text-muted-foreground">/ 100</span>
          </div>
        </div>
        <StatusBadge tone={cn(tone.border, tone.bg, tone.text)} className="px-2 py-1 text-xs" pulse={warn}>
          {assessment.level}
        </StatusBadge>
      </div>

      {/* Segmented risk bar with threshold ticks */}
      <div className="flex flex-col gap-1.5">
        <div className="relative h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full transition-[width,background-color] duration-700"
            style={{ width: `${assessment.riskScore}%`, backgroundColor: tone.var }}
          />
          {[25, 50, 75].map((p) => (
            <span
              key={p}
              className="absolute inset-y-0 w-px bg-background/80"
              style={{ left: `${p}%` }}
              aria-hidden
            />
          ))}
        </div>
        <div className="grid grid-cols-4 font-mono text-[9px] uppercase tracking-wider text-muted-foreground/70">
          <span className="text-safe/80">Safe</span>
          <span className="text-center text-suspicious/80">Suspicious</span>
          <span className="text-center text-fake/80">Fake</span>
          <span className="text-right text-critical/80">Critical</span>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-3 border-y border-border/70 py-3 text-sm">
        <Row label="Classification" value={assessment.level} tone={tone.text} />
        <Row label="Synthetic Prob." value={`${assessment.syntheticProbability.toFixed(1)}%`} />
        <Row label="Evidence Reliability" value={`${assessment.evidenceReliability.toFixed(1)}%`} />
        <Row label="Confidence" value={`${assessment.confidence.toFixed(1)}%`} />
      </dl>

      <div className="flex flex-col gap-1 rounded-md border border-border bg-secondary/40 p-3">
        <Eyebrow>Recommended Action</Eyebrow>
        <p className="text-sm font-medium">{assessment.recommendedAction}</p>
      </div>

      {warn ? (
        <div role="alert" className={cn("flex items-start gap-3 rounded-md border p-3", tone.border, tone.bg)}>
          <AlertTriangle className={cn("mt-0.5 size-4 shrink-0", tone.text)} aria-hidden />
          <p className="text-pretty text-xs leading-relaxed">
            <span className={cn("font-semibold", tone.text)}>Warning: </span>
            This call may contain a synthetic or cloned voice. Do not share passwords, one-time codes, or financial
            details. Verify the caller through a known, trusted channel.
          </p>
        </div>
      ) : (
        <div className="flex items-start gap-3 rounded-md border border-safe/30 bg-safe/10 p-3">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-safe" aria-hidden />
          <p className="text-pretty text-xs leading-relaxed">
            <span className="font-semibold text-safe">Clear: </span>
            No synthetic indicators so far. Monitoring continues for the duration of the call.
          </p>
        </div>
      )}
    </Panel>
  )
}

function Row({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <dt className="truncate text-[11px] text-muted-foreground">{label}</dt>
      <dd className={cn("font-mono font-semibold tabular-nums", tone)}>{value}</dd>
    </div>
  )
}
