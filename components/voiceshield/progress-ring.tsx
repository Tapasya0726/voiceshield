"use client"

import { cn } from "@/lib/utils"

interface ProgressRingProps {
  /** 0-100 */
  value: number
  label: string
  /** CSS color value, e.g. "var(--suspicious)" */
  color: string
  /** Visually emphasize this ring (thicker stroke, glow). */
  emphasis?: boolean
  className?: string
}

const SIZE = 120
const TICKS = 40

/**
 * Fluid SVG ring. Scales with its container (viewBox), so it works from
 * narrow phones to wide monitors without prop changes.
 */
export function ProgressRing({ value, label, color, emphasis, className }: ProgressRingProps) {
  const stroke = emphasis ? 8 : 6
  const r = (SIZE - stroke) / 2 - 6
  const c = 2 * Math.PI * r
  const clamped = Math.min(100, Math.max(0, value))
  const offset = c - (clamped / 100) * c
  const tickR = SIZE / 2 - 2

  return (
    <div className={cn("flex min-w-0 flex-col items-center gap-2", className)}>
      <div className="relative w-full max-w-[124px]">
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="size-full -rotate-90" aria-hidden>
          {/* Tick marks give the ring an instrument feel */}
          {Array.from({ length: TICKS }).map((_, i) => {
            const a = (i / TICKS) * 2 * Math.PI
            const lit = i / TICKS <= clamped / 100
            return (
              <line
                key={i}
                x1={SIZE / 2 + Math.cos(a) * (tickR - (i % 5 === 0 ? 4 : 2))}
                y1={SIZE / 2 + Math.sin(a) * (tickR - (i % 5 === 0 ? 4 : 2))}
                x2={SIZE / 2 + Math.cos(a) * tickR}
                y2={SIZE / 2 + Math.sin(a) * tickR}
                stroke={lit ? color : "currentColor"}
                strokeWidth={1}
                className={cn("transition-colors duration-500", !lit && "text-muted-foreground/30")}
              />
            )
          })}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={r}
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            className="text-muted/80"
          />
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
            style={emphasis ? { filter: `drop-shadow(0 0 6px ${color})` } : undefined}
            className="transition-[stroke-dashoffset,stroke] duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={cn(
              "font-mono font-semibold tabular-nums leading-none text-foreground",
              emphasis ? "text-xl sm:text-2xl" : "text-lg sm:text-xl",
            )}
          >
            {value.toFixed(1)}
            <span className="ml-0.5 text-[0.55em] font-medium text-muted-foreground">%</span>
          </span>
        </div>
      </div>
      <span className="text-balance text-center text-[11px] leading-tight text-muted-foreground">{label}</span>
    </div>
  )
}
