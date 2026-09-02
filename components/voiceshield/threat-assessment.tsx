"use client"

import { useEffect, useState } from "react"
import { AlertOctagon, AlertTriangle, ShieldAlert, ShieldCheck, type LucideIcon } from "lucide-react"
import type { ThreatAssessment as ThreatAssessmentType, ThreatLevel } from "@/lib/types"
import { THREAT_LEVELS, threatTone } from "@/lib/status"
import { cn } from "@/lib/utils"
import { Eyebrow, Panel, StatusBadge } from "./panel"
import { ProgressRing } from "./progress-ring"

const ICONS: Record<ThreatLevel, LucideIcon> = {
  SAFE: ShieldCheck,
  SUSPICIOUS: AlertTriangle,
  FAKE: ShieldAlert,
  CRITICAL: AlertOctagon,
}

const DESCRIPTIONS: Record<ThreatLevel, string> = {
  SAFE: "Voice characteristics consistent with natural human speech.",
  SUSPICIOUS: "Multiple synthetic voice indicators detected. Caller identity cannot be verified.",
  FAKE: "Voice is highly likely to be synthetic or cloned. Treat caller claims as untrusted.",
  CRITICAL: "Confirmed deepfake signature with scam behavior pattern. Immediate action required.",
}

/** Client-only timestamp to avoid SSR/CSR hydration mismatch. */
function UpdatedAt({ iso }: { iso: string }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return (
    <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground" suppressHydrationWarning>
      <span className="hidden sm:inline">Updated </span>
      {mounted ? new Date(iso).toLocaleTimeString("en-US", { hour12: false }) : "--:--:--"}
    </span>
  )
}

export function ThreatAssessment({ assessment }: { assessment: ThreatAssessmentType }) {
  const level = assessment.level
  const tone = threatTone[level]
  const Icon = ICONS[level]
  const activeIdx = THREAT_LEVELS.indexOf(level)

  return (
    <Panel
      eyebrow="Section 02"
      title="Real-Time Threat Assessment"
      focal={tone.var}
      className="h-full"
      action={<UpdatedAt iso={assessment.updatedAt} />}
      contentClassName="flex flex-col justify-between gap-5 sm:gap-6 xl:p-5"
    >
      {/* Severity stepper: reached levels fill in, current level glows */}
      <ol className="grid grid-cols-4 gap-1.5 sm:gap-2" aria-label="Threat levels">
        {THREAT_LEVELS.map((lvl, i) => {
          const t = threatTone[lvl]
          const reached = i <= activeIdx
          const active = i === activeIdx
          return (
            <li key={lvl} className="flex min-w-0 flex-col gap-1.5">
              <span
                className={cn("h-1.5 rounded-full transition-[background-color,box-shadow] duration-500")}
                style={{
                  backgroundColor: reached ? t.var : "var(--muted)",
                  boxShadow: active ? `0 0 14px ${t.var}` : undefined,
                  opacity: reached && !active ? 0.45 : 1,
                }}
              />
              <span
                className={cn(
                  "truncate font-mono text-[10px] font-semibold uppercase tracking-wider transition-colors duration-300",
                  active ? t.text : reached ? "text-muted-foreground" : "text-muted-foreground/50",
                )}
                aria-current={active ? "true" : undefined}
              >
                {lvl}
              </span>
            </li>
          )
        })}
      </ol>

      {/* Verdict block — the single loudest element on the page */}
      <div
        className={cn(
          "relative flex items-center gap-4 overflow-hidden rounded-md border p-4 transition-[border-color,background-color] duration-500 sm:gap-5 sm:p-5",
          tone.border,
          tone.bg,
        )}
      >
        <div
          className="flex size-14 shrink-0 items-center justify-center rounded-md border-2 bg-background/70 transition-[border-color,color] duration-500 sm:size-16"
          style={{ borderColor: tone.var, color: tone.var }}
        >
          <Icon className="size-7 sm:size-8" aria-hidden />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <Eyebrow>Threat Level</Eyebrow>
            <StatusBadge tone={cn(tone.border, tone.bg, tone.text)} pulse={level !== "SAFE"}>
              {level}
            </StatusBadge>
          </div>
          <p
            key={level}
            className={cn(
              "animate-fade-up text-[2rem] font-semibold leading-none tracking-tight sm:text-4xl lg:text-[2.75rem]",
              tone.text,
            )}
          >
            {level}
          </p>
          <p className="mt-1 text-pretty text-xs leading-relaxed text-muted-foreground sm:text-[13px]">
            {DESCRIPTIONS[level]}
          </p>
        </div>
      </div>

      {/* Probability rings */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <ProgressRing value={assessment.syntheticProbability} label="Synthetic Probability" color={tone.var} emphasis />
        <ProgressRing value={assessment.evidenceReliability} label="Evidence Reliability" color="var(--primary)" />
        <ProgressRing value={assessment.confidence} label="Model Confidence" color="var(--foreground)" />
      </div>
    </Panel>
  )
}
