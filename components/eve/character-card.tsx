import { cn } from "@/lib/utils"
import { CharacterDisplay, CorporationDisplay, AllianceDisplay } from "@/types/eve"
import { CharacterPortrait } from "./character-portrait"
import { CorporationBadge } from "./corporation-badge"
import { AllianceBadge } from "./alliance-badge"

type CharacterCardProps = {
  character: CharacterDisplay
  corporation: CorporationDisplay
  alliance: AllianceDisplay | null
  className?: string
}

export function CharacterCard({
  character,
  corporation,
  alliance,
  className,
}: Readonly<CharacterCardProps>) {
  return (
    <div
      className={cn(
        "flex items-center gap-6 rounded-xl border border-eve-border bg-eve-deep/50 p-6 backdrop-blur",
        className
      )}
    >
      <CharacterPortrait
        characterId={character.id}
        characterName={character.name}
        size="xl"
      />
      <div className="min-w-0 flex-1">
        <h2 className="truncate font-display text-2xl font-semibold text-eve-text-primary">
          {character.name}
        </h2>
        <div className="mt-2 space-y-1">
          <CorporationBadge corporation={corporation} size="lg" />
          {alliance && <AllianceBadge alliance={alliance} size="lg" />}
        </div>
      </div>
    </div>
  )
}
