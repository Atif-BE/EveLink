import Image from "next/image"
import { Check, X, HelpCircle, Ship } from "lucide-react"
import { cn } from "@/lib/utils"
import { eveImageUrl } from "@/types/eve"
import type { FleetRsvp } from "@/types/db"
import type { RsvpStatus } from "@/types/fleet"

type FleetRsvpListProps = {
  rsvps: FleetRsvp[]
  className?: string
}

const statusConfig: Record<
  RsvpStatus,
  { label: string; icon: typeof Check; iconClass: string }
> = {
  confirmed: { label: "Confirmed", icon: Check, iconClass: "text-eve-green" },
  tentative: { label: "Tentative", icon: HelpCircle, iconClass: "text-eve-yellow" },
  declined: { label: "Declined", icon: X, iconClass: "text-eve-red" },
}

export const FleetRsvpList = ({ rsvps, className }: FleetRsvpListProps) => {
  const groupedRsvps = rsvps.reduce(
    (acc, rsvp) => {
      const status = rsvp.status as RsvpStatus
      if (!acc[status]) acc[status] = []
      acc[status].push(rsvp)
      return acc
    },
    {} as Record<RsvpStatus, FleetRsvp[]>
  )

  const statusOrder: RsvpStatus[] = ["confirmed", "tentative", "declined"]

  return (
    <div className={cn("space-y-4", className)}>
      {statusOrder.map((status) => {
        const list = groupedRsvps[status]
        if (!list || list.length === 0) return null

        const config = statusConfig[status]
        const Icon = config.icon

        return (
          <div key={status}>
            <div className="mb-2 flex items-center gap-2">
              <Icon className={cn("h-4 w-4", config.iconClass)} />
              <span className="text-sm font-medium text-eve-text-secondary">
                {config.label} ({list.length})
              </span>
            </div>
            <div className="space-y-2">
              {list.map((rsvp) => (
                <div
                  key={rsvp.id}
                  className="flex items-center gap-3 rounded-lg border border-eve-border/50 bg-eve-void/30 p-3"
                >
                  <div className="relative h-8 w-8 overflow-hidden rounded-lg border border-eve-border">
                    <Image
                      src={eveImageUrl.character(rsvp.characterId, 64)}
                      alt={rsvp.characterName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-eve-text">
                      {rsvp.characterName}
                    </p>
                    {rsvp.shipName && (
                      <div className="flex items-center gap-1 text-xs text-eve-text-muted">
                        <Ship className="h-3 w-3" />
                        <span>{rsvp.shipName}</span>
                      </div>
                    )}
                  </div>
                  {rsvp.shipTypeId && (
                    <div className="relative h-8 w-8 overflow-hidden rounded border border-eve-border bg-eve-void">
                      <Image
                        src={eveImageUrl.render(rsvp.shipTypeId, 64)}
                        alt=""
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      })}

      {rsvps.length === 0 && (
        <div className="py-8 text-center">
          <p className="text-sm text-eve-text-muted">No RSVPs yet</p>
        </div>
      )}
    </div>
  )
}
