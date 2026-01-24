import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import {
  getSrpRequestsByCharacterIds,
  getSrpEligibleFleets,
  getCharactersByUserId,
} from "@/data-access"
import { SrpListPanel } from "@/components/dashboard/srp-list-panel"

export default async function SrpPage() {
  const session = await getSession()

  if (!session.allianceId) {
    redirect("/dashboard")
  }

  const characters = await getCharactersByUserId(session.userId)
  const characterIds = characters.map((c) => c.id)

  const [srpRequests, srpFleets] = await Promise.all([
    getSrpRequestsByCharacterIds(characterIds),
    getSrpEligibleFleets(session.allianceId),
  ])

  return (
    <SrpListPanel
      srpRequests={srpRequests}
      srpFleets={srpFleets}
      characterIds={characterIds}
    />
  )
}
