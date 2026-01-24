import Image from "next/image"
import { Check, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { eveImageUrl } from "@/types/eve"
import type { SkillRequirement, CharacterFlyability } from "@/lib/esi"

type SkillSidebarProps = {
  skillRequirements: SkillRequirement[]
  characterFlyability: CharacterFlyability[]
  className?: string
}

export const SkillSidebar = ({
  skillRequirements,
  characterFlyability,
  className,
}: SkillSidebarProps) => {
  const romanNumerals = ["", "I", "II", "III", "IV", "V"]

  return (
    <div className={cn("space-y-6", className)}>
      <div>
        <h3 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-eve-text-secondary">
          Minimum Skills
        </h3>
        {skillRequirements.length === 0 ? (
          <p className="text-sm text-eve-text-muted">No skill requirements</p>
        ) : (
          <div className="space-y-1.5">
            {skillRequirements.map((skill) => (
              <div
                key={skill.skillId}
                className="flex items-center justify-between text-sm"
              >
                <span className="truncate text-eve-text-secondary">
                  {skill.skillName}
                </span>
                <span className="ml-2 shrink-0 font-medium text-eve-cyan">
                  {romanNumerals[skill.requiredLevel] || skill.requiredLevel}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-eve-text-secondary">
          Can Fly
        </h3>
        {characterFlyability.length === 0 ? (
          <p className="text-sm text-eve-text-muted">No characters linked</p>
        ) : (
          <div className="space-y-2">
            {characterFlyability.map((char) => (
              <div
                key={char.characterId}
                className="flex items-center gap-2"
              >
                <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-md border border-eve-border">
                  <Image
                    src={eveImageUrl.character(char.characterId, 64)}
                    alt={char.characterName}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="min-w-0 flex-1 truncate text-sm text-eve-text-secondary">
                  {char.characterName}
                </span>
                {char.canFly ? (
                  <Check className="h-4 w-4 shrink-0 text-eve-green" />
                ) : (
                  <X className="h-4 w-4 shrink-0 text-eve-red" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
