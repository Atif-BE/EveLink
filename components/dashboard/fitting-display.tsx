"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import type { ParsedFitting, FittingModule } from "@/types"

type SlotSectionProps = {
  title: string
  modules: FittingModule[]
  accentColor: string
}

const SlotSection = ({ title, modules, accentColor }: SlotSectionProps) => {
  if (modules.length === 0) return null

  return (
    <div className="space-y-2">
      <h4
        className={cn(
          "text-sm font-semibold uppercase tracking-wider",
          accentColor
        )}
      >
        {title}
      </h4>
      <div className="space-y-1.5">
        {modules.map((module, idx) => (
          <div
            key={`${module.name}-${idx}`}
            className="flex items-center gap-3 text-base"
          >
            {module.typeId ? (
              <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded border border-eve-border/50 bg-eve-void">
                <Image
                  src={`https://images.evetech.net/types/${module.typeId}/icon?size=64`}
                  alt=""
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="h-8 w-8 shrink-0 rounded border border-eve-border/30 bg-eve-void/50" />
            )}
            <span className="min-w-0 flex-1 truncate text-eve-text-secondary">
              {module.name}
            </span>
            {module.quantity > 1 && (
              <span className="shrink-0 text-eve-text-muted">
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
    <div className={cn("space-y-4 rounded-lg bg-eve-void/30 p-4", className)}>
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
