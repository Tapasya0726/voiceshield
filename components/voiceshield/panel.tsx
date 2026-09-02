import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface PanelProps {
  title?: string
  eyebrow?: string
  action?: ReactNode
  className?: string
  contentClassName?: string
  children: ReactNode
}

export function Panel({ title, eyebrow, action, className, contentClassName, children }: PanelProps) {
  return (
    <section
      className={cn(
        "glass flex flex-col rounded-lg border border-border/80 shadow-[0_1px_0_0_oklch(1_0_0/4%)_inset]",
        className,
      )}
    >
      {(title || action) && (
        <header className="flex items-center justify-between gap-3 border-b border-border/80 px-4 py-2.5">
          <div className="flex flex-col">
            {eyebrow && (
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {eyebrow}
              </span>
            )}
            {title && (
              <h2 className="font-mono text-xs font-medium uppercase tracking-wider text-foreground">
                {title}
              </h2>
            )}
          </div>
          {action}
        </header>
      )}
      <div className={cn("flex-1 p-4", contentClassName)}>{children}</div>
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
        "inline-flex items-center gap-1.5 rounded-sm border px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider",
        tone,
        className,
      )}
    >
      {pulse && <span className="size-1.5 rounded-full bg-current animate-pulse" aria-hidden />}
      {children}
    </span>
  )
}
