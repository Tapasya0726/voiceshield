export type ThreatLevel = "SAFE" | "SUSPICIOUS" | "FAKE" | "CRITICAL"

export type SignalStatus = "LOW" | "MEDIUM" | "HIGH" | "DETECTED" | "SUSPICIOUS"

export type Severity = "low" | "medium" | "high" | "critical"

export type CallStatus = "RINGING" | "CONNECTED" | "ENDED"

export interface Call {
  id: string
  phoneNumber: string
  callerName: string
  status: CallStatus
  startedAt: string
  /** Duration in seconds */
  duration: number
  classification: ThreatLevel
  syntheticProbability: number
  evidenceReliability: number
}

export interface ThreatAssessment {
  callId: string
  level: ThreatLevel
  /** 0-100 */
  syntheticProbability: number
  /** 0-100 */
  evidenceReliability: number
  /** 0-100 */
  confidence: number
  /** 0-100 */
  riskScore: number
  recommendedAction: string
  updatedAt: string
}

export interface DetectionSignal {
  id: string
  label: string
  /** Formatted value, e.g. "87.4%" or "HIGH" */
  value: string
  status: SignalStatus
}

export interface Evidence {
  id: string
  index: number
  description: string
  /** 0-100 */
  reliability: number
  severity: Severity
  icon: "waveform" | "fingerprint" | "activity" | "repeat" | "radio" | "cpu"
}

export interface TimelineEvent {
  id: string
  /** Offset from call start, in seconds */
  at: number
  label: string
  kind: "info" | "warning" | "alert"
}

export interface CallMetrics {
  activeCalls: number
  callsAnalyzedToday: number
  suspiciousCalls: number
  syntheticVoicesDetected: number
  criticalAlerts: number
  /** 0-100 */
  detectionAccuracy: number
}

export interface VoiceAnalysis {
  speechActivity: "ACTIVE" | "IDLE"
  audioQuality: "GOOD" | "FAIR" | "POOR"
  voiceConsistency: "HIGH" | "MEDIUM" | "LOW"
  syntheticIndicators: "NONE" | "POSSIBLE" | "DETECTED"
  /** Seconds since call start where speech segments were detected */
  speechEvents: number[]
}

export interface LiveCallState {
  call: Call
  assessment: ThreatAssessment
  signals: DetectionSignal[]
  evidence: Evidence[]
  timeline: TimelineEvent[]
  voice: VoiceAnalysis
}
