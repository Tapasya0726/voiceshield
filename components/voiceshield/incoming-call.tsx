"use client"

import { Phone, PhoneOff, RotateCcw, ScanSearch } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Call, ThreatLevel } from "@/lib/types"
import { formatDuration, threatTone } from "@/lib/status"
import { cn } from "@/lib/utils"
import { Panel, StatusBadge } from "./panel"

interface IncomingCallProps {
  call: Call
  level: ThreatLevel
  running: boolean
  onEndCall: () => void
  onRestart: () => void
  onViewAnalysis: () => void
}

export function IncomingCall({ call, level, running, onEndCall, onRestart, onViewAnalysis }: IncomingCallProps) {
  const tone = threatTone[level]
  const live = call.status === "CONNECTED"

  return (
    <Panel
      eyebrow="Section 01"
      title="Incoming Call"
      className="relative overflow-hidden"
      action={
        <StatusBadge
          tone={live ? "border-safe/30 bg-safe/10 text-safe" : "border-border bg-secondary text-muted-foreground"}
          pulse={live}
        >
          {live ? "Call Connected" : "Call Ended"}
        </StatusBadge>
      }
      contentClassName="flex flex-col items-center gap-5 p-5"
    >
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" aria-hidden />

      <div className="relative flex size-40 items-center justify-center">
        {live && (
          <>
            <span
              className={cn("absolute inset-4 rounded-full border animate-ring-ping", tone.border)}
              style={{ borderColor: tone.var }}
              aria-hidden
            />
            <span
              className={cn("absolute inset-4 rounded-full border animate-ring-ping", tone.border)}
              style={{ borderColor: tone.var, animationDelay: "0.8s" }}
              aria-hidden
            />
          </>
        )}
        <RadialBars color={tone.var} active={live} />
        <div
          className="relative z-10 flex size-16 items-center justify-center rounded-full border bg-background shadow-lg transition-colors duration-500"
          style={{ borderColor: tone.var, color: tone.var }}
        >
          <Phone className="size-6" aria-hidden />
        </div>
      </div>

      <div className="relative flex flex-col items-center gap-1 text-center">
        <p className="font-mono text-2xl font-semibold tabular-nums tracking-tight">{call.phoneNumber}</p>
        <p className="text-sm text-muted-foreground">{call.callerName}</p>
        <p className="mt-2 font-mono text-3xl tabular-nums" aria-live="off">
          {formatDuration(call.duration)}
        </p>
        <p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
          <span className={cn("size-1.5 rounded-full", live ? "bg-primary animate-pulse" : "bg-muted-foreground")} aria-hidden />
          {live ? "VoiceShield is analyzing this call in real time" : "Analysis complete — call archived"}
        </p>
      </div>

      <div className="relative flex w-full gap-2">
        {running ? (
          <Button variant="destructive" className="flex-1" onClick={onEndCall}>
            <PhoneOff className="size-4" aria-hidden />
            End Call
          </Button>
        ) : (
          <Button variant="outline" className="flex-1" onClick={onRestart}>
            <RotateCcw className="size-4" aria-hidden />
            Restart Demo
          </Button>
        )}
        <Button variant="secondary" className="flex-1" onClick={onViewAnalysis}>
          <ScanSearch className="size-4" aria-hidden />
          View Full Analysis
        </Button>
      </div>
    </Panel>
  )
}

/** Circular equalizer ring around the phone icon. */
function RadialBars({ color, active }: { color: string; active: boolean }) {
  const bars = 48
  return (
    <svg viewBox="0 0 160 160" className="absolute inset-0 size-full" aria-hidden>
      {Array.from({ length: bars }).map((_, i) => {
        const angle = (i / bars) * 2 * Math.PI
        const inner = 48
        const x1 = 80 + Math.cos(angle) * inner
        const y1 = 80 + Math.sin(angle) * inner
        const x2 = 80 + Math.cos(angle) * (inner + 14)
        const y2 = 80 + Math.sin(angle) * (inner + 14)
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            className={cn("origin-center transition-colors duration-500", active && "animate-pulse")}
            style={{
              opacity: 0.25 + ((i * 7) % 10) / 14,
              animationDelay: `${(i % 12) * 0.09}s`,
              animationDuration: `${0.9 + (i % 5) * 0.15}s`,
            }}
          />
        )
      })}
    </svg>
  )
}
