"use client"

import { useEffect, useRef } from "react"
import type { TimelineEvent } from "@/lib/types"
import { formatDuration } from "@/lib/status"
import { cn } from "@/lib/utils"
import { Panel, StatusBadge } from "./panel"

const KIND: Record<TimelineEvent["kind"], { dot: string; text: string; label: string; badge: string }> = {
  info: { dot: "bg-primary", text: "text-foreground/85", label: "INFO", badge: "bg-primary/10 text-primary" },
  warning: { dot: "bg-suspicious", text: "text-foreground", label: "WARN", badge: "bg-suspicious/10 text-suspicious" },
  alert: { dot: "bg-critical", text: "text-critical", label: "ALERT", badge: "bg-critical/10 text-critical" },
}

export function AnalysisTimeline({ events, live }: { events: TimelineEvent[]; live: boolean }) {
  const listRef = useRef<HTMLOListElement>(null)
  const count = events.length

  // Scroll only the list container, never the page.
  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" })
  }, [count])

  return (
    <Panel
      eyebrow="Section 06"
      title="Live Analysis Timeline"
      className="h-full"
      action={
        <div className="flex items-center gap-2">
          {live && (
            <StatusBadge tone="border-primary/30 bg-primary/10 text-primary" pulse>
              Live
            </StatusBadge>
          )}
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{count} events</span>
        </div>
      }
      contentClassName="p-0"
    >
      <ol ref={listRef} className="max-h-80 overflow-y-auto px-4 py-3" aria-live="polite">
        {events.map((e, i) => {
          const k = KIND[e.kind]
          const last = i === events.length - 1
          return (
            <li key={e.id} className="animate-fade-up relative grid grid-cols-[auto_auto_1fr] gap-x-3 pb-4 last:pb-0">
              <span className="w-10 pt-0.5 font-mono text-[11px] tabular-nums text-muted-foreground sm:w-11">
                {formatDuration(e.at)}
              </span>
              <span className="relative flex w-3 justify-center">
                {!last && <span className="absolute top-3.5 bottom-[-1rem] w-px bg-border" aria-hidden />}
                <span className="relative mt-1.5 flex size-[7px] items-center justify-center">
                  <span className={cn("size-[7px] rounded-full", k.dot)} aria-hidden />
                  {last && live && (
                    <span className={cn("absolute inset-0 rounded-full animate-ping opacity-60", k.dot)} aria-hidden />
                  )}
                </span>
              </span>
              <div className="flex min-w-0 flex-col gap-1">
                <span className={cn("text-pretty text-[13px] leading-snug sm:text-sm", k.text)}>{e.label}</span>
                {e.kind !== "info" && (
                  <span
                    className={cn(
                      "w-fit rounded-sm px-1 font-mono text-[9px] font-semibold uppercase tracking-wider",
                      k.badge,
                    )}
                  >
                    {k.label}
                  </span>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </Panel>
  )
}
