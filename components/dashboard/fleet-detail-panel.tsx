"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  Calendar,
  Users,
  BookOpen,
  Trash2,
  Loader2,
  Play,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { eveImageUrl } from "@/types/eve"
import { FleetStatusBadge } from "./fleet-status-badge"
import { FleetRsvpList } from "./fleet-rsvp-list"
import { RsvpDialog } from "./rsvp-dialog"
import {
  deleteFleetAction,
  updateFleetStatusAction,
} from "@/app/(dashboard)/dashboard/fleets/[id]/actions"
import type { FleetWithRelations, FleetRsvp } from "@/types/db"
import type { FleetStatus } from "@/types/fleet"

type FleetDetailPanelProps = {
  fleet: FleetWithRelations
  currentRsvp: FleetRsvp | null
  className?: string
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export const FleetDetailPanel = ({
  fleet,
  currentRsvp,
  className,
}: FleetDetailPanelProps) => {
  const [deleting, setDeleting] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleDeleteFleet = async () => {
    if (!confirm("Are you sure you want to delete this fleet?")) return

    setDeleting(true)
    await deleteFleetAction(fleet.id)
  }

  const handleStatusChange = (status: FleetStatus) => {
    startTransition(async () => {
      await updateFleetStatusAction(fleet.id, status)
    })
  }

  const confirmedCount = fleet.rsvps.filter((r) => r.status === "confirmed").length

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <Link
            href="/dashboard/fleets"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-eve-border bg-eve-void/50 text-eve-text-muted transition-colors hover:border-eve-cyan/50 hover:text-eve-cyan"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-display text-2xl font-bold text-eve-text">
                {fleet.name}
              </h1>
              <FleetStatusBadge status={fleet.status as FleetStatus} />
            </div>
            {fleet.description && (
              <p className="mt-1 text-sm text-eve-text-muted">
                {fleet.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {fleet.status === "scheduled" && (
            <Button
              variant="ghost"
              onClick={() => handleStatusChange("active")}
              disabled={isPending}
              className="gap-2 text-eve-green hover:bg-eve-green/10 hover:text-eve-green"
            >
              <Play className="h-4 w-4" />
              Start Fleet
            </Button>
          )}
          {fleet.status === "active" && (
            <Button
              variant="ghost"
              onClick={() => handleStatusChange("completed")}
              disabled={isPending}
              className="gap-2 text-eve-text-secondary hover:bg-eve-void hover:text-eve-text"
            >
              <CheckCircle className="h-4 w-4" />
              Complete
            </Button>
          )}
          {(fleet.status === "scheduled" || fleet.status === "active") && (
            <Button
              variant="ghost"
              onClick={() => handleStatusChange("cancelled")}
              disabled={isPending}
              className="gap-2 text-eve-yellow hover:bg-eve-yellow/10 hover:text-eve-yellow"
            >
              <XCircle className="h-4 w-4" />
              Cancel
            </Button>
          )}
          <Button
            variant="ghost"
            onClick={handleDeleteFleet}
            disabled={deleting}
            className="text-eve-red hover:bg-eve-red/10 hover:text-eve-red"
          >
            {deleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-eve-border bg-eve-deep p-4">
            <h2 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-eve-text-muted">
              Fleet Details
            </h2>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-eve-void/50">
                  <Calendar className="h-5 w-5 text-eve-cyan" />
                </div>
                <div>
                  <p className="text-xs text-eve-text-muted">Scheduled Time</p>
                  <p className="text-sm font-medium text-eve-text">
                    {formatDate(fleet.scheduledAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 overflow-hidden rounded-lg border border-eve-border">
                  <Image
                    src={eveImageUrl.character(fleet.fcCharacterId, 64)}
                    alt={fleet.fcCharacterName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-xs text-eve-text-muted">Fleet Commander</p>
                  <p className="text-sm font-medium text-eve-text">
                    {fleet.fcCharacterName}
                  </p>
                </div>
              </div>

              {fleet.doctrine && (
                <Link
                  href={`/dashboard/doctrines/${fleet.doctrine.id}`}
                  className="group flex items-center gap-3 rounded-lg border border-eve-border/50 bg-eve-void/30 p-3 transition-colors hover:border-eve-cyan/50"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-eve-cyan/10">
                    <BookOpen className="h-5 w-5 text-eve-cyan" />
                  </div>
                  <div>
                    <p className="text-xs text-eve-text-muted">Doctrine</p>
                    <p className="text-sm font-medium text-eve-text group-hover:text-eve-cyan">
                      {fleet.doctrine.name}
                    </p>
                  </div>
                </Link>
              )}

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-eve-void/50">
                  <Users className="h-5 w-5 text-eve-cyan" />
                </div>
                <div>
                  <p className="text-xs text-eve-text-muted">Confirmed RSVPs</p>
                  <p className="text-sm font-medium text-eve-text">
                    {confirmedCount} pilot{confirmedCount !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {(fleet.status === "scheduled" || fleet.status === "active") && (
            <div className="rounded-xl border border-eve-border bg-eve-deep p-4">
              <h2 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-eve-text-muted">
                Your RSVP
              </h2>
              {currentRsvp ? (
                <div className="mb-4 rounded-lg border border-eve-border/50 bg-eve-void/30 p-3">
                  <p className="text-sm text-eve-text">
                    Status:{" "}
                    <span
                      className={cn(
                        "font-medium",
                        currentRsvp.status === "confirmed" && "text-eve-green",
                        currentRsvp.status === "tentative" && "text-eve-yellow",
                        currentRsvp.status === "declined" && "text-eve-red"
                      )}
                    >
                      {currentRsvp.status.charAt(0).toUpperCase() +
                        currentRsvp.status.slice(1)}
                    </span>
                  </p>
                  {currentRsvp.shipName && (
                    <p className="text-sm text-eve-text-muted">
                      Ship: {currentRsvp.shipName}
                    </p>
                  )}
                </div>
              ) : (
                <p className="mb-4 text-sm text-eve-text-muted">
                  You have not RSVPed yet.
                </p>
              )}
              <RsvpDialog
                fleetId={fleet.id}
                currentRsvp={currentRsvp}
                doctrineShips={fleet.doctrine?.ships ?? null}
              />
            </div>
          )}

          <div className="rounded-xl border border-eve-border bg-eve-deep p-4">
            <h2 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-eve-text-muted">
              RSVPs ({fleet.rsvps.length})
            </h2>
            <FleetRsvpList rsvps={fleet.rsvps} />
          </div>
        </div>
      </div>
    </div>
  )
}
