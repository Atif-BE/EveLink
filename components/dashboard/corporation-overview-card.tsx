import Image from "next/image"
import { cn } from "@/lib/utils"
import { Users, Percent, Crown } from "lucide-react"
import type { CorporationDisplay } from "@/types/eve"

type CorporationOverviewCardProps = {
  corporation: CorporationDisplay
  memberCount: number
  taxRate: number
  ceoName: string
  className?: string
}

export function CorporationOverviewCard({
  corporation,
  memberCount,
  taxRate,
  ceoName,
  className,
}: Readonly<CorporationOverviewCardProps>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-eve-border bg-eve-deep/50 p-4 backdrop-blur",
        className
      )}
    >
      <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-eve-text-secondary">
        Corporation
      </h3>

      <div className="flex items-start gap-4">
        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-eve-border bg-eve-void/50">
          <Image
            src={corporation.logo}
            alt={corporation.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <h4 className="truncate font-display text-lg font-semibold text-eve-text-primary">
            {corporation.name}
          </h4>
          <p className="font-body text-sm text-eve-text-muted">
            [{corporation.ticker}]
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="rounded-lg bg-eve-void/30 p-3">
          <div className="flex items-center gap-2 text-eve-text-muted">
            <Users className="h-3.5 w-3.5" />
            <span className="font-body text-xs">Members</span>
          </div>
          <p className="mt-1 font-display text-lg font-semibold text-eve-text-primary">
            {memberCount.toLocaleString()}
          </p>
        </div>

        <div className="rounded-lg bg-eve-void/30 p-3">
          <div className="flex items-center gap-2 text-eve-text-muted">
            <Percent className="h-3.5 w-3.5" />
            <span className="font-body text-xs">Tax Rate</span>
          </div>
          <p className="mt-1 font-display text-lg font-semibold text-eve-text-primary">
            {(taxRate * 100).toFixed(0)}%
          </p>
        </div>

        <div className="rounded-lg bg-eve-void/30 p-3">
          <div className="flex items-center gap-2 text-eve-text-muted">
            <Crown className="h-3.5 w-3.5" />
            <span className="font-body text-xs">CEO</span>
          </div>
          <p className="mt-1 truncate font-display text-sm font-semibold text-eve-text-primary">
            {ceoName}
          </p>
        </div>
      </div>
    </div>
  )
}
