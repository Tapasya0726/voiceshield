"use client"

import type { DetectionSignal } from "@/lib/types"
import { signalTone } from "@/lib/status"
import { cn } from "@/lib/utils"
import { Panel, StatusBadge } from "./panel"

export function DetectionSignals({ signals }: { signals: DetectionSignal[] }) {
  return (
    <Panel
      eyebrow="Section 04"
      title="Detection Signals"
      action={
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {signals.length} signals
        </span>
      }
      contentClassName="p-0"
    >
      <ul className="divide-y divide-border">
        {signals.map((s) => {
          const tone = signalTone(s.status)
          return (
            <li key={s.id} className="flex items-center justify-between gap-3 px-4 py-2.5">
              <div className="flex items-center gap-2.5">
                <span className={cn("size-1.5 rounded-full", tone.dot)} aria-hidden />
                <span className="text-sm text-foreground/90">{s.label}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={cn("font-mono text-sm font-semibold tabular-nums", tone.text)}>{s.value}</span>
                <StatusBadge tone={cn("border-transparent", tone.bg, tone.text)} className="w-20 justify-center">
                  {s.status}
                </StatusBadge>
              </div>
            </li>
          )
        })}
      </ul>
    </Panel>
  )
}
