import type {
  ParsedFitting,
  FittingModule,
  FitComparisonResult,
  FitValidationStatus,
  FitDifferences,
  KillmailItem,
} from "@/types"

const ESI_SLOT_FLAGS = {
  LOW_START: 11,
  LOW_END: 18,
  MID_START: 19,
  MID_END: 26,
  HIGH_START: 27,
  HIGH_END: 34,
  RIG_START: 92,
  RIG_END: 94,
  DRONE_BAY: 87,
  SUBSYSTEM_START: 125,
  SUBSYSTEM_END: 132,
}

type SlotCategory = "high" | "mid" | "low" | "rig" | "drone" | "other"

const getSlotCategory = (flag: number): SlotCategory => {
  if (flag >= ESI_SLOT_FLAGS.HIGH_START && flag <= ESI_SLOT_FLAGS.HIGH_END) {
    return "high"
  }
  if (flag >= ESI_SLOT_FLAGS.MID_START && flag <= ESI_SLOT_FLAGS.MID_END) {
    return "mid"
  }
  if (flag >= ESI_SLOT_FLAGS.LOW_START && flag <= ESI_SLOT_FLAGS.LOW_END) {
    return "low"
  }
  if (flag >= ESI_SLOT_FLAGS.RIG_START && flag <= ESI_SLOT_FLAGS.RIG_END) {
    return "rig"
  }
  if (flag === ESI_SLOT_FLAGS.DRONE_BAY) {
    return "drone"
  }
  return "other"
}

const getSlotLabel = (category: SlotCategory): string => {
  const labels: Record<SlotCategory, string> = {
    high: "High Slot",
    mid: "Mid Slot",
    low: "Low Slot",
    rig: "Rig",
    drone: "Drone Bay",
    other: "Other",
  }
  return labels[category]
}

type ModuleCount = Map<number, number>

const countModules = (modules: FittingModule[]): ModuleCount => {
  const counts = new Map<number, number>()
  for (const mod of modules) {
    if (mod.typeId) {
      const current = counts.get(mod.typeId) ?? 0
      counts.set(mod.typeId, current + mod.quantity)
    }
  }
  return counts
}

const countKillmailModules = (
  items: KillmailItem[],
  category: SlotCategory
): ModuleCount => {
  const counts = new Map<number, number>()
  for (const item of items) {
    if (getSlotCategory(item.flag) === category) {
      const quantity =
        (item.quantity_destroyed ?? 0) + (item.quantity_dropped ?? 0)
      const current = counts.get(item.item_type_id) ?? 0
      counts.set(item.item_type_id, current + quantity)
    }
  }
  return counts
}

type TypeNameResolver = Map<number, string>

export const compareFittings = (
  killmailItems: KillmailItem[],
  doctrineFitting: ParsedFitting,
  typeNames: TypeNameResolver
): FitComparisonResult => {
  const missingModules: FitDifferences["missingModules"] = []
  const extraModules: FitDifferences["extraModules"] = []
  let totalDoctrineModules = 0
  let matchedModules = 0

  const slotMappings: {
    category: SlotCategory
    doctrineModules: FittingModule[]
  }[] = [
    { category: "high", doctrineModules: doctrineFitting.highSlots },
    { category: "mid", doctrineModules: doctrineFitting.midSlots },
    { category: "low", doctrineModules: doctrineFitting.lowSlots },
    { category: "rig", doctrineModules: doctrineFitting.rigs },
    { category: "drone", doctrineModules: doctrineFitting.drones },
  ]

  for (const { category, doctrineModules } of slotMappings) {
    const doctrineCounts = countModules(doctrineModules)
    const killmailCounts = countKillmailModules(killmailItems, category)
    const slotLabel = getSlotLabel(category)

    for (const [typeId, doctrineQty] of doctrineCounts) {
      totalDoctrineModules += doctrineQty
      const killmailQty = killmailCounts.get(typeId) ?? 0
      const matched = Math.min(doctrineQty, killmailQty)
      matchedModules += matched

      if (killmailQty < doctrineQty) {
        const missingQty = doctrineQty - killmailQty
        const name = typeNames.get(typeId) ?? `Unknown (${typeId})`
        missingModules.push({
          name: missingQty > 1 ? `${name} x${missingQty}` : name,
          typeId,
          slot: slotLabel,
        })
      }
    }

    for (const [typeId, killmailQty] of killmailCounts) {
      const doctrineQty = doctrineCounts.get(typeId) ?? 0
      if (killmailQty > doctrineQty) {
        const extraQty = killmailQty - doctrineQty
        const name = typeNames.get(typeId) ?? `Unknown (${typeId})`
        extraModules.push({
          name: extraQty > 1 ? `${name} x${extraQty}` : name,
          typeId,
          slot: slotLabel,
        })
      }
    }
  }

  const matchScore =
    totalDoctrineModules > 0 ? matchedModules / totalDoctrineModules : 1

  let validation: FitValidationStatus
  if (matchScore >= 0.95) {
    validation = "valid"
  } else if (matchScore >= 0.7) {
    validation = "partial"
  } else {
    validation = "invalid"
  }

  const summaryParts: string[] = []
  if (missingModules.length > 0) {
    summaryParts.push(`${missingModules.length} missing modules`)
  }
  if (extraModules.length > 0) {
    summaryParts.push(`${extraModules.length} extra modules`)
  }
  const summary =
    summaryParts.length > 0
      ? summaryParts.join(", ")
      : "Fit matches doctrine requirements"

  return {
    validation,
    matchScore,
    differences: {
      missingModules,
      extraModules,
      summary,
    },
  }
}
