import { cn } from "@/lib/utils"

type EveLogoProps = {
  className?: string
  size?: "sm" | "md" | "lg"
}

const sizeMap = {
  sm: "text-2xl",
  md: "text-4xl",
  lg: "text-6xl",
}

export const EveLogo = ({ className, size = "md" }: EveLogoProps) => {
  return (
    <div
      className={cn(
        "font-display font-bold tracking-wider",
        sizeMap[size],
        className
      )}
    >
      <span className="text-eve-cyan text-glow-cyan">EVE</span>
      <span className="text-eve-text-primary">LINK</span>
    </div>
  )
}
