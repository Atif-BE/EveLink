import type { FittingModule, ParsedFitting, ESIFitting, ESIFittingItem } from "@/types/fitting"

const parseSection = (lines: string[]): FittingModule[] => {
  const moduleMap = new Map<string, number>()

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue

    const quantityMatch = trimmed.match(/^(.+?)\s+x(\d+)$/)
    if (quantityMatch) {
      const name = quantityMatch[1].trim()
      const qty = parseInt(quantityMatch[2], 10)
      moduleMap.set(name, (moduleMap.get(name) ?? 0) + qty)
    } else {
      moduleMap.set(trimmed, (moduleMap.get(trimmed) ?? 0) + 1)
    }
  }

  return Array.from(moduleMap.entries()).map(([name, quantity]) => ({
    name,
    quantity,
  }))
}

export const parseEft = (eft: string): ParsedFitting | null => {
  const lines = eft.trim().split("\n")
  if (lines.length === 0) return null

  const headerMatch = lines[0].match(/\[(.+),\s*(.+)\]/)
  if (!headerMatch) return null

  const shipName = headerMatch[1].trim()
  const fitName = headerMatch[2].trim()

  const content = lines.slice(1).join("\n")
  const sections = content
    .split(/\n\s*\n/)
    .map((s) => s.split("\n").filter((l) => l.trim()))

  const slotNames = [
    "lowSlots",
    "midSlots",
    "highSlots",
    "rigs",
    "drones",
    "cargo",
  ] as const

  const fitting: ParsedFitting = {
    shipName,
    fitName,
    lowSlots: [],
    midSlots: [],
    highSlots: [],
    rigs: [],
    drones: [],
    cargo: [],
  }

  sections.forEach((section, index) => {
    if (index < slotNames.length && section.length > 0) {
      fitting[slotNames[index]] = parseSection(section)
    }
  })

  return fitting
}

const ESI_FLAGS = {
  lowSlots: [11, 12, 13, 14, 15, 16, 17, 18],
  midSlots: [19, 20, 21, 22, 23, 24, 25, 26],
  highSlots: [27, 28, 29, 30, 31, 32, 33, 34],
  rigs: [92, 93, 94],
  drones: 87,
  cargo: 5,
} as const

const ESI_BASE = "https://esi.evetech.net/latest"
const USER_AGENT = `EveLink/0.1.0 (${process.env.EVE_CONTACT_EMAIL || "contact@example.com"})`

export const resolveTypeIds = async (
  names: string[]
): Promise<Map<string, number>> => {
  if (names.length === 0) return new Map()

  const response = await fetch(`${ESI_BASE}/universe/ids/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-User-Agent": USER_AGENT,
    },
    body: JSON.stringify(names),
  })

  if (!response.ok) {
    throw new Error("Failed to resolve type IDs")
  }

  const result = (await response.json()) as {
    inventory_types?: { id: number; name: string }[]
  }

  const typeMap = new Map<string, number>()
  for (const item of result.inventory_types ?? []) {
    typeMap.set(item.name, item.id)
  }

  return typeMap
}

export const convertToESIFitting = async (
  fitting: ParsedFitting,
  shipTypeId: number
): Promise<ESIFitting> => {
  const allModules: string[] = []
  const slotModules = [
    fitting.lowSlots,
    fitting.midSlots,
    fitting.highSlots,
    fitting.rigs,
    fitting.drones,
    fitting.cargo,
  ]

  for (const slots of slotModules) {
    for (const mod of slots) {
      if (!allModules.includes(mod.name)) {
        allModules.push(mod.name)
      }
    }
  }

  const typeIds = await resolveTypeIds(allModules)
  const items: ESIFittingItem[] = []

  const addSlotItems = (
    modules: FittingModule[],
    flags: readonly number[]
  ) => {
    let slotIndex = 0
    for (const mod of modules) {
      const typeId = typeIds.get(mod.name)
      if (!typeId) continue

      for (let i = 0; i < mod.quantity; i++) {
        if (slotIndex < flags.length) {
          items.push({
            type_id: typeId,
            flag: flags[slotIndex],
            quantity: 1,
          })
          slotIndex++
        }
      }
    }
  }

  const addBayItems = (modules: FittingModule[], flag: number) => {
    for (const mod of modules) {
      const typeId = typeIds.get(mod.name)
      if (!typeId) continue

      items.push({
        type_id: typeId,
        flag,
        quantity: mod.quantity,
      })
    }
  }

  addSlotItems(fitting.lowSlots, ESI_FLAGS.lowSlots)
  addSlotItems(fitting.midSlots, ESI_FLAGS.midSlots)
  addSlotItems(fitting.highSlots, ESI_FLAGS.highSlots)
  addSlotItems(fitting.rigs, ESI_FLAGS.rigs)
  addBayItems(fitting.drones, ESI_FLAGS.drones)
  addBayItems(fitting.cargo, ESI_FLAGS.cargo)

  return {
    name: fitting.fitName,
    ship_type_id: shipTypeId,
    description: "",
    items,
  }
}
