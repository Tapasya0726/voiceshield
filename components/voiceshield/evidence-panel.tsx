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
      className="h-full"
      action={
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {evidence.length} items
        </span>
      }
      contentClassName="p-3 sm:p-4"
    >
      {evidence.length === 0 ? (
        <div className="flex h-36 flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border px-4 text-center">
          <span className="size-1.5 rounded-full bg-primary animate-pulse" aria-hidden />
          <p className="text-xs text-muted-foreground">Collecting evidence from live audio…</p>
        </div>
      ) : (
        <ol className="grid gap-2 sm:grid-cols-2">
          {evidence.map((e) => {
            const Icon = ICONS[e.icon]
            const tone = severityTone(e.severity)
            return (
              <li
                key={e.id}
                className="animate-fade-up group flex min-w-0 flex-col gap-3 rounded-md border border-border/80 bg-secondary/25 p-3 transition-[border-color,background-color,transform] duration-200 hover:-translate-y-px hover:border-border hover:bg-secondary/45"
              >
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      "flex size-9 shrink-0 items-center justify-center rounded-md border border-transparent transition-colors group-hover:border-current/20",
                      tone.bg,
                      tone.text,
                    )}
                  >
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
                        EV-{String(e.index).padStart(2, "0")}
                      </span>
                      <StatusBadge tone={cn("border-transparent", tone.bg, tone.text)}>{tone.label}</StatusBadge>
                    </div>
                    <p className="text-pretty text-[13px] leading-snug text-foreground/90">{e.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-[width] duration-700"
                      style={{ width: `${e.reliability}%` }}
                    />
                  </div>
                  <span className="shrink-0 font-mono text-[11px] tabular-nums text-muted-foreground">
                    Reliability <span className="text-foreground">{e.reliability}%</span>
                  </span>
                </div>
              </li>
            )
          })}
        </ol>
      )}
    </Panel>
  )
}
