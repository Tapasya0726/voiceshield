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
  spark?: boolean
  live?: boolean
}

export function MetricsRow({ metrics }: { metrics: CallMetrics }) {
  const items: Metric[] = [
    { label: "Active Calls", value: String(metrics.activeCalls), tone: "text-primary", live: true },
    { label: "Calls Analyzed Today", value: String(metrics.callsAnalyzedToday), spark: true },
    { label: "Suspicious Calls", value: String(metrics.suspiciousCalls), tone: "text-suspicious" },
    { label: "Synthetic Voices Detected", value: String(metrics.syntheticVoicesDetected), tone: "text-fake" },
    { label: "Critical Alerts", value: String(metrics.criticalAlerts), tone: "text-critical" },
    { label: "Detection Accuracy", value: `${metrics.detectionAccuracy.toFixed(1)}%`, tone: "text-safe" },
  ]

  return (
    <section aria-label="Dashboard metrics" className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-6">
      {items.map((m) => (
        <div
          key={m.label}
          className="glass relative flex flex-col justify-between gap-2 overflow-hidden rounded-lg border border-border/80 px-3.5 py-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] leading-tight text-muted-foreground">{m.label}</span>
            {m.live && <span className="size-1.5 rounded-full bg-primary animate-pulse" aria-hidden />}
          </div>
          <span className={cn("font-mono text-2xl font-semibold tabular-nums leading-none", m.tone)}>{m.value}</span>
          {m.spark && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 opacity-50" aria-hidden>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={SPARK} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="spark" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.4} />
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
