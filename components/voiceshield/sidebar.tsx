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

const NAV: { key: NavKey; label: string; short: string; icon: LucideIcon; badge?: string }[] = [
  { key: "overview", label: "Overview", short: "Home", icon: LayoutDashboard },
  { key: "live", label: "Live Calls", short: "Live", icon: PhoneCall, badge: "1" },
  { key: "analysis", label: "Call Analysis", short: "Analysis", icon: Activity },
  { key: "history", label: "Detection History", short: "History", icon: History },
  { key: "evidence", label: "Evidence", short: "Evidence", icon: FileSearch },
  { key: "performance", label: "Model Performance", short: "Model", icon: BarChart3 },
  { key: "settings", label: "Settings", short: "Settings", icon: Settings },
]

interface SidebarProps {
  active: NavKey
  onChange: (key: NavKey) => void
}

export function Sidebar({ active, onChange }: SidebarProps) {
  return (
    <aside className="sticky top-14 hidden h-[calc(100svh-3.5rem)] w-14 shrink-0 flex-col self-start border-r border-sidebar-border bg-sidebar md:flex lg:w-56">
      <nav aria-label="Primary" className="flex flex-1 flex-col gap-0.5 p-2">
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
                "group relative flex h-9 items-center gap-3 rounded-md px-2.5 text-sm transition-[background-color,color,transform] duration-150",
                "active:scale-[0.98]",
                isActive
                  ? "bg-sidebar-accent text-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
              )}
            >
              <span
                className={cn(
                  "absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r bg-primary transition-[opacity,transform] duration-200",
                  isActive ? "opacity-100 scale-y-100" : "opacity-0 scale-y-50",
                )}
                aria-hidden
              />
              <Icon
                className={cn(
                  "size-4 shrink-0 transition-[color,transform] duration-150 group-hover:scale-105",
                  isActive && "text-primary",
                )}
                aria-hidden
              />
              <span className="hidden flex-1 truncate text-left lg:inline">{label}</span>
              {badge && (
                <span className="hidden rounded-sm border border-critical/30 bg-critical/10 px-1.5 font-mono text-[10px] font-semibold text-critical lg:inline">
                  {badge}
                </span>
              )}
            </button>
          )
        })}
      </nav>
      <div className="hidden border-t border-sidebar-border p-3 lg:block">
        <div className="rounded-md border border-border bg-secondary/40 p-2.5 transition-colors hover:border-primary/30">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Model</span>
            <span className="size-1.5 rounded-full bg-safe shadow-[0_0_6px_var(--safe)]" aria-hidden />
          </div>
          <p className="mt-1 font-mono text-xs text-foreground">vs-detector v2.4.1</p>
          <p className="font-mono text-[10px] text-muted-foreground">latency 38ms · p95 61ms</p>
        </div>
      </div>
    </aside>
  )
}

/** Bottom tab bar for phones. Shows the five most-used destinations. */
export function MobileNav({ active, onChange }: SidebarProps) {
  const items = NAV.filter((n) => ["overview", "live", "analysis", "evidence", "history"].includes(n.key))
  return (
    <nav
      aria-label="Primary"
      className="glass safe-bottom fixed inset-x-0 bottom-0 z-30 border-t border-border/80 md:hidden"
    >
      <ul className="grid grid-cols-5">
        {items.map(({ key, short, label, icon: Icon, badge }) => {
          const isActive = key === active
          return (
            <li key={key}>
              <button
                type="button"
                onClick={() => onChange(key)}
                aria-current={isActive ? "page" : undefined}
                aria-label={label}
                className={cn(
                  "relative flex h-14 w-full flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors active:bg-secondary/60",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
              >
                <span
                  className={cn(
                    "absolute inset-x-4 top-0 h-0.5 rounded-b bg-primary transition-opacity",
                    isActive ? "opacity-100" : "opacity-0",
                  )}
                  aria-hidden
                />
                <span className="relative">
                  <Icon className="size-5" aria-hidden />
                  {badge && (
                    <span
                      className="absolute -right-1.5 -top-1 size-2 rounded-full bg-critical ring-2 ring-background"
                      aria-hidden
                    />
                  )}
                </span>
                <span className="font-mono uppercase tracking-wider">{short}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
