import { cn } from "@/lib/utils"
import type { ShipRole } from "@/types"

const roleColors: Record<ShipRole, string> = {
  DPS: "bg-eve-red/20 text-eve-red border-eve-red/30",
  Logi: "bg-eve-green/20 text-eve-green border-eve-green/30",
  Support: "bg-eve-cyan/20 text-eve-cyan border-eve-cyan/30",
  Tackle: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  EWAR: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  Scout: "bg-sky-500/20 text-sky-400 border-sky-500/30",
  Command: "bg-rose-500/20 text-rose-400 border-rose-500/30",
  Capital: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  Other: "bg-eve-text-muted/20 text-eve-text-muted border-eve-text-muted/30",
}

type RoleBadgeProps = {
  role: ShipRole
  size?: "sm" | "default"
  className?: string
}

export const RoleBadge = ({ role, size = "default", className }: RoleBadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border font-medium",
        size === "sm" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-xs",
        roleColors[role],
        className
      )}
    >
      {role}
    </span>
  )
}
