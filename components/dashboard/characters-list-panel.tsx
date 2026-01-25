import Link from "next/link"
import { Users, Plus, UserCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  CharacterOverviewCard,
  type CharacterOverviewData,
} from "./character-overview-card"

type CharactersListPanelProps = {
  characters: CharacterOverviewData[]
  primaryCharacterId: number | null
  className?: string
}

export const CharactersListPanel = ({
  characters,
  primaryCharacterId,
  className,
}: CharactersListPanelProps) => {
  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-eve-cyan/10 border border-eve-cyan/30">
            <Users className="h-5 w-5 text-eve-cyan" />
          </div>
          <div>
            <h1 className="font-display text-xl text-eve-text-primary">
              Characters
            </h1>
            <p className="text-sm text-eve-text-muted">
              {characters.length} linked character{characters.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <Button asChild variant="outline" size="sm">
          <Link href="/api/auth/add-character">
            <Plus className="mr-2 h-4 w-4" />
            Add Character
          </Link>
        </Button>
      </div>

      {characters.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-eve-border bg-eve-deep/30 px-6 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-eve-cyan/10 border border-eve-cyan/20">
            <UserCircle className="h-8 w-8 text-eve-cyan/60" />
          </div>
          <h3 className="mt-4 font-display text-lg text-eve-text-primary">
            No Characters Linked
          </h3>
          <p className="mt-2 max-w-sm text-sm text-eve-text-muted">
            Link your EVE Online characters to view their skill training, wallet
            balance, and more.
          </p>
          <Button asChild className="mt-6">
            <Link href="/api/auth/add-character">
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Character
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {characters.map((character) => (
            <CharacterOverviewCard
              key={character.characterId}
              data={character}
              isPrimary={character.characterId === primaryCharacterId}
            />
          ))}
        </div>
      )}
    </div>
  )
}
