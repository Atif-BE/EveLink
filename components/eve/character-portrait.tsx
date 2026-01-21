import Image from "next/image"
import { cn } from "@/lib/utils"
import { eveImageUrl } from "@/types/eve"

type CharacterPortraitProps = {
  characterId: number
  characterName: string
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
  showBorder?: boolean
}

const sizeMap = {
  sm: { container: "h-8 w-8", pixels: 32 as const },
  md: { container: "h-12 w-12", pixels: 64 as const },
  lg: { container: "h-16 w-16", pixels: 128 as const },
  xl: { container: "h-24 w-24", pixels: 128 as const },
}

export function CharacterPortrait({
  characterId,
  characterName,
  size = "lg",
  className,
  showBorder = true,
}: Readonly<CharacterPortraitProps>) {
  const { container, pixels } = sizeMap[size]

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-full",
        showBorder && "ring-2 ring-eve-cyan/50",
        container,
        className
      )}
    >
      <Image
        src={eveImageUrl.character(characterId, pixels)}
        alt={characterName}
        fill
        className="object-cover"
        unoptimized
      />
    </div>
  )
}
