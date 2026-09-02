import type {
  Call,
  CallMetrics,
  DetectionSignal,
  Evidence,
  ThreatAssessment,
  TimelineEvent,
  VoiceAnalysis,
} from "./types"

export const LIVE_CALL_ID = "call_7f3a9c"

export const mockLiveCall: Call = {
  id: LIVE_CALL_ID,
  phoneNumber: "+1 (555) 019-4827",
  callerName: "Unknown Caller",
  status: "CONNECTED",
  startedAt: new Date().toISOString(),
  duration: 0,
  classification: "SAFE",
  syntheticProbability: 12.0,
  evidenceReliability: 40.0,
}

export const mockAssessment: ThreatAssessment = {
  callId: LIVE_CALL_ID,
  level: "SUSPICIOUS",
  syntheticProbability: 87.4,
  evidenceReliability: 92.1,
  confidence: 94.6,
  riskScore: 87,
  recommendedAction: "Proceed with caution",
  updatedAt: new Date().toISOString(),
}

export const mockSignals: DetectionSignal[] = [
  { id: "sig_synth", label: "Synthetic voice probability", value: "87.4%", status: "HIGH" },
  { id: "sig_embed", label: "Voice embedding anomaly", value: "HIGH", status: "HIGH" },
  { id: "sig_prosody", label: "Prosody consistency", value: "LOW", status: "LOW" },
  { id: "sig_spectral", label: "Spectral artifacts", value: "DETECTED", status: "DETECTED" },
  { id: "sig_speaker", label: "Speaker consistency", value: "SUSPICIOUS", status: "SUSPICIOUS" },
  { id: "sig_bg", label: "Background anomaly", value: "LOW", status: "LOW" },
]

export const mockEvidence: Evidence[] = [
  {
    id: "ev_1",
    index: 1,
    description: "Synthetic voice characteristics detected",
    reliability: 94,
    severity: "high",
    icon: "waveform",
  },
  {
    id: "ev_2",
    index: 2,
    description: "Abnormal voice embedding similarity",
    reliability: 91,
    severity: "high",
    icon: "fingerprint",
  },
  {
    id: "ev_3",
    index: 3,
    description: "Prosodic pattern inconsistent with natural speech",
    reliability: 88,
    severity: "medium",
    icon: "activity",
  },
  {
    id: "ev_4",
    index: 4,
    description: "Repeated speech with no conversational response detected",
    reliability: 96,
    severity: "critical",
    icon: "repeat",
  },
]

/** Scripted timeline for the demo call. Events appear when `at` <= call duration. */
export const scriptedTimeline: TimelineEvent[] = [
  { id: "tl_0", at: 0, label: "Call connected", kind: "info" },
  { id: "tl_1", at: 2, label: "Voice detected", kind: "info" },
  { id: "tl_2", at: 4, label: "Speech pattern analyzed", kind: "info" },
  { id: "tl_3", at: 6, label: "Synthetic voice probability increased", kind: "warning" },
  { id: "tl_4", at: 8, label: "Synthetic voice indicators detected", kind: "warning" },
  { id: "tl_5", at: 10, label: "Threat classification: SUSPICIOUS", kind: "alert" },
  { id: "tl_6", at: 14, label: "Repeated phrase pattern confirmed", kind: "warning" },
  { id: "tl_7", at: 18, label: "Evidence reliability stabilized", kind: "info" },
]

export const mockVoice: VoiceAnalysis = {
  speechActivity: "ACTIVE",
  audioQuality: "GOOD",
  voiceConsistency: "LOW",
  syntheticIndicators: "DETECTED",
  speechEvents: [],
}

export const mockMetrics: CallMetrics = {
  activeCalls: 1,
  callsAnalyzedToday: 128,
  suspiciousCalls: 17,
  syntheticVoicesDetected: 9,
  criticalAlerts: 3,
  detectionAccuracy: 94.8,
}

export const mockRecentCalls: Call[] = [
  {
    id: LIVE_CALL_ID,
    phoneNumber: "+1 (555) 019-4827",
    callerName: "Unknown Caller",
    status: "CONNECTED",
    startedAt: "10:42",
    duration: 10,
    classification: "SUSPICIOUS",
    syntheticProbability: 87.4,
    evidenceReliability: 92.1,
  },
  {
    id: "call_2b81e0",
    phoneNumber: "+1 (555) 013-2841",
    callerName: "Sarah Mitchell",
    status: "ENDED",
    startedAt: "10:31",
    duration: 161,
    classification: "SAFE",
    syntheticProbability: 4.2,
    evidenceReliability: 96.8,
  },
  {
    id: "call_9d4c17",
    phoneNumber: "+1 (555) 017-9912",
    callerName: "Unknown Caller",
    status: "ENDED",
    startedAt: "10:18",
    duration: 83,
    classification: "FAKE",
    syntheticProbability: 94.7,
    evidenceReliability: 93.2,
  },
  {
    id: "call_51aa03",
    phoneNumber: "+1 (555) 012-8843",
    callerName: "Unknown Caller",
    status: "ENDED",
    startedAt: "09:55",
    duration: 48,
    classification: "CRITICAL",
    syntheticProbability: 98.1,
    evidenceReliability: 97.4,
  },
  {
    id: "call_c07e42",
    phoneNumber: "+1 (555) 014-6620",
    callerName: "David Chen",
    status: "ENDED",
    startedAt: "09:37",
    duration: 312,
    classification: "SAFE",
    syntheticProbability: 2.8,
    evidenceReliability: 98.1,
  },
]
