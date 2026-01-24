import { notFound, redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { getFleetById, getRsvpByFleetAndCharacter } from "@/data-access"
import { FleetDetailPanel } from "@/components/dashboard/fleet-detail-panel"

type FleetDetailPageProps = {
  params: Promise<{ id: string }>
}

export default async function FleetDetailPage({ params }: FleetDetailPageProps) {
  const session = await getSession()
  const { id } = await params

  if (!session.allianceId) {
    redirect("/dashboard")
  }

  const fleet = await getFleetById(id)

  if (!fleet || fleet.allianceId !== session.allianceId || !fleet.isActive) {
    notFound()
  }

  const currentRsvp = await getRsvpByFleetAndCharacter(id, session.characterId)

  return <FleetDetailPanel fleet={fleet} currentRsvp={currentRsvp ?? null} />
}
