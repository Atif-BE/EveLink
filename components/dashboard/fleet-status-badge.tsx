import { cn } from "@/lib/utils"
import type { FleetStatus } from "@/types/fleet"

type FleetStatusBadgeProps = {
  status: FleetStatus
  className?: string
}

const statusConfig: Record<FleetStatus, { label: string; classes: string }> = {
  scheduled: {
    label: "Scheduled",
    classes: "bg-eve-cyan/10 text-eve-cyan border-eve-cyan/30",
  },
  active: {
    label: "Active",
    classes: "bg-eve-green/10 text-eve-green border-eve-green/30",
  },
  completed: {
    label: "Completed",
    classes: "bg-eve-text-muted/10 text-eve-text-muted border-eve-text-muted/30",
  },
  cancelled: {
    label: "Cancelled",
    classes: "bg-eve-red/10 text-eve-red border-eve-red/30",
  },
}

export const FleetStatusBadge = ({
  status,
  className,
}: FleetStatusBadgeProps) => {
  const config = statusConfig[status]

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        config.classes,
        className
      )}
    >
      {status === "active" && (
        <span className="mr-1.5 h-1.5 w-1.5 animate-pulse rounded-full bg-eve-green" />
      )}
      {config.label}
    </span>
  )
}
