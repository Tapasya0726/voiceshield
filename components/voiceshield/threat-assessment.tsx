"use client"

import { useEffect, useState } from "react"
import { AlertOctagon, AlertTriangle, ShieldAlert, ShieldCheck, type LucideIcon } from "lucide-react"
import type { ThreatAssessment as ThreatAssessmentType, ThreatLevel } from "@/lib/types"
import { THREAT_LEVELS, threatTone } from "@/lib/status"
import { cn } from "@/lib/utils"
import { Panel, StatusBadge } from "./panel"
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
      Updated {mounted ? new Date(iso).toLocaleTimeString("en-US", { hour12: false }) : "--:--:--"}
    </span>
  )
}

export function ThreatAssessment({ assessment }: { assessment: ThreatAssessmentType }) {
  const level = assessment.level
  const tone = threatTone[level]
  const Icon = ICONS[level]

  return (
    <Panel
      eyebrow="Section 02"
      title="Real-Time Threat Assessment"
      action={<UpdatedAt iso={assessment.updatedAt} />}
      contentClassName="flex flex-col gap-5"
    >
      {/* State track */}
      <ol className="grid grid-cols-4 gap-1.5" aria-label="Threat levels">
        {THREAT_LEVELS.map((lvl) => {
          const active = lvl === level
          const t = threatTone[lvl]
          return (
            <li key={lvl} className="flex flex-col gap-1.5">
              <span
                className={cn("h-1 rounded-full transition-all duration-500", active ? "" : "bg-muted")}
                style={active ? { backgroundColor: t.var, boxShadow: `0 0 12px ${t.var}` } : undefined}
              />
              <span
                className={cn(
                  "font-mono text-[10px] font-medium uppercase tracking-wider transition-colors",
                  active ? t.text : "text-muted-foreground/60",
                )}
                aria-current={active ? "true" : undefined}
              >
                {lvl}
              </span>
            </li>
          )
        })}
      </ol>

      {/* Big indicator */}
      <div
        className={cn(
          "flex items-center gap-4 rounded-md border p-4 transition-colors duration-500",
          tone.border,
          tone.bg,
        )}
      >
        <div
          className="flex size-14 shrink-0 items-center justify-center rounded-md border bg-background/60 transition-colors duration-500"
          style={{ borderColor: tone.var, color: tone.var }}
        >
          <Icon className="size-7" aria-hidden />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Threat Level
            </span>
            <StatusBadge tone={cn(tone.border, tone.bg, tone.text)} pulse={level !== "SAFE"}>
              {level}
            </StatusBadge>
          </div>
          <p
            key={level}
            className={cn("animate-fade-up text-3xl font-semibold tracking-tight md:text-4xl", tone.text)}
          >
            {level}
          </p>
          <p className="text-pretty text-xs leading-relaxed text-muted-foreground">{DESCRIPTIONS[level]}</p>
        </div>
      </div>

      {/* Rings */}
      <div className="grid grid-cols-3 gap-2">
        <ProgressRing value={assessment.syntheticProbability} label="Synthetic Probability" color={tone.var} />
        <ProgressRing value={assessment.evidenceReliability} label="Evidence Reliability" color="var(--primary)" />
        <ProgressRing value={assessment.confidence} label="Confidence" color="var(--foreground)" />
      </div>
    </Panel>
  )
}
