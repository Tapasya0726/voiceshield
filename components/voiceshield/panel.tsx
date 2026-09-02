import type { CSSProperties, ReactNode } from "react"
import { cn } from "@/lib/utils"

interface PanelProps {
  title?: string
  eyebrow?: string
  action?: ReactNode
  className?: string
  contentClassName?: string
  /** Elevate this panel as a visual focal point. Pass a CSS color for the accent hairline. */
  focal?: string
  children: ReactNode
}

export function Panel({ title, eyebrow, action, className, contentClassName, focal, children }: PanelProps) {
  return (
    <section
      style={focal ? ({ "--focal": focal } as CSSProperties) : undefined}
      className={cn(
        "glass relative flex min-w-0 flex-col rounded-lg border border-border/80 shadow-[0_1px_0_0_oklch(1_0_0/4%)_inset] transition-[border-color,box-shadow] duration-300",
        focal ? "focal" : "hover:border-border",
        className,
      )}
    >
      {(title || action) && (
        <header className="flex min-w-0 flex-wrap items-center justify-between gap-x-3 gap-y-1.5 border-b border-border/70 px-4 py-2.5 sm:flex-nowrap">
          <div className="flex min-w-0 flex-col">
            {eyebrow && (
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/80">
                {eyebrow}
              </span>
            )}
            {title && (
              <h2 className="truncate font-mono text-xs font-medium uppercase tracking-wider text-foreground">
                {title}
              </h2>
            )}
          </div>
          {action && <div className="flex min-w-0 shrink-0 items-center">{action}</div>}
        </header>
      )}
      <div className={cn("min-w-0 flex-1 p-4", contentClassName)}>{children}</div>
    </section>
  )
}

export function StatusBadge({
  children,
  tone,
  className,
  pulse,
}: {
  children: ReactNode
  tone: string
  className?: string
  pulse?: boolean
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-sm border px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider transition-colors duration-300",
        tone,
        className,
      )}
    >
      {pulse && <span className="size-1.5 rounded-full bg-current animate-pulse" aria-hidden />}
      {children}
    </span>
  )
}

/** Small mono key label used above values throughout the dashboard. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("font-mono text-[10px] uppercase tracking-widest text-muted-foreground", className)}>
      {children}
    </span>
  )
}
