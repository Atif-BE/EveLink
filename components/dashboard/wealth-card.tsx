"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { formatISK } from "@/lib/format"
import { eveImageUrl } from "@/types/eve"
import { Wallet, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react"
import type { AggregateWealth } from "@/lib/esi"

type WealthCardProps = {
  wealth: AggregateWealth
  className?: string
}

const COLORS = [
  "bg-eve-cyan",
  "bg-amber-500",
  "bg-emerald-500",
  "bg-purple-500",
  "bg-rose-500",
  "bg-blue-500",
]

const MAX_VISIBLE_CHARACTERS = 5

export function WealthCard({ wealth, className }: Readonly<WealthCardProps>) {
  const [expanded, setExpanded] = useState(false)
  const validCharacters = wealth.characters.filter((c) => c.balance !== null)
  const invalidCharacters = wealth.characters.filter((c) => c.balance === null)
  const hasMany = wealth.characters.length > MAX_VISIBLE_CHARACTERS
  const displayedCharacters = expanded
    ? wealth.characters
    : wealth.characters.slice(0, MAX_VISIBLE_CHARACTERS)

  if (wealth.characters.length === 0) {
    return null
  }

  return (
    <div
      className={cn(
        "rounded-xl border border-eve-border bg-eve-deep p-4",
        className
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wallet className="h-4 w-4 text-eve-cyan" />
          <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-eve-text-secondary">
            Total Wealth
          </h3>
        </div>
        {wealth.incomplete && (
          <div className="group relative">
            <AlertTriangle className="h-4 w-4 cursor-help text-amber-400" />
            <div className="pointer-events-none absolute right-0 top-6 z-10 w-48 rounded-lg bg-eve-void p-2 opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
              <p className="text-xs text-eve-text-secondary">
                Some characters need to re-authorize for wallet access
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="mb-1 flex items-baseline gap-2">
        <span className="font-display text-2xl font-bold text-eve-cyan">
          {formatISK(wealth.total)}
        </span>
        <span className="font-body text-xs text-eve-text-muted">ISK</span>
      </div>
      <p className="mb-4 font-body text-xs text-eve-text-muted">
        across {wealth.characters.length} character
        {wealth.characters.length !== 1 ? "s" : ""}
      </p>

      {validCharacters.length > 1 && (
        <div className="mb-3 flex h-1.5 overflow-hidden rounded-full bg-eve-void/50">
          {validCharacters.map((char, i) => {
            const percentage =
              wealth.total > 0 ? ((char.balance ?? 0) / wealth.total) * 100 : 0
            return (
              <div
                key={char.characterId}
                className={cn("h-full", COLORS[i % COLORS.length])}
                style={{ width: `${Math.max(percentage, 0.5)}%` }}
                title={`${char.characterName}: ${formatISK(char.balance ?? 0)} ISK`}
              />
            )
          })}
        </div>
      )}

      <div className="space-y-1.5">
        {displayedCharacters.map((char) => {
          const colorIndex = validCharacters.findIndex(
            (c) => c.characterId === char.characterId
          )
          return (
            <div
              key={char.characterId}
              className="flex items-center justify-between rounded-md bg-eve-void/30 px-2 py-1.5"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Image
                  src={eveImageUrl.character(char.characterId, 32)}
                  alt=""
                  width={24}
                  height={24}
                  className="h-6 w-6 flex-shrink-0 rounded-full"
                />
                {char.balance !== null && validCharacters.length > 1 && (
                  <div
                    className={cn(
                      "h-1.5 w-1.5 flex-shrink-0 rounded-full",
                      COLORS[colorIndex % COLORS.length]
                    )}
                  />
                )}
                <span className="truncate font-body text-xs text-eve-text-primary">
                  {char.characterName}
                </span>
              </div>
              {char.balance !== null ? (
                <span className="flex-shrink-0 font-display text-xs font-medium text-eve-text-primary">
                  {formatISK(char.balance)}
                </span>
              ) : (
                <span className="flex-shrink-0 font-body text-xs text-amber-400">
                  Re-auth
                </span>
              )}
            </div>
          )
        })}
      </div>

      {hasMany && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 flex w-full items-center justify-center gap-1 rounded-md py-1 text-xs text-eve-text-muted transition-colors hover:bg-eve-void/30 hover:text-eve-text-secondary"
        >
          {expanded ? (
            <>
              Show less <ChevronUp className="h-3 w-3" />
            </>
          ) : (
            <>
              Show {wealth.characters.length - MAX_VISIBLE_CHARACTERS} more{" "}
              <ChevronDown className="h-3 w-3" />
            </>
          )}
        </button>
      )}

      {invalidCharacters.length > 0 && !expanded && (
        <p className="mt-2 font-body text-xs text-eve-text-muted">
          {invalidCharacters.length} need re-authorization
        </p>
      )}
    </div>
  )
}
