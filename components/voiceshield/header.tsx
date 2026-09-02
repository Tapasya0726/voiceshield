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
  const date = now ? now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "2-digit" }) : ""

  return (
    <header className="glass sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-border/80 px-3 sm:px-4 lg:px-6">
      <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-md border border-primary/30 bg-primary/10 text-primary shadow-[0_0_16px_-4px_var(--primary)]">
          <ShieldCheck className="size-4" aria-hidden />
        </div>
        <div className="flex min-w-0 flex-col whitespace-nowrap leading-none">
          <span className="text-sm font-semibold tracking-tight">VoiceShield</span>
          <span className="hidden font-mono text-[10px] uppercase tracking-widest text-muted-foreground sm:block">
            Real-Time Voice Security
          </span>
        </div>
        {DEMO_MODE && (
          <StatusBadge
            tone="border-primary/30 bg-primary/10 text-primary"
            className="ml-2 hidden lg:inline-flex"
          >
            Demo Mode · Mock Data
          </StatusBadge>
        )}
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <StatusBadge tone="border-safe/30 bg-safe/10 text-safe" pulse>
          <span className="hidden sm:inline">Protection Active</span>
          <span className="sm:hidden">Active</span>
        </StatusBadge>
        <div className="hidden items-center gap-2 whitespace-nowrap rounded-sm border border-border bg-secondary/40 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground xl:flex">
          <Cpu className="size-3.5 text-primary" aria-hidden />
          <span>GPU</span>
          <span className="text-foreground">A100 · 41%</span>
          <span className="size-1.5 rounded-full bg-safe" aria-hidden />
        </div>
        <div className="hidden flex-col items-end leading-none md:flex">
          <span className="font-mono text-sm tabular-nums text-foreground">{time}</span>
          <span className="whitespace-nowrap font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            {date}
          </span>
        </div>
        <button
          type="button"
          aria-label="Open profile menu"
          className="flex size-9 items-center justify-center rounded-md border border-border bg-secondary/60 text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground active:scale-95 md:size-8"
        >
          <User className="size-4" aria-hidden />
        </button>
      </div>
    </header>
  )
}
