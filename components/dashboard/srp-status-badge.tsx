import { cn } from "@/lib/utils"
import type { SrpRequestStatus } from "@/types/srp"

type SrpStatusBadgeProps = {
  status: SrpRequestStatus
  className?: string
}

const statusConfig: Record<SrpRequestStatus, { label: string; classes: string }> = {
  pending: {
    label: "Pending",
    classes: "bg-eve-yellow/10 text-eve-yellow border-eve-yellow/30",
  },
  approved: {
    label: "Approved",
    classes: "bg-eve-cyan/10 text-eve-cyan border-eve-cyan/30",
  },
  denied: {
    label: "Denied",
    classes: "bg-eve-red/10 text-eve-red border-eve-red/30",
  },
  paid: {
    label: "Paid",
    classes: "bg-eve-green/10 text-eve-green border-eve-green/30",
  },
}

export const SrpStatusBadge = ({ status, className }: SrpStatusBadgeProps) => {
  const config = statusConfig[status]

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        config.classes,
        className
      )}
    >
      {status === "pending" && (
        <span className="mr-1.5 h-1.5 w-1.5 animate-pulse rounded-full bg-eve-yellow" />
      )}
      {config.label}
    </span>
  )
}
