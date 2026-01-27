import { cn } from "@/lib/utils"
import type { CloneState } from "@/types"

type CloneStateBadgeProps = {
  state: CloneState
  className?: string
}

export const CloneStateBadge = ({ state, className }: CloneStateBadgeProps) => {
  if (state === "unknown") return null

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded px-2 py-0.5 font-display text-[10px] uppercase tracking-wider",
        state === "omega" && "bg-eve-green/15 text-eve-green border border-eve-green/30",
        state === "alpha" && "bg-amber-500/15 text-amber-400 border border-amber-500/30",
        className
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          state === "omega" && "bg-eve-green",
          state === "alpha" && "bg-amber-400"
        )}
      />
      {state}
    </span>
  )
}
