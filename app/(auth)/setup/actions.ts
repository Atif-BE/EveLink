"use server"

import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { getAllianceRegistration, registerAlliance } from "@/data-access"
import { getAllianceInfo, getCorporationInfo } from "@/lib/esi"
import { canRegisterAlliance } from "@/lib/admin"

export async function registerAllianceAction() {
  const session = await getSession()

  if (!session.isLoggedIn || !session.allianceId) {
    redirect("/login")
  }

  const allianceId = session.allianceId

  const existing = await getAllianceRegistration(allianceId)
  if (existing) {
    redirect("/dashboard")
  }

  const eligible = await canRegisterAlliance(session.characterId, allianceId)
  if (!eligible) {
    redirect("/login?error=alliance_not_registered")
  }

  const allianceInfo = await getAllianceInfo(allianceId)

  await registerAlliance({
    id: allianceId,
    name: allianceInfo.name,
    ticker: allianceInfo.ticker,
    executorCorpId: allianceInfo.executor_corporation_id ?? 0,
    registeredById: session.characterId,
  })

  session.isAllianceAdmin = true
  await session.save()

  redirect("/dashboard")
}
