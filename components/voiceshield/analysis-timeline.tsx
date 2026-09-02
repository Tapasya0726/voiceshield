"use client"

import { useEffect, useRef } from "react"
import type { TimelineEvent } from "@/lib/types"
import { formatDuration } from "@/lib/status"
import { cn } from "@/lib/utils"
import { Panel } from "./panel"

const KIND: Record<TimelineEvent["kind"], { dot: string; text: string }> = {
  info: { dot: "bg-primary", text: "text-foreground/90" },
  warning: { dot: "bg-suspicious", text: "text-suspicious" },
  alert: { dot: "bg-critical", text: "text-critical" },
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
      action={
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {count} events
        </span>
      }
      contentClassName="p-0"
    >
      <ol ref={listRef} className="max-h-72 overflow-y-auto px-4 py-3" aria-live="polite">
        {events.map((e, i) => {
          const k = KIND[e.kind]
          const last = i === events.length - 1
          return (
            <li key={e.id} className="animate-fade-up relative flex gap-3 pb-4 last:pb-0">
              {!last && <span className="absolute left-[3px] top-3 h-full w-px bg-border" aria-hidden />}
              <span className="relative mt-1.5 flex size-[7px] shrink-0 items-center justify-center">
                <span className={cn("size-[7px] rounded-full", k.dot)} aria-hidden />
                {last && live && (
                  <span className={cn("absolute inset-0 rounded-full animate-ping opacity-60", k.dot)} aria-hidden />
                )}
              </span>
              <div className="flex min-w-0 flex-1 items-baseline gap-3">
                <span className="w-11 shrink-0 font-mono text-[11px] tabular-nums text-muted-foreground">
                  {formatDuration(e.at)}
                </span>
                <span className={cn("text-sm leading-snug", k.text)}>{e.label}</span>
              </div>
            </li>
          )
        })}
      </ol>
    </Panel>
  )
}
