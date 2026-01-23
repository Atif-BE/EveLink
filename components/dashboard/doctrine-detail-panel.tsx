"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Ship, Trash2, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { DoctrineShipCard } from "./doctrine-ship-card"
import { AddShipDialog } from "./add-ship-dialog"
import type { DoctrineWithShips } from "@/types/db"
import type { ShipRole } from "@/types/fitting"

type DoctrineDetailPanelProps = {
  doctrine: DoctrineWithShips
  className?: string
}

export const DoctrineDetailPanel = ({
  doctrine,
  className,
}: DoctrineDetailPanelProps) => {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)
  const [deletingShipId, setDeletingShipId] = useState<string | null>(null)

  const shipsByRole = doctrine.ships.reduce(
    (acc, ship) => {
      const role = ship.role as ShipRole
      if (!acc[role]) acc[role] = []
      acc[role].push(ship)
      return acc
    },
    {} as Record<ShipRole, typeof doctrine.ships>
  )

  const roleOrder: ShipRole[] = [
    "DPS",
    "Logi",
    "Support",
    "Tackle",
    "EWAR",
    "Scout",
    "Command",
    "Capital",
    "Other",
  ]

  const handleDeleteDoctrine = async () => {
    if (!confirm("Are you sure you want to delete this doctrine?")) return

    setDeleting(true)
    try {
      const res = await fetch(`/api/doctrines/${doctrine.id}`, {
        method: "DELETE",
      })
      if (res.ok) {
        router.push("/dashboard/doctrines")
        router.refresh()
      }
    } finally {
      setDeleting(false)
    }
  }

  const handleDeleteShip = async (shipId: string) => {
    if (!confirm("Remove this ship from the doctrine?")) return

    setDeletingShipId(shipId)
    try {
      const res = await fetch(
        `/api/doctrines/${doctrine.id}/ships/${shipId}`,
        { method: "DELETE" }
      )
      if (res.ok) {
        router.refresh()
      }
    } finally {
      setDeletingShipId(null)
    }
  }

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <Link
            href="/dashboard/doctrines"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-eve-border bg-eve-void/50 text-eve-text-muted transition-colors hover:border-eve-cyan/50 hover:text-eve-cyan"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="font-display text-2xl font-bold text-eve-text">
              {doctrine.name}
            </h1>
            {doctrine.description && (
              <p className="mt-1 text-sm text-eve-text-muted">
                {doctrine.description}
              </p>
            )}
            <div className="mt-2 flex items-center gap-2 text-sm text-eve-text-secondary">
              <Ship className="h-4 w-4" />
              <span>
                {doctrine.ships.length} ship
                {doctrine.ships.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <AddShipDialog doctrineId={doctrine.id} />
          <Button
            variant="ghost"
            onClick={handleDeleteDoctrine}
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

      {doctrine.ships.length > 0 ? (
        <div className="space-y-8">
          {roleOrder.map((role) => {
            const ships = shipsByRole[role]
            if (!ships || ships.length === 0) return null

            return (
              <div key={role}>
                <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-eve-text-secondary">
                  {role}
                  <span className="ml-2 text-eve-text-muted">
                    ({ships.length})
                  </span>
                </h3>
                <div className="grid gap-3">
                  {ships.map((ship) => (
                    <DoctrineShipCard
                      key={ship.id}
                      ship={ship}
                      onDelete={
                        deletingShipId === ship.id
                          ? undefined
                          : handleDeleteShip
                      }
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-eve-border/50 bg-eve-deep/50 py-16">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-eve-void/50">
            <Ship className="h-8 w-8 text-eve-text-muted/50" />
          </div>
          <h3 className="mb-2 font-display text-base font-medium text-eve-text">
            No Ships Yet
          </h3>
          <p className="mb-6 max-w-sm text-center text-sm text-eve-text-muted">
            Add ships to this doctrine by pasting their EFT fittings.
          </p>
          <AddShipDialog doctrineId={doctrine.id} />
        </div>
      )}
    </div>
  )
}
