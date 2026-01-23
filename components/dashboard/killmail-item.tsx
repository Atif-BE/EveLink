"use client"

import Image from "next/image"
import { ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import { eveImageUrl } from "@/types/eve"
import type { KillmailDisplay } from "@/types/eve"

type KillmailItemProps = {
  killmail: KillmailDisplay
  className?: string
}

const formatTimeAgo = (date: Date): string => {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  return `${diffDays}d ago`
}

const formatIsk = (value: number): string => {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2)}B`
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M`
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(2)}K`
  }
  return value.toFixed(0)
}

export const KillmailItem = ({ killmail, className }: KillmailItemProps) => {
  const borderColor = killmail.isLoss
    ? "border-eve-red/50 hover:border-eve-red"
    : "border-eve-green/50 hover:border-eve-green"

  return (
    <a
      href={killmail.zkillboardUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group flex items-center gap-3 rounded-lg bg-eve-void/30 p-3 transition-all hover:bg-eve-void/50",
        className
      )}
    >
      <div
        className={cn(
          "relative h-14 w-14 shrink-0 overflow-hidden rounded-md border-2 transition-colors",
          borderColor
        )}
      >
        {killmail.victim.shipTypeId && (
          <Image
            src={eveImageUrl.ship(killmail.victim.shipTypeId, 64)}
            alt={killmail.victim.shipName ?? "Unknown Ship"}
            fill
            className="object-cover"
            unoptimized
          />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="truncate font-medium text-eve-text">
            {killmail.victim.shipName ?? "Unknown Ship"}
          </span>
          <ExternalLink className="h-3 w-3 shrink-0 text-eve-muted opacity-0 transition-opacity group-hover:opacity-100" />
        </div>

        <div className="truncate text-eve-muted">
          {killmail.victim.characterName ?? "Unknown Pilot"}
          {killmail.victim.corporationName && (
            <span className="text-eve-muted/70">
              {" "}
              [{killmail.victim.corporationName}]
            </span>
          )}
        </div>

        <div className="mt-1 flex items-center justify-between text-sm">
          <span className="text-eve-muted/70">
            {formatTimeAgo(killmail.timestamp)}
          </span>
          <span
            className={cn(
              "font-medium",
              killmail.isLoss ? "text-eve-red" : "text-eve-green"
            )}
          >
            {killmail.totalValue !== undefined
              ? `${formatIsk(killmail.totalValue)} ISK`
              : "View on zKB"}
          </span>
        </div>
      </div>
    </a>
  )
}
