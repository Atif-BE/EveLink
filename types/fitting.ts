export type FittingModule = {
  name: string
  quantity: number
}

export type ParsedFitting = {
  shipName: string
  fitName: string
  lowSlots: FittingModule[]
  midSlots: FittingModule[]
  highSlots: FittingModule[]
  rigs: FittingModule[]
  drones: FittingModule[]
  cargo: FittingModule[]
}

export const SHIP_ROLES = [
  "DPS",
  "Logi",
  "Support",
  "Tackle",
  "EWAR",
  "Scout",
  "Command",
  "Capital",
  "Other",
] as const

export type ShipRole = (typeof SHIP_ROLES)[number]

export type ESIFittingItem = {
  type_id: number
  flag: number
  quantity: number
}

export type ESIFitting = {
  name: string
  ship_type_id: number
  description: string
  items: ESIFittingItem[]
}
