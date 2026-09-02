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
      contentClassName="p-0"
    >
      {/* Desktop / tablet table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/80 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              <th scope="col" className="px-4 py-2.5 font-medium">Time</th>
              <th scope="col" className="px-4 py-2.5 font-medium">Caller</th>
              <th scope="col" className="px-4 py-2.5 font-medium">Duration</th>
              <th scope="col" className="px-4 py-2.5 font-medium">Classification</th>
              <th scope="col" className="px-4 py-2.5 text-right font-medium">Synthetic Prob.</th>
              <th scope="col" className="hidden px-4 py-2.5 text-right font-medium lg:table-cell">Reliability</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/70">
            {rows.map((c) => {
              const tone = threatTone[c.classification]
              const live = c.status === "CONNECTED"
              return (
                <tr
                  key={c.id}
                  className={cn("row-hover group", live && "bg-primary/[0.04]")}
                >
                  <td className="px-4 py-3 font-mono tabular-nums text-muted-foreground">{c.startedAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={cn(
                          "size-1.5 shrink-0 rounded-full",
                          live ? "bg-primary animate-pulse" : "bg-transparent",
                        )}
                        aria-label={live ? "Live" : undefined}
                        aria-hidden={!live}
                      />
                      <div className="flex flex-col leading-tight">
                        <span className="font-mono tabular-nums">{c.phoneNumber}</span>
                        <span className="text-[11px] text-muted-foreground">{c.callerName}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono tabular-nums">{formatDuration(c.duration)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge tone={cn(tone.border, tone.bg, tone.text)}>{c.classification}</StatusBadge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2.5">
                      <span className="hidden h-1 w-16 overflow-hidden rounded-full bg-muted xl:block" aria-hidden>
                        <span
                          className="block h-full rounded-full transition-[width] duration-700"
                          style={{ width: `${c.syntheticProbability}%`, backgroundColor: tone.var }}
                        />
                      </span>
                      <span className={cn("font-mono tabular-nums", tone.text)}>{c.syntheticProbability.toFixed(1)}%</span>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-right font-mono tabular-nums lg:table-cell">
                    {c.evidenceReliability.toFixed(1)}%
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <ul className="divide-y divide-border/70 md:hidden">
        {rows.map((c) => {
          const tone = threatTone[c.classification]
          const live = c.status === "CONNECTED"
          return (
            <li key={c.id} className={cn("flex flex-col gap-2.5 px-4 py-3", live && "bg-primary/[0.04]")}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2.5">
                  {live && <span className="size-1.5 shrink-0 rounded-full bg-primary animate-pulse" aria-label="Live" />}
                  <div className="flex min-w-0 flex-col leading-tight">
                    <span className="truncate font-mono text-sm tabular-nums">{c.phoneNumber}</span>
                    <span className="truncate text-[11px] text-muted-foreground">{c.callerName}</span>
                  </div>
                </div>
                <StatusBadge tone={cn(tone.border, tone.bg, tone.text)}>{c.classification}</StatusBadge>
              </div>
              <div className="flex items-center justify-between font-mono text-[11px] tabular-nums text-muted-foreground">
                <span>
                  {c.startedAt} · {formatDuration(c.duration)}
                </span>
                <span>
                  Synth <span className={cn("font-semibold", tone.text)}>{c.syntheticProbability.toFixed(1)}%</span>
                  <span className="mx-1.5 text-border">|</span>
                  Rel <span className="text-foreground">{c.evidenceReliability.toFixed(1)}%</span>
                </span>
              </div>
            </li>
          )
        })}
      </ul>
    </Panel>
  )
}
