import { cn } from "@/lib/utils"
import { Shield, Calendar, Dna } from "lucide-react"

type QuickStatsPanelProps = {
  securityStatus: number
  birthday: Date
  raceName: string
  bloodlineName: string
  className?: string
}

function formatAccountAge(birthday: Date): string {
  const now = new Date()
  const diff = now.getTime() - birthday.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const years = Math.floor(days / 365)
  const remainingDays = days % 365
  const months = Math.floor(remainingDays / 30)

  if (years > 0) {
    return months > 0 ? `${years}y ${months}m` : `${years}y`
  }
  if (months > 0) {
    return `${months}m`
  }
  return `${days}d`
}

function getSecurityStatusColor(status: number): string {
  if (status >= 5) return "text-green-400"
  if (status >= 0) return "text-eve-text-primary"
  if (status >= -5) return "text-orange-400"
  return "text-red-400"
}

export function QuickStatsPanel({
  securityStatus,
  birthday,
  raceName,
  bloodlineName,
  className,
}: Readonly<QuickStatsPanelProps>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-eve-border bg-eve-deep/50 p-4 backdrop-blur",
        className
      )}
    >
      <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-eve-text-secondary">
        Quick Stats
      </h3>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-eve-void/50">
            <Shield className="h-4 w-4 text-eve-text-muted" />
          </div>
          <div>
            <p className="font-body text-xs text-eve-text-muted">Security Status</p>
            <p
              className={cn(
                "font-display text-sm font-semibold",
                getSecurityStatusColor(securityStatus)
              )}
            >
              {securityStatus.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-eve-void/50">
            <Calendar className="h-4 w-4 text-eve-text-muted" />
          </div>
          <div>
            <p className="font-body text-xs text-eve-text-muted">Account Age</p>
            <p className="font-display text-sm font-semibold text-eve-text-primary">
              {formatAccountAge(birthday)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-eve-void/50">
            <Dna className="h-4 w-4 text-eve-text-muted" />
          </div>
          <div>
            <p className="font-body text-xs text-eve-text-muted">Bloodline</p>
            <p className="font-display text-sm font-semibold text-eve-text-primary">
              {raceName} / {bloodlineName}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
