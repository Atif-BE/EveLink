"use client"

import { useState, useTransition } from "react"
import Image from "next/image"
import { Shield, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { eveImageUrl } from "@/types/eve"
import { submitSrpRequestAction } from "@/app/(dashboard)/dashboard/srp/actions"
import type { EligibleLoss } from "@/types/srp"

type SrpSubmitDialogProps = {
  loss: EligibleLoss | null
  fleetId: string | null
  doctrineShipId: string | null
  fleetName: string | null
  onClose: () => void
  onSuccess: () => void
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

export const SrpSubmitDialog = ({
  loss,
  fleetId,
  doctrineShipId,
  fleetName,
  onClose,
  onSuccess,
}: SrpSubmitDialogProps) => {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = () => {
    if (!loss || !fleetId || !doctrineShipId) return

    setError(null)
    startTransition(async () => {
      const result = await submitSrpRequestAction(
        fleetId,
        loss.killmailId,
        loss.killmailHash,
        doctrineShipId,
        loss.iskValue
      )

      if (result.success) {
        onSuccess()
        onClose()
      } else {
        setError(result.error ?? "Failed to submit SRP request")
      }
    })
  }

  const isOpen = Boolean(loss && fleetId && doctrineShipId)

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="border-eve-border bg-eve-deep sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-eve-text">
            Submit SRP Request
          </DialogTitle>
          <DialogDescription className="text-eve-text-muted">
            Request ship replacement for your loss.
          </DialogDescription>
        </DialogHeader>

        {loss && (
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
                <span className="text-eve-text font-medium">{fleetName}</span>
              </div>
            </div>

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

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                disabled={isPending}
                className="text-eve-text-secondary hover:bg-eve-void hover:text-eve-text"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isPending}
                className="bg-eve-cyan text-eve-void hover:bg-eve-cyan/90"
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Request
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
