"use client"

import { useState, useTransition } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Copy, Check, Upload, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  eveImageUrl,
  type ParsedFitting,
  type SkillRequirement,
  type CharacterFlyability,
  type DoctrineShipWithDoctrine,
  type ShipRole,
} from "@/types"
import { RoleBadge } from "@/components/eve/role-badge"
import { FittingDisplay } from "./fitting-display"
import { SkillSidebar } from "./skill-sidebar"
import { saveFittingToEve } from "@/app/(dashboard)/dashboard/doctrines/[id]/actions"

type ShipDetailViewProps = {
  ship: DoctrineShipWithDoctrine
  fitting: ParsedFitting
  skillRequirements: SkillRequirement[]
  characterFlyability: CharacterFlyability[]
  className?: string
}

export const ShipDetailView = ({
  ship,
  fitting,
  skillRequirements,
  characterFlyability,
  className,
}: ShipDetailViewProps) => {
  const [copied, setCopied] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle")
  const [saveError, setSaveError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

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
    <div className={cn("space-y-6", className)}>
      <Link
        href={`/dashboard/doctrines/${ship.doctrineId}`}
        className="inline-flex items-center gap-2 text-sm text-eve-text-muted transition-colors hover:text-eve-cyan"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to {ship.doctrine.name}
      </Link>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-xl border border-eve-border bg-eve-deep p-4 lg:sticky lg:top-6 lg:self-start">
          <SkillSidebar
            skillRequirements={skillRequirements}
            characterFlyability={characterFlyability}
          />
        </aside>

        <main className="space-y-6">
          <div className="flex flex-col items-center gap-4 rounded-xl border border-eve-border bg-eve-deep p-6 sm:flex-row sm:items-start">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-eve-border bg-eve-void">
              <Image
                src={eveImageUrl.render(ship.shipTypeId, 256)}
                alt={ship.shipName}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="font-display text-2xl font-bold text-eve-text">
                {ship.shipName}
              </h1>
              <p className="mt-1 text-eve-text-muted">{ship.fitName}</p>
              <div className="mt-2">
                <RoleBadge role={ship.role as ShipRole} />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-eve-border bg-eve-deep p-6">
            <h2 className="mb-4 font-display text-base font-semibold uppercase tracking-wider text-eve-text-secondary">
              Fitting
            </h2>
            <FittingDisplay fitting={fitting} />

            <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-eve-border/30 pt-4">
              <button
                onClick={handleCopyFit}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
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
                  "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
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
        </main>
      </div>
    </div>
  )
}
