"use client"

import { cn } from "@/lib/utils"
import type { ParsedFitting, FittingModule } from "@/types/fitting"

type SlotSectionProps = {
  title: string
  modules: FittingModule[]
  accentColor: string
}

const SlotSection = ({ title, modules, accentColor }: SlotSectionProps) => {
  if (modules.length === 0) return null

  return (
    <div className="space-y-1">
      <h4
        className={cn(
          "text-[10px] font-semibold uppercase tracking-wider",
          accentColor
        )}
      >
        {title}
      </h4>
      <div className="space-y-0.5">
        {modules.map((module, idx) => (
          <div
            key={`${module.name}-${idx}`}
            className="flex items-center justify-between text-xs"
          >
            <span className="truncate text-eve-text-secondary">
              {module.name}
            </span>
            {module.quantity > 1 && (
              <span className="ml-2 shrink-0 text-eve-text-muted">
                x{module.quantity}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

type FittingDisplayProps = {
  fitting: ParsedFitting
  className?: string
}

export const FittingDisplay = ({ fitting, className }: FittingDisplayProps) => {
  return (
    <div className={cn("space-y-3 rounded-lg bg-eve-void/30 p-3", className)}>
      <SlotSection
        title="High Slots"
        modules={fitting.highSlots}
        accentColor="text-eve-red"
      />
      <SlotSection
        title="Mid Slots"
        modules={fitting.midSlots}
        accentColor="text-eve-cyan"
      />
      <SlotSection
        title="Low Slots"
        modules={fitting.lowSlots}
        accentColor="text-amber-400"
      />
      <SlotSection
        title="Rigs"
        modules={fitting.rigs}
        accentColor="text-purple-400"
      />
      <SlotSection
        title="Drones"
        modules={fitting.drones}
        accentColor="text-eve-green"
      />
      <SlotSection
        title="Cargo"
        modules={fitting.cargo}
        accentColor="text-eve-text-muted"
      />
    </div>
  )
}
