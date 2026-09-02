"use client"

import { useEffect, useRef } from "react"
import type { ThreatLevel, VoiceAnalysis as VoiceAnalysisType } from "@/lib/types"
import { formatDuration, threatTone } from "@/lib/status"
import { cn } from "@/lib/utils"
import { Panel, StatusBadge } from "./panel"

interface VoiceAnalysisProps {
  voice: VoiceAnalysisType
  duration: number
  level: ThreatLevel
  live: boolean
}

export function VoiceAnalysis({ voice, duration, level, live }: VoiceAnalysisProps) {
  const tone = threatTone[level]
  const speaking = live && voice.speechActivity === "ACTIVE"

  return (
    <Panel
      eyebrow="Section 03"
      title="Live Voice Analysis"
      action={
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            16 kHz · mono · 20 ms frames
          </span>
          <StatusBadge tone={speaking ? "border-primary/30 bg-primary/10 text-primary" : "border-border bg-secondary text-muted-foreground"} pulse={speaking}>
            {speaking ? "REC" : "IDLE"}
          </StatusBadge>
        </div>
      }
      contentClassName="flex flex-col gap-4"
    >
      <div className="relative h-32 overflow-hidden rounded-md border border-border bg-background/60">
        <Waveform active={speaking} color={tone.var} />
        {speaking && (
          <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-scan" aria-hidden />
        )}
        <div className="pointer-events-none absolute left-3 top-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Caller channel
        </div>
        <div className="pointer-events-none absolute right-3 top-2 font-mono text-[10px] text-muted-foreground">
          {speaking ? '"hello... hello... hello..."' : "—"}
        </div>
      </div>

      {/* Timeline */}
      <div className="flex flex-col gap-1.5">
        <div className="relative h-6">
          <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-border" aria-hidden />
          {/* Progress fill */}
          <div
            className="absolute left-0 top-1/2 h-px -translate-y-1/2 bg-primary/60 transition-all duration-1000 ease-linear"
            style={{ width: "100%" }}
            aria-hidden
          />
          {voice.speechEvents.map((t, i) => {
            const pct = duration > 0 ? Math.min(100, (t / Math.max(duration, 1)) * 100) : 0
            return (
              <span
                key={`${t}-${i}`}
                className="absolute top-1/2 h-3 w-0.5 -translate-y-1/2 rounded-full transition-[left] duration-1000 ease-linear"
                style={{ left: `${pct}%`, backgroundColor: tone.var }}
                title={`Speech detected @ ${formatDuration(Math.floor(t))}`}
                aria-hidden
              />
            )
          })}
          <span
            className="absolute right-0 top-1/2 size-2.5 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]"
            aria-hidden
          />
        </div>
        <div className="flex justify-between font-mono text-[10px] tabular-nums text-muted-foreground">
          <span>00:00</span>
          <span className="text-foreground">{formatDuration(duration)}</span>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {voice.speechEvents.length} speech events · repeated phrase detected
        </p>
      </div>

      {/* Metrics */}
      <dl className="grid grid-cols-2 gap-2 md:grid-cols-4">
        <Metric label="Speech Activity" value={live ? voice.speechActivity : "IDLE"} tone={voice.speechActivity === "ACTIVE" && live ? "text-primary" : "text-muted-foreground"} />
        <Metric label="Audio Quality" value={voice.audioQuality} tone="text-safe" />
        <Metric label="Voice Consistency" value={voice.voiceConsistency} tone={voice.voiceConsistency === "LOW" ? "text-fake" : voice.voiceConsistency === "MEDIUM" ? "text-suspicious" : "text-safe"} />
        <Metric label="Synthetic Voice Indicators" value={voice.syntheticIndicators} tone={voice.syntheticIndicators === "DETECTED" ? "text-critical" : voice.syntheticIndicators === "POSSIBLE" ? "text-suspicious" : "text-safe"} />
      </dl>
    </Panel>
  )
}

function Metric({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="flex flex-col gap-0.5 rounded-md border border-border bg-secondary/30 px-3 py-2">
      <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className={cn("font-mono text-sm font-semibold", tone)}>{value}</dd>
    </div>
  )
}

/** Canvas waveform. Simulates a repeated "hello" utterance with periodic bursts. */
function Waveform({ active, color }: { active: boolean; color: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const activeRef = useRef(active)
  const colorRef = useRef(color)
  activeRef.current = active
  colorRef.current = color

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let raf = 0
    let t = 0
    const dpr = window.devicePixelRatio || 1

    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect()
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const styles = getComputedStyle(document.documentElement)

    const draw = () => {
      const w = canvas.width / dpr
      const h = canvas.height / dpr
      ctx.clearRect(0, 0, w, h)

      // center line
      ctx.strokeStyle = styles.getPropertyValue("--border") || "rgba(255,255,255,0.08)"
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, h / 2)
      ctx.lineTo(w, h / 2)
      ctx.stroke()

      const bars = 96
      const gap = 2
      const bw = (w - gap * (bars - 1)) / bars
      // "hello" burst envelope: 3 syllabic pulses per 1.6s cycle then silence
      const cycle = (t / 60) % 1.6
      const burst = cycle < 1.05 ? 0.35 + 0.65 * Math.abs(Math.sin((cycle / 1.05) * Math.PI * 3)) : 0.08

      ctx.fillStyle = colorRef.current.startsWith("var(")
        ? styles.getPropertyValue(colorRef.current.slice(4, -1)).trim() || "#fff"
        : colorRef.current

      for (let i = 0; i < bars; i++) {
        const phase = t * 0.12 + i * 0.35
        const noise = (Math.sin(phase) + Math.sin(phase * 1.7 + 1.3) + Math.sin(phase * 0.43)) / 3
        const amp = activeRef.current ? 0.06 + burst * (0.3 + 0.7 * Math.abs(noise)) : 0.04
        // taper edges to look like a spectrogram window
        const taper = Math.sin((i / (bars - 1)) * Math.PI)
        const bh = Math.max(2, amp * h * (0.55 + 0.45 * taper))
        const x = i * (bw + gap)
        ctx.globalAlpha = 0.35 + 0.65 * (bh / h)
        ctx.fillRect(x, h / 2 - bh / 2, bw, bh)
      }
      ctx.globalAlpha = 1
      t += 1
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [])

  return <canvas ref={ref} className="size-full" role="img" aria-label="Live caller audio waveform" />
}
