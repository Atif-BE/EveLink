import Link from "next/link"
import Image from "next/image"
import { Users, Calendar, ChevronRight, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import { eveImageUrl, type FleetWithRelations, type FleetStatus } from "@/types"
import { FleetStatusBadge } from "./fleet-status-badge"

type FleetCardProps = {
  fleet: FleetWithRelations
  className?: string
}

const formatScheduledTime = (date: Date) => {
  const now = new Date()
  const diff = date.getTime() - now.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  if (diff < 0) {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (hours < 1) {
    return `In ${minutes}m`
  }

  if (hours < 24) {
    return `In ${hours}h ${minutes}m`
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export const FleetCard = ({ fleet, className }: FleetCardProps) => {
  const confirmedRsvps = fleet.rsvps.filter((r) => r.status === "confirmed")

  return (
    <Link
      href={`/dashboard/fleets/${fleet.id}`}
      className={cn(
        "group relative block rounded-xl border border-eve-border bg-eve-deep p-4 transition-all duration-200",
        "hover:border-eve-cyan/50 hover:bg-eve-deep/80",
        className
      )}
    >
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-eve-cyan/5 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

      <div className="relative">
        <div className="mb-3 flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <h3 className="font-display text-base font-semibold text-eve-text group-hover:text-eve-cyan">
                {fleet.name}
              </h3>
              <FleetStatusBadge status={fleet.status as FleetStatus} />
            </div>
            {fleet.description && (
              <p className="line-clamp-2 text-sm text-eve-text-muted">
                {fleet.description}
              </p>
            )}
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-eve-text-muted transition-transform duration-200 group-hover:translate-x-1 group-hover:text-eve-cyan" />
        </div>

        <div className="mb-3 flex items-center gap-3">
          <div className="relative h-8 w-8 overflow-hidden rounded-lg border border-eve-border bg-eve-void">
            <Image
              src={eveImageUrl.character(fleet.fcCharacterId, 64)}
              alt={fleet.fcCharacterName}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-sm text-eve-text-muted">Fleet Commander</p>
            <p className="text-sm text-eve-text">{fleet.fcCharacterName}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm text-eve-text-secondary">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-eve-text-muted" />
            <span>{formatScheduledTime(fleet.scheduledAt)}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4 text-eve-text-muted" />
            <span>
              {confirmedRsvps.length} confirmed
            </span>
          </div>
        </div>

        {fleet.doctrine && (
          <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-eve-void/50 px-2 py-1.5">
            <BookOpen className="h-3.5 w-3.5 text-eve-cyan" />
            <span className="text-xs text-eve-text-secondary">
              {fleet.doctrine.name}
            </span>
          </div>
        )}
      </div>
    </Link>
  )
}
