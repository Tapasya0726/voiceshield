"use client"

import { Activity, AudioWaveform, Cpu, Fingerprint, Radio, Repeat, type LucideIcon } from "lucide-react"
import type { Evidence } from "@/lib/types"
import { severityTone } from "@/lib/status"
import { cn } from "@/lib/utils"
import { Panel, StatusBadge } from "./panel"

const ICONS: Record<Evidence["icon"], LucideIcon> = {
  waveform: AudioWaveform,
  fingerprint: Fingerprint,
  activity: Activity,
  repeat: Repeat,
  radio: Radio,
  cpu: Cpu,
}

export function EvidencePanel({ evidence }: { evidence: Evidence[] }) {
  return (
    <Panel
      eyebrow="Section 05"
      title="Evidence"
      action={
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {evidence.length} items
        </span>
      }
      contentClassName="p-0"
    >
      {evidence.length === 0 ? (
        <div className="flex h-32 flex-col items-center justify-center gap-1 px-4 text-center">
          <span className="size-1.5 rounded-full bg-primary animate-pulse" aria-hidden />
          <p className="text-xs text-muted-foreground">Collecting evidence from live audio…</p>
        </div>
      ) : (
        <ol className="divide-y divide-border">
          {evidence.map((e) => {
            const Icon = ICONS[e.icon]
            const tone = severityTone(e.severity)
            return (
              <li key={e.id} className="animate-fade-up flex items-start gap-3 px-4 py-3">
                <span className="mt-0.5 font-mono text-[11px] tabular-nums text-muted-foreground">
                  {String(e.index).padStart(2, "0")}
                </span>
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-md border border-border",
                    tone.bg,
                    tone.text,
                  )}
                >
                  <Icon className="size-4" aria-hidden />
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <p className="text-pretty text-sm leading-snug text-foreground/90">{e.description}</p>
                  <div className="flex items-center gap-3">
                    <div className="flex flex-1 items-center gap-2">
                      <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary transition-[width] duration-700"
                          style={{ width: `${e.reliability}%` }}
                        />
                      </div>
                      <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
                        Reliability <span className="text-foreground">{e.reliability}%</span>
                      </span>
                    </div>
                    <StatusBadge tone={cn("border-transparent", tone.bg, tone.text)}>{tone.label}</StatusBadge>
                  </div>
                </div>
              </li>
            )
          })}
        </ol>
      )}
    </Panel>
  )
}
