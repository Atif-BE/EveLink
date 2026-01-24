"use client"

import { useState, useTransition } from "react"
import Image from "next/image"
import { Check, X, HelpCircle, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { eveImageUrl } from "@/types/eve"
import {
  rsvpToFleetAction,
  cancelRsvpAction,
} from "@/app/(dashboard)/dashboard/fleets/[id]/actions"
import type { FleetRsvp, DoctrineShip } from "@/types/db"
import type { RsvpStatus } from "@/types/fleet"

type RsvpDialogProps = {
  fleetId: string
  currentRsvp: FleetRsvp | null
  doctrineShips: DoctrineShip[] | null
  trigger?: React.ReactNode
}

const statusOptions: { value: RsvpStatus; label: string; icon: typeof Check }[] = [
  { value: "confirmed", label: "Confirmed", icon: Check },
  { value: "tentative", label: "Tentative", icon: HelpCircle },
  { value: "declined", label: "Declined", icon: X },
]

export const RsvpDialog = ({
  fleetId,
  currentRsvp,
  doctrineShips,
  trigger,
}: RsvpDialogProps) => {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<RsvpStatus>(
    (currentRsvp?.status as RsvpStatus) ?? "confirmed"
  )
  const [selectedShip, setSelectedShip] = useState<string>(
    currentRsvp?.shipTypeId?.toString() ?? ""
  )
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = () => {
    setError(null)
    const ship = doctrineShips?.find((s) => s.shipTypeId.toString() === selectedShip)

    startTransition(async () => {
      const result = await rsvpToFleetAction(
        fleetId,
        status,
        ship?.shipTypeId ?? null,
        ship?.fitName ?? null
      )
      if (result.success) {
        setOpen(false)
      } else {
        setError(result.error ?? "Failed to RSVP")
      }
    })
  }

  const handleCancel = () => {
    setError(null)
    startTransition(async () => {
      const result = await cancelRsvpAction(fleetId)
      if (result.success) {
        setOpen(false)
      } else {
        setError(result.error ?? "Failed to cancel RSVP")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2 bg-eve-cyan text-eve-void hover:bg-eve-cyan/90">
            {currentRsvp ? "Update RSVP" : "RSVP"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="border-eve-border bg-eve-deep sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-eve-text">
            {currentRsvp ? "Update RSVP" : "RSVP to Fleet"}
          </DialogTitle>
          <DialogDescription className="text-eve-text-muted">
            Let the fleet know your attendance status.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-eve-text-secondary">Status</label>
            <div className="grid grid-cols-3 gap-2">
              {statusOptions.map((option) => {
                const Icon = option.icon
                const isSelected = status === option.value
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setStatus(option.value)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-lg border p-3 transition-all",
                      isSelected
                        ? option.value === "confirmed"
                          ? "border-eve-green bg-eve-green/10 text-eve-green"
                          : option.value === "tentative"
                            ? "border-eve-yellow bg-eve-yellow/10 text-eve-yellow"
                            : "border-eve-red bg-eve-red/10 text-eve-red"
                        : "border-eve-border bg-eve-void/50 text-eve-text-muted hover:border-eve-border hover:bg-eve-void"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-xs font-medium">{option.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {doctrineShips && doctrineShips.length > 0 && status !== "declined" && (
            <div className="space-y-2">
              <label className="text-sm text-eve-text-secondary">
                Ship Selection
              </label>
              <Select value={selectedShip} onValueChange={setSelectedShip}>
                <SelectTrigger className="border-eve-border bg-eve-void text-eve-text focus:ring-eve-cyan">
                  <SelectValue placeholder="Select ship..." />
                </SelectTrigger>
                <SelectContent className="border-eve-border bg-eve-deep">
                  {doctrineShips.map((ship) => (
                    <SelectItem
                      key={ship.id}
                      value={ship.shipTypeId.toString()}
                      className="text-eve-text focus:bg-eve-void focus:text-eve-text"
                    >
                      <div className="flex items-center gap-2">
                        <Image
                          src={eveImageUrl.render(ship.shipTypeId, 32)}
                          alt=""
                          width={20}
                          height={20}
                          className="rounded"
                        />
                        <span>{ship.fitName}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {error && <p className="text-sm text-eve-red">{error}</p>}

          <div className="flex justify-between gap-3">
            {currentRsvp && (
              <Button
                type="button"
                variant="ghost"
                onClick={handleCancel}
                disabled={isPending}
                className="text-eve-red hover:bg-eve-red/10 hover:text-eve-red"
              >
                Cancel RSVP
              </Button>
            )}
            <div className="ml-auto flex gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
                className="text-eve-text-secondary hover:bg-eve-void hover:text-eve-text"
              >
                Close
              </Button>
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isPending}
                className="bg-eve-cyan text-eve-void hover:bg-eve-cyan/90"
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {currentRsvp ? "Update" : "Confirm"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
