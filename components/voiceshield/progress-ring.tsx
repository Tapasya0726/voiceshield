"use client"

import { cn } from "@/lib/utils"

interface ProgressRingProps {
  /** 0-100 */
  value: number
  label: string
  size?: number
  stroke?: number
  /** CSS color value, e.g. "var(--suspicious)" */
  color: string
  className?: string
}

export function ProgressRing({ value, label, size = 96, stroke = 6, color, className }: ProgressRingProps) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c - (Math.min(100, Math.max(0, value)) / 100) * c

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90" aria-hidden>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            className="text-muted"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
            className="transition-[stroke-dashoffset,stroke] duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-lg font-semibold tabular-nums text-foreground">
            {value.toFixed(1)}
            <span className="text-xs text-muted-foreground">%</span>
          </span>
        </div>
      </div>
      <span className="text-center text-[11px] leading-tight text-muted-foreground">{label}</span>
    </div>
  )
}
