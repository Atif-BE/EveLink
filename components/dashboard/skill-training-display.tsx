"use client"

import { useState, useEffect, useMemo } from "react"
import { Brain, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

type SkillTrainingDisplayProps = {
  skillName: string | null
  finishedLevel: number | null
  finishDate: string | null
  className?: string
}

const formatTimeRemaining = (endDate: Date): string => {
  const now = new Date()
  const diff = endDate.getTime() - now.getTime()

  if (diff <= 0) return "Complete"

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  const parts: string[] = []
  if (days > 0) parts.push(`${days}d`)
  if (hours > 0) parts.push(`${hours}h`)
  if (minutes > 0 || parts.length === 0) parts.push(`${minutes}m`)

  return parts.join(" ")
}

const romanNumerals = ["I", "II", "III", "IV", "V"]

export const SkillTrainingDisplay = ({
  skillName,
  finishedLevel,
  finishDate,
  className,
}: SkillTrainingDisplayProps) => {
  const endDate = useMemo(
    () => (finishDate ? new Date(finishDate) : null),
    [finishDate]
  )

  const initialTime = useMemo(
    () => (endDate ? formatTimeRemaining(endDate) : null),
    [endDate]
  )

  const [timeRemaining, setTimeRemaining] = useState(initialTime)

  useEffect(() => {
    if (!endDate) return

    const interval = setInterval(() => {
      setTimeRemaining(formatTimeRemaining(endDate))
    }, 60000)

    return () => clearInterval(interval)
  }, [endDate])

  if (!skillName || !finishedLevel) {
    return (
      <div className={cn("flex items-center gap-2 text-eve-text-muted", className)}>
        <Brain className="h-4 w-4 opacity-50" />
        <span className="text-sm">No skill in training</span>
      </div>
    )
  }

  const levelDisplay = romanNumerals[finishedLevel - 1] || finishedLevel

  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex items-center gap-2">
        <Brain className="h-4 w-4 text-eve-cyan" />
        <span className="text-sm text-eve-text-primary truncate">
          {skillName} {levelDisplay}
        </span>
      </div>
      {timeRemaining && (
        <div className="flex items-center gap-1.5 pl-6">
          <Clock className="h-3 w-3 text-eve-text-muted" />
          <span className="text-xs text-eve-text-secondary">{timeRemaining}</span>
        </div>
      )}
    </div>
  )
}
