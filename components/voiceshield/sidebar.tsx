"use client"

import {
  Activity,
  BarChart3,
  FileSearch,
  History,
  LayoutDashboard,
  PhoneCall,
  Settings,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

export type NavKey =
  | "overview"
  | "live"
  | "analysis"
  | "history"
  | "evidence"
  | "performance"
  | "settings"

const NAV: { key: NavKey; label: string; icon: LucideIcon; badge?: string }[] = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "live", label: "Live Calls", icon: PhoneCall, badge: "1" },
  { key: "analysis", label: "Call Analysis", icon: Activity },
  { key: "history", label: "Detection History", icon: History },
  { key: "evidence", label: "Evidence", icon: FileSearch },
  { key: "performance", label: "Model Performance", icon: BarChart3 },
  { key: "settings", label: "Settings", icon: Settings },
]

export function Sidebar({
  active,
  onChange,
}: {
  active: NavKey
  onChange: (key: NavKey) => void
}) {
  return (
    <aside className="sticky top-14 hidden h-[calc(100svh-3.5rem)] w-14 shrink-0 flex-col self-start border-r border-sidebar-border bg-sidebar md:flex lg:w-52">
      <nav aria-label="Primary" className="flex flex-1 flex-col gap-1 p-2">
        {NAV.map(({ key, label, icon: Icon, badge }) => {
          const isActive = key === active
          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              aria-current={isActive ? "page" : undefined}
              title={label}
              className={cn(
                "group relative flex h-9 items-center gap-3 rounded-md px-2.5 text-sm transition-colors",
                isActive
                  ? "bg-sidebar-accent text-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
              )}
            >
              {isActive && (
                <span
                  className="absolute left-0 top-1.5 h-6 w-0.5 rounded-r bg-primary"
                  aria-hidden
                />
              )}
              <Icon className={cn("size-4 shrink-0", isActive && "text-primary")} aria-hidden />
              <span className="hidden flex-1 truncate text-left lg:inline">{label}</span>
              {badge && (
                <span className="hidden rounded-sm bg-critical/15 px-1.5 font-mono text-[10px] font-semibold text-critical lg:inline">
                  {badge}
                </span>
              )}
            </button>
          )
        })}
      </nav>
      <div className="hidden border-t border-sidebar-border p-3 lg:block">
        <div className="rounded-md border border-border bg-secondary/40 p-2.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Model
            </span>
            <span className="size-1.5 rounded-full bg-safe" aria-hidden />
          </div>
          <p className="mt-1 font-mono text-xs text-foreground">vs-detector v2.4.1</p>
          <p className="font-mono text-[10px] text-muted-foreground">latency 38ms · p95 61ms</p>
        </div>
      </div>
    </aside>
  )
}
