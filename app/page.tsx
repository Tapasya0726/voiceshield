import { Dashboard } from "@/components/voiceshield/dashboard"
import { getCalls } from "@/lib/api"
import { mockMetrics } from "@/lib/mock-data"

export default async function Page() {
  // Server-side fetch via the API client (mocked for now; swap for real REST later).
  const recentCalls = await getCalls()

  return <Dashboard metrics={mockMetrics} recentCalls={recentCalls} />
}
