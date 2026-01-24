"use client"

import Image from "next/image"
import { Calendar, ExternalLink, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import { eveImageUrl } from "@/types/eve"
import { Button } from "@/components/ui/button"
import type { EligibleLoss } from "@/types/srp"

type EligibleLossCardProps = {
  loss: EligibleLoss
  onStartRequest: () => void
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
  onStartRequest,
  className,
}: EligibleLossCardProps) => {
  return (
    <div
      className={cn(
        "rounded-xl border border-eve-border bg-eve-deep p-4 transition-colors hover:border-eve-cyan/30",
        className
      )}
    >
      <div className="flex items-center gap-4">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-eve-border bg-eve-void">
          <Image
            src={eveImageUrl.type(loss.shipTypeId, 64)}
            alt={loss.shipName}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-base font-semibold text-eve-text truncate">
              {loss.shipName}
            </h3>
            <a
              href={`https://zkillboard.com/kill/${loss.killmailId}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-eve-text-muted hover:text-eve-cyan transition-colors shrink-0"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
          <div className="flex items-center gap-2 text-sm text-eve-text-muted">
            <span className="text-eve-cyan font-medium">{formatIsk(loss.iskValue)}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(loss.killmailTime)}
            </span>
            <span>·</span>
            <span className="text-eve-text-secondary">
              {loss.matchingFleets.length} eligible fleet{loss.matchingFleets.length !== 1 && "s"}
            </span>
          </div>
        </div>

        <Button
          size="sm"
          onClick={onStartRequest}
          className="shrink-0 gap-1.5 bg-eve-cyan text-eve-void hover:bg-eve-cyan/90"
        >
          <FileText className="h-4 w-4" />
          Start Request
        </Button>
      </div>
    </div>
  )
}
