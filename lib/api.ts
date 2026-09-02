/**
 * VoiceShield API client.
 *
 * FRONTEND PROTOTYPE: these functions currently resolve mocked data and do NOT
 * perform network requests. When the backend is ready, replace the bodies with
 * `fetch()` calls against the documented endpoints. Component code consumes the
 * typed return values, so the swap is transparent to the UI.
 *
 * Endpoints (planned):
 *   GET /api/calls                 -> Call[]
 *   GET /api/calls/:id             -> Call
 *   GET /api/calls/:id/analysis    -> { assessment, signals, voice }
 *   GET /api/calls/:id/evidence    -> Evidence[]
 *   WS  /api/calls/:id/live        -> LiveCallState stream
 */

import {
  mockAssessment,
  mockEvidence,
  mockLiveCall,
  mockRecentCalls,
  mockSignals,
  mockVoice,
} from "./mock-data"
import type {
  Call,
  DetectionSignal,
  Evidence,
  LiveCallState,
  ThreatAssessment,
  VoiceAnalysis,
} from "./types"

export const API_ENDPOINTS = {
  calls: "/api/calls",
  call: (id: string) => `/api/calls/${id}`,
  analysis: (id: string) => `/api/calls/${id}/analysis`,
  evidence: (id: string) => `/api/calls/${id}/evidence`,
  live: (id: string) => `/api/calls/${id}/live`,
} as const

export const DEMO_MODE = true

function delay<T>(value: T, ms = 120): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

export async function getCalls(): Promise<Call[]> {
  // TODO: return fetch(API_ENDPOINTS.calls).then(r => r.json())
  return delay(mockRecentCalls)
}

export async function getCall(id: string): Promise<Call> {
  // TODO: return fetch(API_ENDPOINTS.call(id)).then(r => r.json())
  return delay(mockRecentCalls.find((c) => c.id === id) ?? mockLiveCall)
}

export interface CallAnalysisResponse {
  assessment: ThreatAssessment
  signals: DetectionSignal[]
  voice: VoiceAnalysis
}

export async function getCallAnalysis(_id: string): Promise<CallAnalysisResponse> {
  // TODO: return fetch(API_ENDPOINTS.analysis(id)).then(r => r.json())
  return delay({ assessment: mockAssessment, signals: mockSignals, voice: mockVoice })
}

export async function getCallEvidence(_id: string): Promise<Evidence[]> {
  // TODO: return fetch(API_ENDPOINTS.evidence(id)).then(r => r.json())
  return delay(mockEvidence)
}

/**
 * Subscribe to live call updates. In production this opens a WebSocket at
 * `API_ENDPOINTS.live(id)`. The prototype uses `useLiveCallSimulation` instead.
 */
export function subscribeToLiveCall(
  _id: string,
  _onUpdate: (state: LiveCallState) => void,
): () => void {
  // TODO: const ws = new WebSocket(API_ENDPOINTS.live(id)); ws.onmessage = ...
  return () => {}
}
