"use client"

import { useState } from "react"
import Image from "next/image"
import { Calendar, ExternalLink, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { eveImageUrl } from "@/types/eve"
import { SrpStatusBadge } from "./srp-status-badge"
import { FitValidationBadge } from "./fit-validation-badge"
import type { SrpRequestWithFleet } from "@/types/db"
import type { SrpRequestStatus, FitValidationStatus, FitDifferences } from "@/types/srp"

type SrpRequestCardProps = {
  request: SrpRequestWithFleet
  className?: string
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
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export const SrpRequestCard = ({ request, className }: SrpRequestCardProps) => {
  const [showDifferences, setShowDifferences] = useState(false)
  const differences = request.fitDifferences as FitDifferences | null

  return (
    <div
      className={cn(
        "rounded-xl border border-eve-border bg-eve-deep p-4 transition-colors",
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-eve-border bg-eve-void">
          <Image
            src={eveImageUrl.type(request.shipTypeId, 64)}
            alt={request.shipName}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h3 className="font-display text-base font-semibold text-eve-text">
                {request.shipName}
              </h3>
              <p className="text-sm text-eve-text-muted">{request.fleet.name}</p>
            </div>
            <SrpStatusBadge status={request.status as SrpRequestStatus} />
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm">
            <div className="flex items-center gap-1.5 text-eve-cyan font-medium">
              {formatIsk(request.iskValue)}
            </div>

            <div className="flex items-center gap-1.5 text-eve-text-secondary">
              <Calendar className="h-3.5 w-3.5 text-eve-text-muted" />
              {formatDate(request.submittedAt)}
            </div>

            <FitValidationBadge
              validation={request.fitValidation as FitValidationStatus}
              matchScore={request.fitMatchScore}
            />

            <a
              href={`https://zkillboard.com/kill/${request.killmailId}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-eve-text-muted hover:text-eve-cyan transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="text-xs">zKillboard</span>
            </a>
          </div>
        </div>
      </div>

      {differences && (differences.missingModules.length > 0 || differences.extraModules.length > 0) && (
        <div className="mt-3">
          <button
            onClick={() => setShowDifferences(!showDifferences)}
            className="flex items-center gap-1.5 text-xs text-eve-text-muted hover:text-eve-text transition-colors"
          >
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 transition-transform",
                showDifferences && "rotate-180"
              )}
            />
            Fit Differences
          </button>

          <AnimatePresence>
            {showDifferences && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="mt-2 rounded-lg bg-eve-void/50 p-3 text-xs space-y-2">
                  {differences.missingModules.length > 0 && (
                    <div>
                      <p className="text-eve-red font-medium mb-1">Missing Modules:</p>
                      <ul className="space-y-0.5 text-eve-text-muted">
                        {differences.missingModules.map((mod, i) => (
                          <li key={i}>
                            {mod.name} ({mod.slot})
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {differences.extraModules.length > 0 && (
                    <div>
                      <p className="text-eve-yellow font-medium mb-1">Extra Modules:</p>
                      <ul className="space-y-0.5 text-eve-text-muted">
                        {differences.extraModules.map((mod, i) => (
                          <li key={i}>
                            {mod.name} ({mod.slot})
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {request.status === "approved" && request.iskPayout && (
        <div className="mt-3 rounded-lg bg-eve-cyan/10 border border-eve-cyan/20 px-3 py-2">
          <p className="text-sm text-eve-cyan">
            Approved payout: <span className="font-semibold">{formatIsk(request.iskPayout)}</span>
          </p>
        </div>
      )}

      {request.status === "denied" && request.reviewNote && (
        <div className="mt-3 rounded-lg bg-eve-red/10 border border-eve-red/20 px-3 py-2">
          <p className="text-xs text-eve-text-muted mb-1">Denial reason:</p>
          <p className="text-sm text-eve-red">{request.reviewNote}</p>
        </div>
      )}
    </div>
  )
}
