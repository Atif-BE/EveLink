"use client"

import { useState, useEffect, useMemo } from "react"
import { Shield, Skull, RefreshCw, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SrpRequestCard } from "./srp-request-card"
import { EligibleLossCard } from "./eligible-loss-card"
import { SrpSubmitDialog } from "./srp-submit-dialog"
import type { SrpRequestWithFleet, FleetWithRelations } from "@/types/db"
import type { EligibleLoss } from "@/types/srp"
import type { ZKillboardEntry } from "@/types/zkillboard"

type SrpListPanelProps = {
  srpRequests: SrpRequestWithFleet[]
  srpFleets: FleetWithRelations[]
  characterIds: number[]
  className?: string
}

type LossWithMeta = {
  entry: ZKillboardEntry
  shipTypeId: number
  shipName: string
  killmailTime: Date
}

const LOSS_AGE_LIMIT_DAYS = 30

export const SrpListPanel = ({
  srpRequests,
  srpFleets,
  characterIds,
  className,
}: SrpListPanelProps) => {
  const [eligibleLosses, setEligibleLosses] = useState<EligibleLoss[]>([])
  const [isLoadingLosses, setIsLoadingLosses] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)
  const [selectedLoss, setSelectedLoss] = useState<EligibleLoss | null>(null)

  const existingKillmailIds = useMemo(
    () => new Set(srpRequests.map((r) => `${r.killmailId}-${r.fleetId}`)),
    [srpRequests]
  )

  useEffect(() => {
    const fetchLosses = async () => {
      setIsLoadingLosses(true)
      try {
        const allLosses: LossWithMeta[] = []

        for (const charId of characterIds) {
          const res = await fetch(
            `https://zkillboard.com/api/losses/characterID/${charId}/`
          )
          if (res.ok) {
            const entries: ZKillboardEntry[] = await res.json()

            for (const entry of entries.slice(0, 20)) {
              try {
                const kmRes = await fetch(
                  `https://esi.evetech.net/latest/killmails/${entry.killmail_id}/${entry.zkb.hash}/`
                )
                if (kmRes.ok) {
                  const km = await kmRes.json()
                  if (km.victim?.ship_type_id) {
                    const killmailTime = new Date(km.killmail_time)
                    const ageMs = Date.now() - killmailTime.getTime()
                    const ageLimitMs = LOSS_AGE_LIMIT_DAYS * 24 * 60 * 60 * 1000

                    if (ageMs > ageLimitMs) continue

                    let shipName = "Unknown Ship"
                    try {
                      const typeRes = await fetch(
                        `https://esi.evetech.net/latest/universe/types/${km.victim.ship_type_id}/`
                      )
                      if (typeRes.ok) {
                        const typeData = await typeRes.json()
                        shipName = typeData.name
                      }
                    } catch {}

                    allLosses.push({
                      entry,
                      shipTypeId: km.victim.ship_type_id,
                      shipName,
                      killmailTime,
                    })
                  }
                }
              } catch {}
            }
          }
        }

        const eligible: EligibleLoss[] = []

        for (const loss of allLosses) {
          const matchingFleets: EligibleLoss["matchingFleets"] = []

          for (const fleet of srpFleets) {
            if (!fleet.doctrine?.ships) continue

            for (const ship of fleet.doctrine.ships) {
              if (ship.shipTypeId === loss.shipTypeId) {
                const key = `${loss.entry.killmail_id}-${fleet.id}`
                if (!existingKillmailIds.has(key)) {
                  matchingFleets.push({
                    fleetId: fleet.id,
                    fleetName: fleet.name,
                    doctrineShipId: ship.id,
                    doctrineShipName: ship.shipName,
                    scheduledAt: fleet.scheduledAt,
                  })
                }
                break
              }
            }
          }

          if (matchingFleets.length > 0) {
            eligible.push({
              killmailId: loss.entry.killmail_id,
              killmailHash: loss.entry.zkb.hash,
              shipTypeId: loss.shipTypeId,
              shipName: loss.shipName,
              iskValue: loss.entry.zkb.totalValue,
              killmailTime: loss.killmailTime,
              matchingFleets,
            })
          }
        }

        setEligibleLosses(eligible)
      } catch {
        setEligibleLosses([])
      } finally {
        setIsLoadingLosses(false)
      }
    }

    fetchLosses()
  }, [characterIds, srpFleets, refreshKey, existingKillmailIds])

  const handleDialogClose = () => {
    setSelectedLoss(null)
  }

  const handleSuccess = () => {
    setRefreshKey((k) => k + 1)
  }

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-eve-cyan/10 border border-eve-cyan/30">
            <Shield className="h-5 w-5 text-eve-cyan" />
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold text-eve-text">
              Ship Replacement Program
            </h2>
            <p className="text-xs text-eve-text-muted">
              Submit reimbursement requests for fleet losses
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="eligible" className="space-y-4">
        <TabsList className="bg-eve-void/50 border border-eve-border">
          <TabsTrigger
            value="eligible"
            className="data-[state=active]:bg-eve-cyan/20 data-[state=active]:text-eve-cyan"
          >
            <Skull className="mr-1.5 h-4 w-4" />
            Eligible Losses
            {eligibleLosses.length > 0 && (
              <span className="ml-1.5 rounded-full bg-eve-cyan/20 px-1.5 py-0.5 text-xs">
                {eligibleLosses.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="requests"
            className="data-[state=active]:bg-eve-cyan/20 data-[state=active]:text-eve-cyan"
          >
            <Shield className="mr-1.5 h-4 w-4" />
            My Requests
            {srpRequests.length > 0 && (
              <span className="ml-1.5 rounded-full bg-eve-cyan/20 px-1.5 py-0.5 text-xs">
                {srpRequests.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="eligible" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-eve-text-muted">
              Recent losses matching doctrine ships from SRP-eligible fleets
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setRefreshKey((k) => k + 1)}
              disabled={isLoadingLosses}
              className="text-eve-text-muted hover:text-eve-text"
            >
              <RefreshCw
                className={cn("h-4 w-4", isLoadingLosses && "animate-spin")}
              />
            </Button>
          </div>

          {isLoadingLosses ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-eve-cyan mb-4" />
              <p className="text-sm text-eve-text-muted">Loading losses...</p>
            </div>
          ) : eligibleLosses.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3"
            >
              {eligibleLosses.map((loss) => (
                <EligibleLossCard
                  key={loss.killmailId}
                  loss={loss}
                  onStartRequest={() => setSelectedLoss(loss)}
                />
              ))}
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-eve-border/50 bg-eve-deep/50 py-16">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-eve-void/50">
                <Skull className="h-8 w-8 text-eve-text-muted/50" />
              </div>
              <h3 className="mb-2 font-display text-base font-medium text-eve-text">
                No Eligible Losses
              </h3>
              <p className="max-w-sm text-center text-sm text-eve-text-muted">
                {srpFleets.length === 0
                  ? "No SRP-eligible fleets are currently available."
                  : "No recent losses match doctrine ships from SRP-eligible fleets."}
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          {srpRequests.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3"
            >
              {srpRequests.map((request) => (
                <SrpRequestCard key={request.id} request={request} />
              ))}
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-eve-border/50 bg-eve-deep/50 py-16">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-eve-void/50">
                <Shield className="h-8 w-8 text-eve-text-muted/50" />
              </div>
              <h3 className="mb-2 font-display text-base font-medium text-eve-text">
                No SRP Requests
              </h3>
              <p className="max-w-sm text-center text-sm text-eve-text-muted">
                You haven&apos;t submitted any SRP requests yet. Check the Eligible
                Losses tab for losses you can submit.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <SrpSubmitDialog
        loss={selectedLoss}
        onClose={handleDialogClose}
        onSuccess={handleSuccess}
      />
    </div>
  )
}
