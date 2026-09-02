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
      className="h-full"
      action={
        <div className="flex items-center gap-2">
          <span className="hidden font-mono text-[10px] uppercase tracking-wider text-muted-foreground lg:inline">
            16 kHz · mono · 20 ms frames
          </span>
          <StatusBadge
            tone={
              speaking ? "border-primary/30 bg-primary/10 text-primary" : "border-border bg-secondary text-muted-foreground"
            }
            pulse={speaking}
          >
            {speaking ? "REC" : "IDLE"}
          </StatusBadge>
        </div>
      }
      contentClassName="flex flex-col gap-4"
    >
      <div className="relative h-36 overflow-hidden rounded-md border border-border bg-background/70 sm:h-40">
        <Waveform active={speaking} color={tone.var} />
        {speaking && (
          <div
            className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-primary/[0.06] to-transparent animate-scan"
            aria-hidden
          />
        )}
        <div className="pointer-events-none absolute left-3 top-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          <span className={cn("size-1.5 rounded-full", speaking ? "bg-primary animate-pulse" : "bg-muted-foreground/50")} aria-hidden />
          Caller channel
        </div>
        <div className="pointer-events-none absolute right-3 top-2 max-w-[50%] truncate font-mono text-[10px] text-muted-foreground">
          {speaking ? '"hello… hello… hello…"' : "—"}
        </div>
        <div className="pointer-events-none absolute bottom-2 left-3 font-mono text-[10px] tabular-nums text-muted-foreground/70">
          -12 dBFS
        </div>
        <div className="pointer-events-none absolute bottom-2 right-3 font-mono text-[10px] uppercase tracking-wider" style={{ color: tone.var }}>
          {level}
        </div>
      </div>

      {/* Timeline */}
      <div className="flex flex-col gap-1.5">
        <div className="relative h-6">
          <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-border" aria-hidden />
          <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-primary/50" aria-hidden />
          {voice.speechEvents.map((t, i) => {
            const pct = duration > 0 ? Math.min(100, (t / Math.max(duration, 1)) * 100) : 0
            return (
              <span
                key={`${t}-${i}`}
                className="absolute top-1/2 h-3.5 w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full transition-[left,background-color] duration-1000 ease-linear"
                style={{ left: `${pct}%`, backgroundColor: tone.var }}
                title={`Speech detected @ ${formatDuration(Math.floor(t))}`}
                aria-hidden
              />
            )
          })}
          <span
            className="absolute right-0 top-1/2 size-2.5 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_10px_var(--primary)]"
            aria-hidden
          />
        </div>
        <div className="flex items-center justify-between font-mono text-[10px] tabular-nums text-muted-foreground">
          <span>00:00</span>
          <span className="uppercase tracking-wider">
            {voice.speechEvents.length} speech events
            <span className="hidden sm:inline"> · repeated phrase detected</span>
          </span>
          <span className="text-foreground">{formatDuration(duration)}</span>
        </div>
      </div>

      {/* Metrics */}
      <dl className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        <Metric
          label="Speech Activity"
          value={live ? voice.speechActivity : "IDLE"}
          tone={voice.speechActivity === "ACTIVE" && live ? "text-primary" : "text-muted-foreground"}
        />
        <Metric label="Audio Quality" value={voice.audioQuality} tone="text-safe" />
        <Metric
          label="Voice Consistency"
          value={voice.voiceConsistency}
          tone={
            voice.voiceConsistency === "LOW"
              ? "text-fake"
              : voice.voiceConsistency === "MEDIUM"
                ? "text-suspicious"
                : "text-safe"
          }
        />
        <Metric
          label="Synthetic Indicators"
          value={voice.syntheticIndicators}
          tone={
            voice.syntheticIndicators === "DETECTED"
              ? "text-critical"
              : voice.syntheticIndicators === "POSSIBLE"
                ? "text-suspicious"
                : "text-safe"
          }
        />
      </dl>
    </Panel>
  )
}

function Metric({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-1 rounded-md border border-border bg-secondary/30 px-3 py-2.5 transition-colors hover:border-border hover:bg-secondary/50">
      <dt className="font-mono text-[10px] uppercase leading-tight tracking-wider text-muted-foreground">{label}</dt>
      <dd key={value} className={cn("animate-value-in font-mono text-sm font-semibold", tone)}>
        {value}
      </dd>
    </div>
  )
}

/**
 * Canvas waveform. Mirrored spectral bars with a peak-hold envelope, drawn
 * in the current threat color. Simulates a repeated "hello" utterance.
 */
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
    let peaks: number[] = []

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
    const resolve = (c: string) => (c.startsWith("var(") ? styles.getPropertyValue(c.slice(4, -1)).trim() || "#fff" : c)
    const gridColor = "rgba(255,255,255,0.05)"

    const draw = () => {
      const w = canvas.width / dpr
      const h = canvas.height / dpr
      ctx.clearRect(0, 0, w, h)

      // faint horizontal grid (dB lines)
      ctx.strokeStyle = gridColor
      ctx.lineWidth = 1
      for (let g = 1; g < 4; g++) {
        const y = (h / 4) * g
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)
        ctx.stroke()
      }
      // center line
      ctx.strokeStyle = "rgba(255,255,255,0.12)"
      ctx.beginPath()
      ctx.moveTo(0, h / 2)
      ctx.lineTo(w, h / 2)
      ctx.stroke()

      const bars = w < 420 ? 64 : 112
      const gap = 2
      const bw = Math.max(1.5, (w - gap * (bars - 1)) / bars)
      if (peaks.length !== bars) peaks = new Array(bars).fill(0)

      // "hello" burst envelope: 3 syllabic pulses per 1.6s cycle then silence
      const cycle = (t / 60) % 1.6
      const burst = cycle < 1.05 ? 0.35 + 0.65 * Math.abs(Math.sin((cycle / 1.05) * Math.PI * 3)) : 0.08
      const fill = resolve(colorRef.current)

      for (let i = 0; i < bars; i++) {
        const phase = t * 0.12 + i * 0.35
        const noise = (Math.sin(phase) + Math.sin(phase * 1.7 + 1.3) + Math.sin(phase * 0.43)) / 3
        const amp = activeRef.current ? 0.06 + burst * (0.3 + 0.7 * Math.abs(noise)) : 0.04
        const taper = Math.sin((i / (bars - 1)) * Math.PI)
        const bh = Math.max(2, amp * h * 0.9 * (0.55 + 0.45 * taper))
        const x = i * (bw + gap)

        // peak hold decays slowly
        peaks[i] = Math.max(bh, peaks[i] * 0.965)

        ctx.fillStyle = fill
        ctx.globalAlpha = 0.3 + 0.7 * (bh / h)
        ctx.fillRect(x, h / 2 - bh / 2, bw, bh)

        // peak caps
        ctx.globalAlpha = 0.9
        ctx.fillRect(x, h / 2 - peaks[i] / 2 - 2, bw, 1.5)
        ctx.fillRect(x, h / 2 + peaks[i] / 2 + 0.5, bw, 1.5)
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
