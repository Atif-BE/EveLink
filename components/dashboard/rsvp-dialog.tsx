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

const statusOptions: {
  value: RsvpStatus
  label: string
  icon: typeof Check
  selectedClass: string
}[] = [
  {
    value: "confirmed",
    label: "Confirmed",
    icon: Check,
    selectedClass: "border-eve-green bg-eve-green/10 text-eve-green",
  },
  {
    value: "tentative",
    label: "Tentative",
    icon: HelpCircle,
    selectedClass: "border-eve-yellow bg-eve-yellow/10 text-eve-yellow",
  },
  {
    value: "declined",
    label: "Declined",
    icon: X,
    selectedClass: "border-eve-red bg-eve-red/10 text-eve-red",
  },
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

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (isOpen) {
      setStatus((currentRsvp?.status as RsvpStatus) ?? "confirmed")
      setSelectedShip(currentRsvp?.shipTypeId?.toString() ?? "")
      setError(null)
    }
  }

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

  const handleKeyDown = (e: React.KeyboardEvent, optionValue: RsvpStatus) => {
    const currentIndex = statusOptions.findIndex((o) => o.value === status)
    let newIndex = currentIndex

    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        e.preventDefault()
        newIndex = (currentIndex + 1) % statusOptions.length
        break
      case "ArrowLeft":
      case "ArrowUp":
        e.preventDefault()
        newIndex = (currentIndex - 1 + statusOptions.length) % statusOptions.length
        break
      case " ":
      case "Enter":
        e.preventDefault()
        setStatus(optionValue)
        return
    }

    if (newIndex !== currentIndex) {
      setStatus(statusOptions[newIndex].value)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
            <span id="rsvp-status-label" className="text-sm text-eve-text-secondary">
              Status
            </span>
            <div
              role="radiogroup"
              aria-labelledby="rsvp-status-label"
              className="grid grid-cols-3 gap-2"
            >
              {statusOptions.map((option) => {
                const Icon = option.icon
                const isSelected = status === option.value
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    tabIndex={isSelected ? 0 : -1}
                    onClick={() => setStatus(option.value)}
                    onKeyDown={(e) => handleKeyDown(e, option.value)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-lg border p-3 transition-all focus:outline-none focus:ring-2 focus:ring-eve-cyan focus:ring-offset-2 focus:ring-offset-eve-deep",
                      isSelected
                        ? option.selectedClass
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
              <label htmlFor="ship-select" className="text-sm text-eve-text-secondary">
                Ship Selection
              </label>
              <Select value={selectedShip} onValueChange={setSelectedShip}>
                <SelectTrigger
                  id="ship-select"
                  className="border-eve-border bg-eve-void text-eve-text focus:ring-eve-cyan"
                >
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

          {error && (
            <p role="alert" className="text-sm text-eve-red">
              {error}
            </p>
          )}

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
