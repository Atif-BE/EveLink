import { CheckCircle, AlertCircle, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { FitValidationStatus } from "@/types/srp"

type FitValidationBadgeProps = {
  validation: FitValidationStatus
  matchScore?: number
  className?: string
}

const validationConfig: Record<
  FitValidationStatus,
  { label: string; classes: string; icon: typeof CheckCircle }
> = {
  valid: {
    label: "Valid Fit",
    classes: "bg-eve-green/10 text-eve-green border-eve-green/30",
    icon: CheckCircle,
  },
  partial: {
    label: "Partial Match",
    classes: "bg-eve-yellow/10 text-eve-yellow border-eve-yellow/30",
    icon: AlertCircle,
  },
  invalid: {
    label: "Invalid Fit",
    classes: "bg-eve-red/10 text-eve-red border-eve-red/30",
    icon: XCircle,
  },
}

export const FitValidationBadge = ({
  validation,
  matchScore,
  className,
}: FitValidationBadgeProps) => {
  const config = validationConfig[validation]
  const Icon = config.icon

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        config.classes,
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {config.label}
      {matchScore !== undefined && (
        <span className="text-xs opacity-75">({Math.round(matchScore * 100)}%)</span>
      )}
    </span>
  )
}
