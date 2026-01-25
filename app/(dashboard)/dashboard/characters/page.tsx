import { getSession } from "@/lib/session"
import { getCharactersByUserId, getUserPrimaryCharacterId } from "@/data-access"
import {
  getCorporationInfo,
  getAllianceInfo,
  getCharacterSkillQueue,
  getCharacterSkills,
  getCharacterWallet,
  getTypeName,
  inferCloneState,
} from "@/lib/esi"
import { getValidAccessToken } from "@/lib/tokens"
import { CharactersListPanel } from "@/components/dashboard/characters-list-panel"
import type { CharacterOverviewData } from "@/components/dashboard/character-overview-card"
import type { CorporationDisplay, AllianceDisplay } from "@/types/eve"
import { eveImageUrl } from "@/types/eve"

const fetchCharacterOverviewData = async (
  character: Awaited<ReturnType<typeof getCharactersByUserId>>[0]
): Promise<CharacterOverviewData> => {
  const token = await getValidAccessToken(character.id)

  const [corpInfo, allianceInfo] = await Promise.all([
    getCorporationInfo(character.corporationId),
    character.allianceId ? getAllianceInfo(character.allianceId) : null,
  ])

  const corporation: CorporationDisplay = {
    id: character.corporationId,
    name: corpInfo.name,
    ticker: corpInfo.ticker,
    logo: eveImageUrl.corporation(character.corporationId, 64),
  }

  const alliance: AllianceDisplay | null = allianceInfo && character.allianceId
    ? {
        id: character.allianceId,
        name: allianceInfo.name,
        ticker: allianceInfo.ticker,
        logo: eveImageUrl.alliance(character.allianceId, 64),
      }
    : null

  let totalSp = 0
  let unallocatedSp = 0
  let walletBalance: number | null = null
  let cloneState: "omega" | "alpha" | "unknown" = "unknown"
  let currentSkillName: string | null = null
  let currentSkillLevel: number | null = null
  let currentSkillFinishDate: string | null = null

  if (token) {
    const [skills, skillQueue, wallet] = await Promise.all([
      getCharacterSkills(character.id, token),
      getCharacterSkillQueue(character.id, token),
      getCharacterWallet(character.id, token).catch(() => null),
    ])

    if (skills) {
      totalSp = skills.total_sp
      unallocatedSp = skills.unallocated_sp ?? 0
    }

    walletBalance = wallet

    cloneState = inferCloneState(skillQueue)

    const currentTraining = skillQueue.find(
      (entry) => entry.queue_position === 0 && entry.finish_date
    )
    if (currentTraining) {
      currentSkillName = await getTypeName(currentTraining.skill_id)
      currentSkillLevel = currentTraining.finished_level
      currentSkillFinishDate = currentTraining.finish_date ?? null
    }
  }

  return {
    characterId: character.id,
    characterName: character.name,
    corporation,
    alliance,
    totalSp,
    unallocatedSp,
    walletBalance,
    securityStatus: character.securityStatus,
    lastLoginAt: character.lastLoginAt,
    cloneState,
    currentSkillName,
    currentSkillLevel,
    currentSkillFinishDate,
  }
}

export default async function CharactersPage() {
  const session = await getSession()

  const [characters, primaryCharacterId] = await Promise.all([
    session.userId ? getCharactersByUserId(session.userId) : [],
    session.userId ? getUserPrimaryCharacterId(session.userId) : null,
  ])

  const characterData = await Promise.all(
    characters.map((char) => fetchCharacterOverviewData(char))
  )

  const sortedCharacterData = characterData.sort((a, b) => {
    if (a.characterId === primaryCharacterId) return -1
    if (b.characterId === primaryCharacterId) return 1
    return 0
  })

  return (
    <CharactersListPanel
      characters={sortedCharacterData}
      primaryCharacterId={primaryCharacterId}
    />
  )
}
