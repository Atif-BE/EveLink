import Image from "next/image"
import { cn } from "@/lib/utils"
import { eveImageUrl, type CorporationDisplay } from "@/types"

type CorporationBadgeProps = {
  corporation: CorporationDisplay
  size?: "sm" | "md" | "lg"
  showLogo?: boolean
  className?: string
}

const sizeMap = {
  sm: { logo: "h-4 w-4", text: "text-xs", pixels: 32 as const },
  md: { logo: "h-5 w-5", text: "text-sm", pixels: 32 as const },
  lg: { logo: "h-6 w-6", text: "text-lg", pixels: 32 as const }
}

export function CorporationBadge({
  corporation,
  size = "md",
  showLogo = true,
  className,
}: Readonly<CorporationBadgeProps>) {
  const { logo, text, pixels } = sizeMap[size]

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {showLogo && (
        <div className={cn("relative shrink-0 overflow-hidden rounded", logo)}>
          <Image
            src={eveImageUrl.corporation(corporation.id, pixels)}
            alt={corporation.name}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      )}
      <span className={cn("font-body text-eve-text-secondary", text)}>
        {corporation.name}{" "}
        <span className="text-eve-text-muted">[{corporation.ticker}]</span>
      </span>
    </div>
  )
}
