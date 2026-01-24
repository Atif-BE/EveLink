"use client"

import { Plus, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { CharacterPortrait } from "@/components/eve/character-portrait"

type LinkedCharacter = {
  id: number
  name: string
  corporationName: string
}

type AssociatedCharactersPanelProps = {
  characters: LinkedCharacter[]
  activeCharacterId: number
  className?: string
}

export function AssociatedCharactersPanel({
  characters,
  activeCharacterId,
  className,
}: Readonly<AssociatedCharactersPanelProps>) {
  const handleSwitchCharacter = async (characterId: number) => {
    if (characterId === activeCharacterId) return

    const response = await fetch("/api/auth/switch-character", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ characterId }),
    })

    if (response.ok) {
      globalThis.location.reload()
    }
  }

  const handleAddCharacter = () => {
    globalThis.location.href = "/api/auth/add-character"
  }

  return (
    <div
      className={cn(
        "rounded-xl border border-eve-border bg-eve-deep/50 p-4 backdrop-blur",
        className
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-eve-text-secondary">
          Linked Characters
        </h3>
        <button
          onClick={handleAddCharacter}
          className="flex items-center gap-1.5 rounded-lg border border-eve-border bg-eve-void/50 px-2.5 py-1 font-body text-xs text-eve-text-secondary transition-colors hover:border-eve-cyan hover:text-eve-cyan"
        >
          <Plus className="h-3.5 w-3.5" />
          Add
        </button>
      </div>

      <div className="space-y-2">
        {characters.map((character) => {
          const isActive = character.id === activeCharacterId
          return (
            <button
              key={character.id}
              onClick={() => handleSwitchCharacter(character.id)}
              disabled={isActive}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg border p-2 text-left transition-colors",
                isActive
                  ? "border-eve-cyan/50 bg-eve-cyan/10"
                  : "border-eve-border bg-eve-void/30 hover:border-eve-cyan/30 hover:bg-eve-void/50"
              )}
            >
              <CharacterPortrait
                characterId={character.id}
                characterName={character.name}
                size="sm"
                showBorder={false}
              />
              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    "truncate font-body text-sm font-medium",
                    isActive ? "text-eve-cyan" : "text-eve-text-primary"
                  )}
                >
                  {character.name}
                </p>
                <p className="truncate font-body text-sm text-eve-text-muted">
                  {character.corporationName}
                </p>
              </div>
              {isActive && (
                <Check className="h-4 w-4 flex-shrink-0 text-eve-cyan" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
