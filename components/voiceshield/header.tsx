"use client"

import { useEffect, useState } from "react"
import { Cpu, ShieldCheck, User } from "lucide-react"
import { StatusBadge } from "./panel"
import { DEMO_MODE } from "@/lib/api"

function useClock() {
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

export function Header() {
  const now = useClock()
  const time = now
    ? now.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" })
    : "--:--:--"
  const date = now
    ? now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "2-digit" })
    : ""

  return (
    <header className="glass sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b border-border/80 px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <div className="flex size-8 items-center justify-center rounded-md border border-primary/30 bg-primary/10 text-primary">
          <ShieldCheck className="size-4" aria-hidden />
        </div>
        <div className="flex flex-col whitespace-nowrap leading-none">
          <span className="text-sm font-semibold tracking-tight">VoiceShield</span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Real-Time Voice Security
          </span>
        </div>
        {DEMO_MODE && (
          <StatusBadge tone="border-primary/30 bg-primary/10 text-primary" className="ml-2 hidden whitespace-nowrap lg:inline-flex">
            Demo Mode · Mock Data
          </StatusBadge>
        )}
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <StatusBadge tone="border-safe/30 bg-safe/10 text-safe" className="whitespace-nowrap" pulse>
          Protection Active
        </StatusBadge>
        <div className="hidden items-center gap-2 whitespace-nowrap rounded-sm border border-border bg-secondary/40 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground lg:flex">
          <Cpu className="size-3.5 text-primary" aria-hidden />
          <span>GPU</span>
          <span className="text-foreground">A100 · 41%</span>
          <span className="size-1.5 rounded-full bg-safe" aria-hidden />
        </div>
        <div className="hidden flex-col items-end leading-none sm:flex">
          <span className="font-mono text-sm tabular-nums text-foreground">{time}</span>
          <span className="font-mono text-[10px] uppercase tracking-wider whitespace-nowrap text-muted-foreground">{date}</span>
        </div>
        <button
          type="button"
          aria-label="Open profile menu"
          className="flex size-8 items-center justify-center rounded-md border border-border bg-secondary/60 text-muted-foreground transition-colors hover:text-foreground"
        >
          <User className="size-4" aria-hidden />
        </button>
      </div>
    </header>
  )
}
