"use client"

import { LogOut } from "lucide-react"
import { EveLogo } from "@/components/shared/eve-logo"
import { CharacterPortrait } from "@/components/eve/character-portrait"

type DashboardHeaderProps = {
  characterId: number
  characterName: string
}

export function DashboardHeader({
  characterId,
  characterName,
}: Readonly<DashboardHeaderProps>) {
  const handleLogout = () => {
    globalThis.location.href = "/api/auth/logout"
  }

  return (
    <header className="sticky top-0 z-50 border-b border-eve-border bg-eve-deep">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <EveLogo size="sm" />

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <CharacterPortrait
              characterId={characterId}
              characterName={characterName}
              size="sm"
              showBorder={false}
            />
            <span className="hidden font-body text-sm text-eve-text-secondary sm:block">
              {characterName}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg border border-eve-border bg-eve-void/50 px-3 py-1.5 font-body text-sm text-eve-text-secondary transition-colors hover:border-eve-red hover:text-eve-red"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  )
}
