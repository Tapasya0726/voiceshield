"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import {
  LIVE_CALL_ID,
  mockEvidence,
  mockLiveCall,
  scriptedTimeline,
} from "@/lib/mock-data"
import type {
  DetectionSignal,
  Evidence,
  LiveCallState,
  SignalStatus,
  ThreatLevel,
  TimelineEvent,
  VoiceAnalysis,
} from "@/lib/types"

/**
 * Simulates the WS /api/calls/:id/live stream.
 * Replace with `subscribeToLiveCall` from lib/api when the backend exists.
 */

interface Phase {
  until: number
  level: ThreatLevel
  synthetic: number
  reliability: number
  confidence: number
}

// Scripted analysis arc. Values are targets the simulation eases toward.
const PHASES: Phase[] = [
  { until: 3, level: "SAFE", synthetic: 14, reliability: 42, confidence: 55 },
  { until: 6, level: "SAFE", synthetic: 38, reliability: 61, confidence: 70 },
  { until: 9, level: "SUSPICIOUS", synthetic: 72, reliability: 84, confidence: 88 },
  { until: 20, level: "SUSPICIOUS", synthetic: 87.4, reliability: 92.1, confidence: 94.6 },
  { until: 30, level: "FAKE", synthetic: 94.2, reliability: 95.3, confidence: 97.1 },
  { until: Infinity, level: "CRITICAL", synthetic: 98.3, reliability: 97.6, confidence: 98.8 },
]

const ACTION_BY_LEVEL: Record<ThreatLevel, string> = {
  SAFE: "No action required",
  SUSPICIOUS: "Proceed with caution",
  FAKE: "Do not share personal information",
  CRITICAL: "Terminate call immediately",
}

function phaseFor(t: number): Phase {
  return PHASES.find((p) => t < p.until) ?? PHASES[PHASES.length - 1]
}

function ease(current: number, target: number, rate = 0.35) {
  return current + (target - current) * rate
}

function jitter(v: number, amt: number, min = 0, max = 100) {
  const n = v + (Math.random() - 0.5) * amt
  return Math.min(max, Math.max(min, n))
}

function statusFromProbability(p: number): SignalStatus {
  if (p >= 80) return "HIGH"
  if (p >= 50) return "MEDIUM"
  return "LOW"
}

function buildSignals(synthetic: number, level: ThreatLevel): DetectionSignal[] {
  const hot = level !== "SAFE"
  const severe = level === "FAKE" || level === "CRITICAL"
  return [
    {
      id: "sig_synth",
      label: "Synthetic voice probability",
      value: `${synthetic.toFixed(1)}%`,
      status: statusFromProbability(synthetic),
    },
    {
      id: "sig_embed",
      label: "Voice embedding anomaly",
      value: hot ? "HIGH" : "LOW",
      status: hot ? "HIGH" : "LOW",
    },
    {
      id: "sig_prosody",
      label: "Prosody consistency",
      value: hot ? "LOW" : "HIGH",
      // Status expresses risk: low consistency is a HIGH-risk signal.
      status: hot ? "HIGH" : "LOW",
    },
    {
      id: "sig_spectral",
      label: "Spectral artifacts",
      value: synthetic > 60 ? "DETECTED" : "NONE",
      status: synthetic > 60 ? "DETECTED" : "LOW",
    },
    {
      id: "sig_speaker",
      label: "Speaker consistency",
      value: severe ? "FAILED" : hot ? "SUSPICIOUS" : "STABLE",
      status: severe ? "HIGH" : hot ? "SUSPICIOUS" : "LOW",
    },
    {
      id: "sig_bg",
      label: "Background anomaly",
      value: "LOW",
      status: "LOW",
    },
  ]
}

function buildVoice(t: number, level: ThreatLevel, speechEvents: number[]): VoiceAnalysis {
  const hot = level !== "SAFE"
  return {
    speechActivity: t % 3 === 2 ? "IDLE" : "ACTIVE",
    audioQuality: "GOOD",
    voiceConsistency: hot ? "LOW" : "HIGH",
    syntheticIndicators: level === "SAFE" ? (t > 3 ? "POSSIBLE" : "NONE") : "DETECTED",
    speechEvents,
  }
}

