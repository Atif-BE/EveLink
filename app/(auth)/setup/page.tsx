import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { getAllianceRegistration } from "@/data-access"
import { getAllianceInfo, getCorporationInfo } from "@/lib/esi"
import { canRegisterAlliance } from "@/lib/admin"
import { SetupForm } from "./setup-form"

export default async function SetupPage() {
  const session = await getSession()

  if (!session.isLoggedIn || !session.allianceId) {
    redirect("/login")
  }

  const allianceId = session.allianceId

  // Already registered — go to dashboard
  const existing = await getAllianceRegistration(allianceId)
  if (existing) {
    redirect("/dashboard")
  }

  // Verify eligibility
  const eligible = await canRegisterAlliance(session.characterId, allianceId)
  if (!eligible) {
    redirect("/login?error=alliance_not_registered")
  }

  // Fetch display info
  const allianceInfo = await getAllianceInfo(allianceId)
  const executorCorpInfo = allianceInfo.executor_corporation_id
    ? await getCorporationInfo(allianceInfo.executor_corporation_id)
    : null

  return (
    <SetupForm
      allianceName={allianceInfo.name}
      allianceTicker={allianceInfo.ticker}
      executorCorpName={executorCorpInfo?.name ?? "Unknown"}
      characterName={session.characterName}
    />
  )
}
