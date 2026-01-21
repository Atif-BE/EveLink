import { getSession } from "@/lib/session"
import { getCorporationInfo, getAllianceInfo } from "@/lib/esi"
import { CharacterCard } from "@/components/eve/character-card"
import { eveImageUrl } from "@/types/eve"
import type {
  CharacterDisplay,
  CorporationDisplay,
  AllianceDisplay,
} from "@/types/eve"

export default async function DashboardPage() {
  const session = await getSession()

  // Fetch corporation and alliance info in parallel
  const [corpInfo, allianceInfo] = await Promise.all([
    getCorporationInfo(session.corporationId),
    session.allianceId ? getAllianceInfo(session.allianceId) : null,
  ])

  // Build display objects
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

  return (
    <div className="space-y-8">
      <CharacterCard
        character={character}
        corporation={corporation}
        alliance={alliance}
      />

      <div className="rounded-lg border border-eve-border bg-eve-deep/50 p-6 backdrop-blur">
        <h3 className="font-display text-lg font-semibold text-eve-text-primary">
          Dashboard
        </h3>
        <p className="mt-2 font-body text-sm text-eve-text-muted">
          Alliance management features coming soon...
        </p>
      </div>
    </div>
  )
}
