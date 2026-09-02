"use client"

import { useRef, useState } from "react"
import { useLiveCallSimulation } from "@/hooks/use-live-call-simulation"
import type { Call, CallMetrics } from "@/lib/types"
import { AnalysisTimeline } from "./analysis-timeline"
import { DetectionSignals } from "./detection-signals"
import { EvidencePanel } from "./evidence-panel"
import { Header } from "./header"
import { IncomingCall } from "./incoming-call"
import { MetricsRow } from "./metrics-row"
import { RecentCalls } from "./recent-calls"
import { RiskSummary } from "./risk-summary"
import { Sidebar, type NavKey } from "./sidebar"
import { ThreatAssessment } from "./threat-assessment"
import { VoiceAnalysis } from "./voice-analysis"

interface DashboardProps {
  metrics: CallMetrics
  recentCalls: Call[]
}

export function Dashboard({ metrics, recentCalls }: DashboardProps) {
  const [nav, setNav] = useState<NavKey>("live")
  const { state, running, endCall, restart } = useLiveCallSimulation()
  const analysisRef = useRef<HTMLDivElement>(null)
  const live = state.call.status === "CONNECTED"

  const liveMetrics: CallMetrics = { ...metrics, activeCalls: live ? 1 : 0 }

  return (
    <div className="flex min-h-svh flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar active={nav} onChange={setNav} />
        <main className="flex-1 min-w-0 p-4 lg:p-6">
          <div className="mx-auto flex max-w-[1600px] flex-col gap-4">
            <MetricsRow metrics={liveMetrics} />

            {/* Primary row: call + threat */}
            <div className="grid gap-4 xl:grid-cols-12">
              <div className="xl:col-span-4">
                <IncomingCall
                  call={state.call}
                  level={state.assessment.level}
                  running={running}
                  onEndCall={endCall}
                  onRestart={restart}
                  onViewAnalysis={() => analysisRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
                />
              </div>
              <div className="xl:col-span-5">
                <ThreatAssessment assessment={state.assessment} />
              </div>
              <div className="xl:col-span-3">
                <RiskSummary assessment={state.assessment} />
              </div>
            </div>

            {/* Analysis row */}
            <div ref={analysisRef} className="grid gap-4 scroll-mt-20 xl:grid-cols-12">
              <div className="xl:col-span-7">
                <VoiceAnalysis
                  voice={state.voice}
                  duration={state.call.duration}
                  level={state.assessment.level}
                  live={live}
                />
              </div>
              <div className="xl:col-span-5">
                <DetectionSignals signals={state.signals} />
              </div>
            </div>

            {/* Evidence + timeline */}
            <div className="grid gap-4 xl:grid-cols-12">
              <div className="xl:col-span-7">
                <EvidencePanel evidence={state.evidence} />
              </div>
              <div className="xl:col-span-5">
                <AnalysisTimeline events={state.timeline} live={live} />
              </div>
            </div>

            <RecentCalls calls={recentCalls} liveCall={state.call} />

            <p className="pb-2 text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground/70">
              Demo mode · simulated telemetry · no ML backend connected
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}
