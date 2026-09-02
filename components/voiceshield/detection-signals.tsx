"use client"

import type { DetectionSignal } from "@/lib/types"
import { signalTone } from "@/lib/status"
import { cn } from "@/lib/utils"
import { Panel, StatusBadge } from "./panel"

const WEIGHT: Record<DetectionSignal["status"], number> = {
  LOW: 20,
  MEDIUM: 45,
  SUSPICIOUS: 60,
  HIGH: 80,
  DETECTED: 100,
}

export function DetectionSignals({ signals }: { signals: DetectionSignal[] }) {
  return (
    <Panel
      eyebrow="Section 04"
      title="Detection Signals"
      className="h-full"
      action={
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {signals.length} signals
        </span>
      }
      contentClassName="p-0"
    >
      <ul className="divide-y divide-border/70">
        {signals.map((s) => {
          const tone = signalTone(s.status)
          const weight = WEIGHT[s.status]
          return (
            <li key={s.id} className="row-hover flex flex-col gap-2 px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2.5">
                  <span className={cn("size-1.5 shrink-0 rounded-full", tone.dot)} aria-hidden />
                  <span className="truncate text-sm text-foreground/90">{s.label}</span>
                </div>
                <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                  <span key={s.value} className={cn("animate-value-in font-mono text-sm font-semibold tabular-nums", tone.text)}>
                    {s.value}
                  </span>
                  <StatusBadge tone={cn("border-transparent", tone.bg, tone.text)} className="w-[4.75rem] justify-center">
                    {s.status}
                  </StatusBadge>
                </div>
              </div>
              {/* Severity meter */}
              <div className="ml-4 h-0.5 overflow-hidden rounded-full bg-muted/70">
                <div
                  className={cn("h-full rounded-full transition-[width,background-color] duration-700", tone.dot)}
                  style={{ width: `${weight}%` }}
                />
              </div>
            </li>
          )
        })}
      </ul>
    </Panel>
  )
}
