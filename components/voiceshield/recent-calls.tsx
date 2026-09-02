"use client"

import type { Call } from "@/lib/types"
import { formatDuration, threatTone } from "@/lib/status"
import { cn } from "@/lib/utils"
import { Panel, StatusBadge } from "./panel"

export function RecentCalls({ calls, liveCall }: { calls: Call[]; liveCall: Call }) {
  // Keep the live row in sync with the simulation.
  const rows = calls.map((c) =>
    c.id === liveCall.id
      ? {
          ...c,
          duration: liveCall.duration,
          classification: liveCall.classification,
          syntheticProbability: liveCall.syntheticProbability,
          evidenceReliability: liveCall.evidenceReliability,
          status: liveCall.status,
        }
      : c,
  )

  return (
    <Panel
      eyebrow="Section 09"
      title="Recent Calls"
      action={
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          GET /api/calls
        </span>
      }
      contentClassName="p-0 overflow-x-auto"
    >
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b border-border text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            <th scope="col" className="px-4 py-2 font-medium">Time</th>
            <th scope="col" className="px-4 py-2 font-medium">Caller</th>
            <th scope="col" className="px-4 py-2 font-medium">Duration</th>
            <th scope="col" className="px-4 py-2 font-medium">Classification</th>
            <th scope="col" className="px-4 py-2 text-right font-medium">Synthetic Prob.</th>
            <th scope="col" className="px-4 py-2 text-right font-medium">Reliability</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((c) => {
            const tone = threatTone[c.classification]
            const live = c.status === "CONNECTED"
            return (
              <tr key={c.id} className={cn("transition-colors hover:bg-secondary/40", live && "bg-primary/[0.04]")}>
                <td className="px-4 py-2.5 font-mono tabular-nums text-muted-foreground">{c.startedAt}</td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    {live && <span className="size-1.5 rounded-full bg-primary animate-pulse" aria-label="Live" />}
                    <div className="flex flex-col leading-tight">
                      <span className="font-mono tabular-nums">{c.phoneNumber}</span>
                      <span className="text-[11px] text-muted-foreground">{c.callerName}</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-2.5 font-mono tabular-nums">{formatDuration(c.duration)}</td>
                <td className="px-4 py-2.5">
                  <StatusBadge tone={cn(tone.border, tone.bg, tone.text)}>{c.classification}</StatusBadge>
                </td>
                <td className={cn("px-4 py-2.5 text-right font-mono tabular-nums", tone.text)}>
                  {c.syntheticProbability.toFixed(1)}%
                </td>
                <td className="px-4 py-2.5 text-right font-mono tabular-nums">{c.evidenceReliability.toFixed(1)}%</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </Panel>
  )
}
