import { getSession } from "@/lib/session"
import {
  getCorporationInfo,
  getAllianceInfo,
  getCharacterInfo,
  getRaceById,
  getBloodlineById,
} from "@/lib/esi"
import { getCharactersByUserId } from "@/db/queries"
import { CharacterCard } from "@/components/eve/character-card"
import { AssociatedCharactersPanel } from "@/components/dashboard/associated-characters-panel"
import { QuickStatsPanel } from "@/components/dashboard/quick-stats-panel"
import { CorporationOverviewCard } from "@/components/dashboard/corporation-overview-card"
import { eveImageUrl } from "@/types/eve"
import type {
  CharacterDisplay,
  CorporationDisplay,
  AllianceDisplay,
} from "@/types/eve"

export default async function DashboardPage() {
  const session = await getSession()

  const [corpInfo, allianceInfo, charInfo, linkedCharacters] = await Promise.all([
    getCorporationInfo(session.corporationId),
    session.allianceId ? getAllianceInfo(session.allianceId) : null,
    getCharacterInfo(session.characterId),
    session.userId ? getCharactersByUserId(session.userId) : [],
  ])

  const [ceoInfo, raceInfo, bloodlineInfo] = await Promise.all([
    getCharacterInfo(corpInfo.ceo_id),
    charInfo.race_id ? getRaceById(charInfo.race_id) : null,
    charInfo.bloodline_id ? getBloodlineById(charInfo.bloodline_id) : null,
  ])

  const character: CharacterDisplay = {
    id: session.characterId,
    name: session.characterName,
    portrait: eveImageUrl.character(session.characterId, 128),
  }

  const corporation: CorporationDisplay = {
    id: session.corporationId,
    name: corpInfo.name,
    ticker: corpInfo.ticker,
    logo: eveImageUrl.corporation(session.corporationId, 64),
  }

  const alliance: AllianceDisplay | null = allianceInfo
    ? {
      id: session.allianceId!,
      name: allianceInfo.name,
      ticker: allianceInfo.ticker,
      logo: eveImageUrl.alliance(session.allianceId!, 64),
    }
    : null

  const linkedCharsWithCorpNames = await Promise.all(
    linkedCharacters.map(async (char) => {
      const corpData = await getCorporationInfo(char.corporationId)
      return {
        id: char.id,
        name: char.name,
        corporationName: corpData.name,
      }
    })
  )

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <CharacterCard
          character={character}
          corporation={corporation}
          alliance={alliance}
        />
      </div>

      <div>
        <AssociatedCharactersPanel
          characters={linkedCharsWithCorpNames}
          activeCharacterId={session.characterId}
        />
      </div>

      <div className="lg:col-span-1">
        <QuickStatsPanel
          securityStatus={charInfo.security_status ?? 0}
          birthday={new Date(charInfo.birthday)}
          raceName={raceInfo?.name ?? "Unknown"}
          bloodlineName={bloodlineInfo?.name ?? "Unknown"}
        />
      </div>

      <div className="lg:col-span-2">
        <CorporationOverviewCard
          corporation={corporation}
          memberCount={corpInfo.member_count}
          taxRate={corpInfo.tax_rate}
          ceoName={ceoInfo.name}
        />
      </div>
    </div>
  )
}
