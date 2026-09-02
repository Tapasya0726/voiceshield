import type { Severity, SignalStatus, ThreatLevel } from "./types"

export const THREAT_LEVELS: ThreatLevel[] = ["SAFE", "SUSPICIOUS", "FAKE", "CRITICAL"]

export const threatTone: Record<
  ThreatLevel,
  { text: string; bg: string; border: string; ring: string; var: string }
> = {
  SAFE: {
    text: "text-safe",
    bg: "bg-safe/10",
    border: "border-safe/30",
    ring: "stroke-safe",
    var: "var(--safe)",
  },
  SUSPICIOUS: {
    text: "text-suspicious",
    bg: "bg-suspicious/10",
    border: "border-suspicious/30",
    ring: "stroke-suspicious",
    var: "var(--suspicious)",
  },
  FAKE: {
    text: "text-fake",
    bg: "bg-fake/10",
    border: "border-fake/30",
    ring: "stroke-fake",
    var: "var(--fake)",
  },
  CRITICAL: {
    text: "text-critical",
    bg: "bg-critical/10",
    border: "border-critical/30",
    ring: "stroke-critical",
    var: "var(--critical)",
  },
}

export function signalTone(status: SignalStatus): { text: string; dot: string; bg: string } {
  switch (status) {
    case "LOW":
      return { text: "text-safe", dot: "bg-safe", bg: "bg-safe/10" }
    case "MEDIUM":
      return { text: "text-suspicious", dot: "bg-suspicious", bg: "bg-suspicious/10" }
    case "SUSPICIOUS":
      return { text: "text-suspicious", dot: "bg-suspicious", bg: "bg-suspicious/10" }
    case "HIGH":
      return { text: "text-fake", dot: "bg-fake", bg: "bg-fake/10" }
    case "DETECTED":
      return { text: "text-critical", dot: "bg-critical", bg: "bg-critical/10" }
  }
}

export function severityTone(sev: Severity): { text: string; bg: string; label: string } {
  switch (sev) {
    case "low":
      return { text: "text-safe", bg: "bg-safe/10", label: "LOW" }
    case "medium":
      return { text: "text-suspicious", bg: "bg-suspicious/10", label: "MEDIUM" }
    case "high":
      return { text: "text-fake", bg: "bg-fake/10", label: "HIGH" }
    case "critical":
      return { text: "text-critical", bg: "bg-critical/10", label: "CRITICAL" }
  }
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}
