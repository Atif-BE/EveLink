import { getSession } from "@/lib/session"
import {
  getCorporationInfo,
  getAllianceInfo,
  getCharacterInfo,
  getRaceById,
  getBloodlineById,
  getAggregateWealth,
  getAggregateKillmails,
} from "@/lib/esi"
import { getCharactersByUserId } from "@/data-access"
import { CharacterCard } from "@/components/eve/character-card"
import { AssociatedCharactersPanel } from "@/components/dashboard/associated-characters-panel"
import { QuickStatsPanel } from "@/components/dashboard/quick-stats-panel"
import { CorporationOverviewCard } from "@/components/dashboard/corporation-overview-card"
import { WealthCard } from "@/components/dashboard/wealth-card"
import { KillmailsPanel } from "@/components/dashboard/killmails-panel"
import { eveImageUrl } from "@/types/eve"
import type {
  CharacterDisplay,
  CorporationDisplay,
  AllianceDisplay,
} from "@/types/eve"

export default async function DashboardPage() {
  const session = await getSession()

  const [corpInfo, allianceInfo, charInfo, linkedCharacters, wealth, killmails] = await Promise.all([
    getCorporationInfo(session.corporationId),
    session.allianceId ? getAllianceInfo(session.allianceId) : null,
    getCharacterInfo(session.characterId),
    session.userId ? getCharactersByUserId(session.userId) : [],
    session.userId ? getAggregateWealth(session.userId) : { total: 0, characters: [], incomplete: false },
    session.userId ? getAggregateKillmails(session.userId, 5) : { kills: [], losses: [], incomplete: false },
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
    <div className="flex gap-6">
      <div className="flex-1 space-y-6">
        <CharacterCard
          character={character}
          corporation={corporation}
          alliance={alliance}
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <QuickStatsPanel
            className="md:col-span-1"
            securityStatus={charInfo.security_status ?? 0}
            birthday={new Date(charInfo.birthday)}
            raceName={raceInfo?.name ?? "Unknown"}
            bloodlineName={bloodlineInfo?.name ?? "Unknown"}
          />
          <WealthCard className="md:col-span-2" wealth={wealth} />
        </div>
        <CorporationOverviewCard
          corporation={corporation}
          memberCount={corpInfo.member_count}
          taxRate={corpInfo.tax_rate}
          ceoName={ceoInfo.name}
        />
        <KillmailsPanel
          kills={killmails.kills}
          losses={killmails.losses}
          incomplete={killmails.incomplete}
        />
      </div>
      <div className="hidden w-64 shrink-0 lg:block">
        <div className="sticky top-6">
          <AssociatedCharactersPanel
            characters={linkedCharsWithCorpNames}
            activeCharacterId={session.characterId}
          />
        </div>
      </div>
    </div>
  )
}
