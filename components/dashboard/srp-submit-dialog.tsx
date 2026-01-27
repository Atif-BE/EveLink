"use client"

import { useState, useTransition } from "react"
import Image from "next/image"
import { AlertTriangle, ArrowLeft, Calendar, Shield, Loader2, Check } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { eveImageUrl, type EligibleLoss } from "@/types"
import { submitSrpRequestAction } from "@/app/(dashboard)/dashboard/srp/actions"

type SrpSubmitDialogProps = {
  loss: EligibleLoss | null
  onClose: () => void
  onSuccess: () => void
}

type SelectedFleet = {
  fleetId: string
  doctrineShipId: string
  fleetName: string
  scheduledAt: Date
}

const isFleetOld = (scheduledAt: Date): boolean => {
  const threeDaysMs = 3 * 24 * 60 * 60 * 1000
  return Date.now() - new Date(scheduledAt).getTime() > threeDaysMs
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
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export const SrpSubmitDialog = ({
  loss,
  onClose,
  onSuccess,
}: SrpSubmitDialogProps) => {
  const [selectedFleet, setSelectedFleet] = useState<SelectedFleet | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleClose = () => {
    setSelectedFleet(null)
    setError(null)
    onClose()
  }

  const handleBack = () => {
    setSelectedFleet(null)
    setError(null)
  }

  const handleSelectFleet = (fleet: EligibleLoss["matchingFleets"][0]) => {
    setSelectedFleet({
      fleetId: fleet.fleetId,
      doctrineShipId: fleet.doctrineShipId,
      fleetName: fleet.fleetName,
      scheduledAt: fleet.scheduledAt,
    })
  }

  const handleSubmit = () => {
    if (!loss || !selectedFleet) return

    setError(null)
    startTransition(async () => {
      const result = await submitSrpRequestAction(
        selectedFleet.fleetId,
        loss.killmailId,
        loss.killmailHash,
        selectedFleet.doctrineShipId,
        loss.iskValue
      )

      if (result.success) {
        onSuccess()
        handleClose()
      } else {
        setError(result.error ?? "Failed to submit SRP request")
      }
    })
  }

  const isOpen = Boolean(loss)

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="border-eve-border bg-eve-deep sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-eve-text">
            {selectedFleet ? "Confirm SRP Request" : "Select Fleet"}
          </DialogTitle>
          <DialogDescription className="text-eve-text-muted">
            {selectedFleet
              ? "Review and submit your ship replacement request."
              : "Choose which fleet to submit this loss for."}
          </DialogDescription>
        </DialogHeader>

        {loss && !selectedFleet && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-lg bg-eve-void/50 p-3">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-eve-border">
                <Image
                  src={eveImageUrl.type(loss.shipTypeId, 64)}
                  alt={loss.shipName}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="font-display text-sm font-semibold text-eve-text">
                  {loss.shipName}
                </h4>
                <p className="text-sm text-eve-cyan font-medium">
                  {formatIsk(loss.iskValue)}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-eve-text-muted font-medium uppercase tracking-wide">
                Eligible Fleets
              </p>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {loss.matchingFleets.map((fleet) => {
                  const fleetIsOld = isFleetOld(fleet.scheduledAt)
                  return (
                    <button
                      key={fleet.fleetId}
                      onClick={() => handleSelectFleet(fleet)}
                      className={cn(
                        "w-full rounded-lg border border-eve-border bg-eve-void/30 p-3 text-left transition-colors hover:border-eve-cyan/50 hover:bg-eve-cyan/5",
                        fleetIsOld && "border-eve-yellow/30"
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-eve-cyan shrink-0" />
                          <span className="font-medium text-eve-text">
                            {fleet.fleetName}
                          </span>
                        </div>
                        {fleetIsOld && (
                          <AlertTriangle className="h-4 w-4 text-eve-yellow shrink-0" />
                        )}
                      </div>
                      <div className="mt-1 flex items-center gap-1 text-sm text-eve-text-muted ml-6">
                        <Calendar className="h-3 w-3" />
                        {formatDate(fleet.scheduledAt)}
                        {fleetIsOld && (
                          <span className="text-eve-yellow ml-1">(Late submission)</span>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="button"
                variant="ghost"
                onClick={handleClose}
                className="text-eve-text-secondary hover:bg-eve-void hover:text-eve-text"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {loss && selectedFleet && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 rounded-lg bg-eve-void/50 p-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-eve-border">
                <Image
                  src={eveImageUrl.type(loss.shipTypeId, 64)}
                  alt={loss.shipName}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="font-display text-base font-semibold text-eve-text">
                  {loss.shipName}
                </h4>
                <p className="text-sm text-eve-cyan font-medium">
                  {formatIsk(loss.iskValue)}
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-eve-border bg-eve-void/30 p-3">
              <div className="flex items-center gap-2 text-sm text-eve-text-secondary">
                <Shield className="h-4 w-4 text-eve-cyan" />
                <span>Fleet:</span>
                <span className="text-eve-text font-medium">{selectedFleet.fleetName}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-eve-text-muted mt-1 ml-6">
                <Calendar className="h-3 w-3" />
                {formatDate(selectedFleet.scheduledAt)}
              </div>
            </div>

            {isFleetOld(selectedFleet.scheduledAt) && (
              <div className="rounded-lg border border-eve-yellow/50 bg-eve-yellow/10 p-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-eve-yellow mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-eve-yellow">
                      Late Submission Warning
                    </p>
                    <p className="text-xs text-eve-yellow/80 mt-1">
                      This fleet occurred more than 3 days ago. Late SRP requests may
                      require additional review.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="rounded-lg border border-eve-yellow/30 bg-eve-yellow/5 p-3">
              <p className="text-xs text-eve-yellow">
                Your fit will be validated against the doctrine. Requests with partial or
                invalid fits can still be submitted but require admin approval.
              </p>
            </div>

            {error && (
              <div className="rounded-lg border border-eve-red/30 bg-eve-red/10 p-3">
                <p className="text-sm text-eve-red">{error}</p>
              </div>
            )}

            <div className="flex justify-between">
              <Button
                type="button"
                variant="ghost"
                onClick={handleBack}
                disabled={isPending}
                className="text-eve-text-secondary hover:bg-eve-void hover:text-eve-text gap-1.5"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isPending}
                className="bg-eve-cyan text-eve-void hover:bg-eve-cyan/90 gap-1.5"
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                Submit Request
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
