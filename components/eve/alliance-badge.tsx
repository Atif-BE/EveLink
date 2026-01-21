import Image from "next/image"
import { cn } from "@/lib/utils"
import { AllianceDisplay, eveImageUrl } from "@/types/eve"

type AllianceBadgeProps = {
  alliance: AllianceDisplay
  size?: "sm" | "md" | "lg"
  showLogo?: boolean
  className?: string
}

const sizeMap = {
  sm: { logo: "h-4 w-4", text: "text-xs", pixels: 32 as const },
  md: { logo: "h-5 w-5", text: "text-sm", pixels: 32 as const },
  lg: { logo: "h-6 w-6", text: "text-lg", pixels: 32 as const }
}

export function AllianceBadge({
  alliance,
  size = "md",
  showLogo = true,
  className,
}: Readonly<AllianceBadgeProps>) {
  const { logo, text, pixels } = sizeMap[size]

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {showLogo && (
        <div className={cn("relative shrink-0 overflow-hidden rounded", logo)}>
          <Image
            src={eveImageUrl.alliance(alliance.id, pixels)}
            alt={alliance.name}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      )}
      <span className={cn("font-body text-eve-text-secondary", text)}>
        {alliance.name}{" "}
        <span className="text-eve-text-muted">&lt;{alliance.ticker}&gt;</span>
      </span>
    </div>
  )
}
