"use client"

import { Phone, PhoneOff, RotateCcw, ScanSearch } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Call, ThreatLevel } from "@/lib/types"
import { formatDuration, threatTone } from "@/lib/status"
import { cn } from "@/lib/utils"
import { Eyebrow, Panel, StatusBadge } from "./panel"

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
      focal={tone.var}
      className="h-full overflow-hidden"
      action={
        <StatusBadge
          tone={live ? "border-safe/30 bg-safe/10 text-safe" : "border-border bg-secondary text-muted-foreground"}
          pulse={live}
        >
          {live ? "Connected" : "Ended"}
        </StatusBadge>
      }
      contentClassName="flex flex-col items-center gap-5 p-5 sm:gap-6 sm:p-6"
    >
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-50" aria-hidden />

      {/* Radar / equalizer indicator */}
      <div className="relative flex size-44 items-center justify-center sm:size-48">
        {live && (
          <>
            <span
              className="absolute inset-3 rounded-full border animate-ring-ping"
              style={{ borderColor: tone.var }}
              aria-hidden
            />
            <span
              className="absolute inset-3 rounded-full border animate-ring-ping"
              style={{ borderColor: tone.var, animationDelay: "1.1s" }}
              aria-hidden
            />
            <span
              className="absolute inset-3 rounded-full animate-sweep"
              style={{
                background: `conic-gradient(from 0deg, transparent 0deg, ${tone.var} 60deg, transparent 90deg)`,
                opacity: 0.14,
                maskImage: "radial-gradient(circle, transparent 42%, black 43%)",
                WebkitMaskImage: "radial-gradient(circle, transparent 42%, black 43%)",
              }}
              aria-hidden
            />
          </>
        )}
        <RadialBars color={tone.var} active={live} />
        <div
          className="relative z-10 flex size-[4.25rem] items-center justify-center rounded-full border-2 bg-background transition-[border-color,color,box-shadow] duration-500"
          style={{
            borderColor: tone.var,
            color: tone.var,
            boxShadow: live ? `0 0 28px -6px ${tone.var}` : undefined,
          }}
        >
          <Phone className="size-7" aria-hidden />
        </div>
      </div>

      {/* Caller identity */}
      <div className="relative flex w-full flex-col items-center gap-1 text-center">
        <p className="font-mono text-[1.65rem] font-semibold tabular-nums tracking-tight sm:text-3xl">
          {call.phoneNumber}
        </p>
        <p className="text-sm text-muted-foreground">{call.callerName}</p>
        <p
          className="mt-3 font-mono text-[2.75rem] font-medium tabular-nums leading-none tracking-tight sm:text-5xl"
          aria-live="off"
        >
          {formatDuration(call.duration)}
        </p>
        <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
          <span
            className={cn("size-1.5 rounded-full", live ? "bg-primary animate-pulse" : "bg-muted-foreground")}
            aria-hidden
          />
          {live ? "Analyzing in real time" : "Analysis complete · archived"}
        </p>
      </div>

      {/* Meta strip */}
      <dl className="relative grid w-full grid-cols-3 gap-2 border-y border-border/70 py-3">
        <Meta label="Line" value="PSTN" />
        <Meta label="Codec" value="G.711 μ-law" />
        <Meta label="Region" value="US-East" />
      </dl>

      <div className="relative flex w-full flex-col gap-2 sm:flex-row">
        {running ? (
          <Button
            variant="destructive"
            size="lg"
            className="flex-1 transition-transform active:scale-[0.98]"
            onClick={onEndCall}
          >
            <PhoneOff className="size-4" aria-hidden />
            End Call
          </Button>
        ) : (
          <Button
            variant="outline"
            size="lg"
            className="flex-1 transition-transform active:scale-[0.98]"
            onClick={onRestart}
          >
            <RotateCcw className="size-4" aria-hidden />
            Restart Demo
          </Button>
        )}
        <Button
          variant="secondary"
          size="lg"
          className="flex-1 transition-transform active:scale-[0.98]"
          onClick={onViewAnalysis}
        >
          <ScanSearch className="size-4" aria-hidden />
          Full Analysis
        </Button>
      </div>
    </Panel>
  )
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-0.5 text-center">
      <dt>
        <Eyebrow>{label}</Eyebrow>
      </dt>
      <dd className="truncate font-mono text-xs text-foreground">{value}</dd>
    </div>
  )
}

/** Circular equalizer ring around the phone icon. */
function RadialBars({ color, active }: { color: string; active: boolean }) {
  const bars = 56
  return (
    <svg viewBox="0 0 160 160" className="absolute inset-0 size-full" aria-hidden>
      {Array.from({ length: bars }).map((_, i) => {
        const angle = (i / bars) * 2 * Math.PI
        const inner = 50
        const len = 6 + ((i * 7) % 10)
        const x1 = 80 + Math.cos(angle) * inner
        const y1 = 80 + Math.sin(angle) * inner
        const x2 = 80 + Math.cos(angle) * (inner + len)
        const y2 = 80 + Math.sin(angle) * (inner + len)
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
            className={cn("transition-[stroke] duration-500", active && "animate-pulse")}
            style={{
              opacity: active ? 0.3 + ((i * 7) % 10) / 14 : 0.18,
              animationDelay: `${(i % 14) * 0.08}s`,
              animationDuration: `${0.9 + (i % 5) * 0.15}s`,
            }}
          />
        )
      })}
    </svg>
  )
}
