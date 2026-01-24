"use client"

import Image from "next/image"
import { Calendar, ExternalLink, Shield } from "lucide-react"
import { cn } from "@/lib/utils"
import { eveImageUrl } from "@/types/eve"
import { Button } from "@/components/ui/button"
import type { EligibleLoss } from "@/types/srp"

type EligibleLossCardProps = {
  loss: EligibleLoss
  onSubmit: (
    fleetId: string,
    doctrineShipId: string,
    fleetName: string
  ) => void
  className?: string
}

const formatIsk = (value: number): string => {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2)}B ISK`
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M ISK`
  }
  return `${value.toLocaleString()} ISK`
}

const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export const EligibleLossCard = ({
  loss,
  onSubmit,
  className,
}: EligibleLossCardProps) => {
  return (
    <div
      className={cn(
        "rounded-xl border border-eve-border bg-eve-deep p-4 transition-colors hover:border-eve-cyan/30",
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-eve-border bg-eve-void">
          <Image
            src={eveImageUrl.type(loss.shipTypeId, 64)}
            alt={loss.shipName}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h3 className="font-display text-base font-semibold text-eve-text">
                {loss.shipName}
              </h3>
              <div className="flex items-center gap-2 text-sm text-eve-text-muted">
                <span className="text-eve-cyan font-medium">{formatIsk(loss.iskValue)}</span>
                <span>|</span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(loss.killmailTime)}
                </span>
              </div>
            </div>
            <a
              href={`https://zkillboard.com/kill/${loss.killmailId}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-eve-text-muted hover:text-eve-cyan transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          <div className="space-y-2">
            <p className="text-xs text-eve-text-muted">Eligible fleets:</p>
            <div className="flex flex-wrap gap-2">
              {loss.matchingFleets.map((fleet) => (
                <Button
                  key={fleet.fleetId}
                  size="sm"
                  variant="outline"
                  onClick={() => onSubmit(fleet.fleetId, fleet.doctrineShipId, fleet.fleetName)}
                  className="h-7 gap-1.5 border-eve-border bg-eve-void/50 text-xs text-eve-text hover:border-eve-cyan hover:bg-eve-cyan/10 hover:text-eve-cyan"
                >
                  <Shield className="h-3 w-3" />
                  {fleet.fleetName}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