function buildEvidence(t: number, reliability: number): Evidence[] {
  // Evidence reveals progressively as the analysis matures.
  const revealAt = [4, 6, 8, 10]
  return mockEvidence
    .filter((_, i) => t >= revealAt[i])
    .map((e) => ({
      ...e,
      reliability: Math.round(Math.min(99, e.reliability * (reliability / 92.1))),
    }))
}

function initialState(): LiveCallState {
  return {
    call: { ...mockLiveCall, startedAt: new Date().toISOString() },
    assessment: {
      callId: LIVE_CALL_ID,
      level: "SAFE",
      syntheticProbability: 8,
      evidenceReliability: 30,
      confidence: 40,
      riskScore: 8,
      recommendedAction: ACTION_BY_LEVEL.SAFE,
      updatedAt: new Date().toISOString(),
    },
    signals: buildSignals(8, "SAFE"),
    evidence: [],
    timeline: [scriptedTimeline[0]],
    voice: buildVoice(0, "SAFE", []),
  }
}

export function useLiveCallSimulation() {
  const [state, setState] = useState<LiveCallState>(initialState)
  const [running, setRunning] = useState(true)
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!running) return
    tickRef.current = setInterval(() => {
      setState((prev) => {
        const t = prev.call.duration + 1
        const phase = phaseFor(t)

        const synthetic = jitter(ease(prev.assessment.syntheticProbability, phase.synthetic), 1.2)
        const reliability = jitter(ease(prev.assessment.evidenceReliability, phase.reliability), 0.8)
        const confidence = jitter(ease(prev.assessment.confidence, phase.confidence), 0.6)

        // Speech events: caller says "hello..." roughly every 1.5s
        const speechEvents =
          t % 3 !== 2 ? [...prev.voice.speechEvents, t - 0.6, t - 0.1] : prev.voice.speechEvents

        const timeline: TimelineEvent[] = scriptedTimeline.filter((e) => e.at <= t)
        if (phase.level !== prev.assessment.level && t > 10) {
          timeline.push({
            id: `tl_dyn_${t}`,
            at: t,
            label: `Threat classification: ${phase.level}`,
            kind: "alert",
          })
        }
        // Preserve previously added dynamic events
        const dynamic = prev.timeline.filter((e) => e.id.startsWith("tl_dyn_"))
        const merged = [...timeline, ...dynamic.filter((d) => !timeline.some((e) => e.id === d.id))]
          .sort((a, b) => a.at - b.at)

        return {
          call: {
            ...prev.call,
            duration: t,
            classification: phase.level,
            syntheticProbability: synthetic,
            evidenceReliability: reliability,
          },
          assessment: {
            ...prev.assessment,
            level: phase.level,
            syntheticProbability: synthetic,
            evidenceReliability: reliability,
            confidence,
            riskScore: Math.round(synthetic),
            recommendedAction: ACTION_BY_LEVEL[phase.level],
            updatedAt: new Date().toISOString(),
          },
          signals: buildSignals(synthetic, phase.level),
          evidence: buildEvidence(t, reliability),
          timeline: merged,
          voice: buildVoice(t, phase.level, speechEvents),
        }
      })
    }, 1000)

    return () => {
      if (tickRef.current) clearInterval(tickRef.current)
    }
  }, [running])

  const endCall = useCallback(() => {
    setRunning(false)
    setState((prev) => ({
      ...prev,
      call: { ...prev.call, status: "ENDED" },
      voice: { ...prev.voice, speechActivity: "IDLE" },
      timeline: [
        ...prev.timeline,
        { id: "tl_end", at: prev.call.duration, label: "Call ended by user", kind: "info" },
      ],
    }))
  }, [])

  const restart = useCallback(() => {
    setState(initialState())
    setRunning(true)
  }, [])

  return { state, running, endCall, restart }
}
