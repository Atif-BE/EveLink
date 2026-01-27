"use client"

import { useState, useTransition } from "react"
import Image from "next/image"
import { ChevronDown, ChevronUp, Trash2, Copy, Check, Upload, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { eveImageUrl, type DoctrineShip, type ParsedFitting, type ShipRole } from "@/types"
import { RoleBadge } from "@/components/eve/role-badge"
import { FittingDisplay } from "./fitting-display"
import { saveFittingToEve } from "@/app/(dashboard)/dashboard/doctrines/[id]/actions"

type DoctrineShipCardProps = {
  ship: DoctrineShip
  onDelete?: (shipId: string) => void
  className?: string
}

export const DoctrineShipCard = ({
  ship,
  onDelete,
  className,
}: DoctrineShipCardProps) => {
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle")
  const [saveError, setSaveError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const fitting = ship.fitting as ParsedFitting

  const handleCopyFit = async () => {
    try {
      await navigator.clipboard.writeText(ship.rawEft)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
    }
  }

  const handleSaveToEve = () => {
    setSaveStatus("idle")
    setSaveError(null)
    startTransition(async () => {
      const result = await saveFittingToEve(fitting, ship.shipTypeId)
      if (result.success) {
        setSaveStatus("success")
        setTimeout(() => setSaveStatus("idle"), 3000)
      } else {
        setSaveStatus("error")
        setSaveError(result.error ?? "Failed to save")
      }
    })
  }

  return (
    <div
      className={cn(
        "rounded-xl border border-eve-border bg-eve-deep transition-all duration-200",
        expanded && "ring-1 ring-eve-cyan/30",
        className
      )}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-4 p-4 text-left"
      >
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-eve-border bg-eve-void">
          <Image
            src={eveImageUrl.render(ship.shipTypeId, 64)}
            alt={ship.shipName}
            fill
            className="object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="truncate font-display text-sm font-medium text-eve-text">
              {ship.shipName}
            </h4>
            <RoleBadge role={ship.role as ShipRole} />
          </div>
          <p className="truncate text-sm text-eve-text-muted">{ship.fitName}</p>
        </div>

        <div className="flex items-center gap-2">
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete(ship.id)
              }}
              className="rounded-lg p-2 text-eve-text-muted transition-colors hover:bg-eve-red/10 hover:text-eve-red"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
          <div className="text-eve-text-muted">
            {expanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </div>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-eve-border/50 p-4">
          <FittingDisplay fitting={fitting} />

          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-eve-border/30 pt-4">
            <button
              onClick={handleCopyFit}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                copied
                  ? "bg-eve-green/20 text-eve-green"
                  : "bg-eve-void text-eve-text-muted hover:bg-eve-cyan/10 hover:text-eve-cyan"
              )}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy Fit
                </>
              )}
            </button>

            <button
              onClick={handleSaveToEve}
              disabled={isPending}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                saveStatus === "success"
                  ? "bg-eve-green/20 text-eve-green"
                  : saveStatus === "error"
                    ? "bg-eve-red/20 text-eve-red"
                    : "bg-eve-void text-eve-text-muted hover:bg-eve-cyan/10 hover:text-eve-cyan",
                isPending && "cursor-not-allowed opacity-50"
              )}
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : saveStatus === "success" ? (
                <>
                  <Check className="h-4 w-4" />
                  Saved to EVE
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Save to EVE
                </>
              )}
            </button>

            {saveStatus === "error" && saveError && (
              <span className="text-xs text-eve-red">{saveError}</span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
