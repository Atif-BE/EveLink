import { getAllianceInfo, getCorporationInfo } from "@/lib/esi"

export function isAdminCharacter(characterId: number): boolean {
  const adminIds =
    process.env.ADMIN_CHARACTER_IDS?.split(",").map((id) =>
      parseInt(id.trim(), 10)
    ) ?? []
  return adminIds.includes(characterId)
}

export async function canRegisterAlliance(
  characterId: number,
  allianceId: number
): Promise<boolean> {
  if (isAdminCharacter(characterId)) return true

  const allianceInfo = await getAllianceInfo(allianceId)
  if (!allianceInfo.executor_corporation_id) return false
  const corpInfo = await getCorporationInfo(
    allianceInfo.executor_corporation_id
  )
  return characterId === corpInfo.ceo_id
}
