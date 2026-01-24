import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import {
  getUpcomingFleetsByAllianceId,
  getDoctrinesByAllianceId,
  getCharactersByAllianceId,
} from "@/data-access"
import { FleetsListPanel } from "@/components/dashboard/fleets-list-panel"

export default async function FleetsPage() {
  const session = await getSession()

  if (!session.allianceId) {
    redirect("/dashboard")
  }

  const [fleets, doctrines, allianceMembers] = await Promise.all([
    getUpcomingFleetsByAllianceId(session.allianceId),
    getDoctrinesByAllianceId(session.allianceId),
    getCharactersByAllianceId(session.allianceId),
  ])

  return (
    <FleetsListPanel
      fleets={fleets}
      doctrines={doctrines}
      allianceMembers={allianceMembers.map((m) => ({ id: m.id, name: m.name }))}
    />
  )
}
