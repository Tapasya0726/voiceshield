"use client"

import { Area, AreaChart, ResponsiveContainer } from "recharts"
import type { CallMetrics } from "@/lib/types"
import { cn } from "@/lib/utils"

const SPARK = [
  { v: 8 }, { v: 12 }, { v: 9 }, { v: 15 }, { v: 14 }, { v: 19 },
  { v: 17 }, { v: 22 }, { v: 20 }, { v: 26 }, { v: 24 }, { v: 28 },
]

interface Metric {
  label: string
  value: string
  tone?: string
  dot?: string
  spark?: boolean
  live?: boolean
  delta?: string
}

export function MetricsRow({ metrics }: { metrics: CallMetrics }) {
  const items: Metric[] = [
    { label: "Active Calls", value: String(metrics.activeCalls), tone: "text-primary", live: true },
    { label: "Analyzed Today", value: String(metrics.callsAnalyzedToday), spark: true, delta: "+12%" },
    { label: "Suspicious", value: String(metrics.suspiciousCalls), tone: "text-suspicious", dot: "bg-suspicious" },
    { label: "Synthetic Detected", value: String(metrics.syntheticVoicesDetected), tone: "text-fake", dot: "bg-fake" },
    { label: "Critical Alerts", value: String(metrics.criticalAlerts), tone: "text-critical", dot: "bg-critical" },
    { label: "Detection Accuracy", value: `${metrics.detectionAccuracy.toFixed(1)}%`, tone: "text-safe", dot: "bg-safe" },
  ]

  return (
    <section
      aria-label="Dashboard metrics"
      className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:gap-3 xl:grid-cols-6"
    >
      {items.map((m) => (
        <div
          key={m.label}
          className="glass relative flex min-w-0 flex-col justify-between gap-2.5 overflow-hidden rounded-lg border border-border/80 px-3.5 py-3 transition-[border-color,transform] duration-200 hover:-translate-y-px hover:border-border"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="truncate font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {m.label}
            </span>
            {m.live ? (
              <span className="size-1.5 shrink-0 rounded-full bg-primary animate-pulse" aria-hidden />
            ) : m.dot ? (
              <span className={cn("size-1.5 shrink-0 rounded-full", m.dot)} aria-hidden />
            ) : null}
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <span
              key={m.value}
              className={cn(
                "animate-value-in font-mono text-[1.65rem] font-semibold tabular-nums leading-none tracking-tight sm:text-2xl",
                m.tone,
              )}
            >
              {m.value}
            </span>
            {m.delta && <span className="font-mono text-[10px] tabular-nums text-safe">{m.delta}</span>}
          </div>
          {m.spark && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 opacity-40" aria-hidden>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={SPARK} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="spark" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="v"
                    stroke="var(--primary)"
                    strokeWidth={1.5}
                    fill="url(#spark)"
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      ))}
    </section>
  )
}
