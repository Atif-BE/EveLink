"use client"

import { useTransition } from "react"
import { Crown, Wallet, Shield, Clock, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { CharacterPortrait } from "@/components/eve/character-portrait"
import { CorporationBadge } from "@/components/eve/corporation-badge"
import { AllianceBadge } from "@/components/eve/alliance-badge"
import { CloneStateBadge } from "@/components/eve/clone-state-badge"
import { SkillTrainingDisplay } from "./skill-training-display"
import { Button } from "@/components/ui/button"
import { setMainCharacter } from "@/app/(dashboard)/dashboard/characters/actions"
import type { CloneState } from "@/lib/esi"
import type { CorporationDisplay, AllianceDisplay } from "@/types/eve"

type CharacterOverviewData = {
  characterId: number
  characterName: string
  corporation: CorporationDisplay
  alliance: AllianceDisplay | null
  totalSp: number
  unallocatedSp: number
  walletBalance: number | null
  securityStatus: number | null
  lastLoginAt: Date | null
  cloneState: CloneState
  currentSkillName: string | null
  currentSkillLevel: number | null
  currentSkillFinishDate: string | null
}

type CharacterOverviewCardProps = {
  data: CharacterOverviewData
  isPrimary: boolean
  className?: string
}

const formatIsk = (amount: number): string => {
  if (amount >= 1_000_000_000) {
    return `${(amount / 1_000_000_000).toFixed(2)}B`
  }
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(2)}M`
  }
  if (amount >= 1_000) {
    return `${(amount / 1_000).toFixed(1)}K`
  }
  return amount.toFixed(0)
}

const formatSp = (sp: number): string => {
  if (sp >= 1_000_000) {
    return `${(sp / 1_000_000).toFixed(1)}M`
  }
  if (sp >= 1_000) {
    return `${(sp / 1_000).toFixed(1)}K`
  }
  return sp.toString()
}

const formatRelativeTime = (date: Date): string => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 30) return `${days}d ago`
  return date.toLocaleDateString()
}

export const CharacterOverviewCard = ({
  data,
  isPrimary,
  className,
}: CharacterOverviewCardProps) => {
  const [isPending, startTransition] = useTransition()

  const handleSetAsMain = () => {
    startTransition(async () => {
      await setMainCharacter(data.characterId)
    })
  }

  const securityColor =
    data.securityStatus === null
      ? "text-eve-text-muted"
      : data.securityStatus >= 0
        ? "text-eve-green"
        : "text-eve-red"

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border bg-eve-deep/50 backdrop-blur transition-all duration-200",
        isPrimary
          ? "border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.1)]"
          : "border-eve-border hover:border-eve-cyan/30",
        className
      )}
    >
      {isPrimary && (
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
      )}

      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="relative">
            <CharacterPortrait
              characterId={data.characterId}
              characterName={data.characterName}
              size="lg"
            />
            {isPrimary && (
              <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 shadow-lg">
                <Crown className="h-3 w-3 text-eve-void" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-display text-lg text-eve-text-primary truncate">
                {data.characterName}
              </h3>
              <CloneStateBadge state={data.cloneState} />
            </div>

            <div className="mt-1.5 space-y-1">
              <CorporationBadge corporation={data.corporation} size="sm" />
              {data.alliance && (
                <AllianceBadge alliance={data.alliance} size="sm" />
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase tracking-wider text-eve-text-muted">
              Total SP
            </span>
            <p className="font-display text-sm text-eve-text-primary">
              {formatSp(data.totalSp)} SP
            </p>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] uppercase tracking-wider text-eve-text-muted">
              Unallocated
            </span>
            <p className="font-display text-sm text-eve-cyan">
              {formatSp(data.unallocatedSp)} SP
            </p>
          </div>

          <div className="space-y-0.5">
            <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-eve-text-muted">
              <Wallet className="h-3 w-3" />
              ISK
            </span>
            <p className="font-display text-sm text-eve-text-primary">
              {data.walletBalance !== null
                ? `${formatIsk(data.walletBalance)} ISK`
                : "—"}
            </p>
          </div>

          <div className="space-y-0.5">
            <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-eve-text-muted">
              <Shield className="h-3 w-3" />
              Security
            </span>
            <p className={cn("font-display text-sm", securityColor)}>
              {data.securityStatus?.toFixed(2) ?? "—"}
            </p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-eve-border/50">
          <SkillTrainingDisplay
            skillName={data.currentSkillName}
            finishedLevel={data.currentSkillLevel}
            finishDate={data.currentSkillFinishDate}
          />
        </div>

        {data.lastLoginAt && (
          <div className="mt-3 flex items-center gap-1.5 text-eve-text-muted">
            <Clock className="h-3 w-3" />
            <span className="text-xs">
              Last seen {formatRelativeTime(data.lastLoginAt)}
            </span>
          </div>
        )}

        {!isPrimary && (
          <div className="mt-4 pt-4 border-t border-eve-border/50">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSetAsMain}
              disabled={isPending}
              className="w-full text-xs text-eve-text-secondary hover:text-amber-400 hover:bg-amber-500/10"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  Setting...
                </>
              ) : (
                <>
                  <Crown className="mr-2 h-3 w-3" />
                  Set as Main
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export type { CharacterOverviewData }
