import type { InferSelectModel, InferInsertModel } from "drizzle-orm"
import type {
  users,
  characters,
  doctrines,
  doctrineShips,
  fleets,
  fleetRsvps,
  srpRequests,
} from "@/db/schema"

export type User = InferSelectModel<typeof users>
export type NewUser = InferInsertModel<typeof users>

export type Character = InferSelectModel<typeof characters>
export type NewCharacter = InferInsertModel<typeof characters>

export type CharacterWithCorp = Character & {
  corporationName?: string
  corporationTicker?: string
  allianceName?: string
  allianceTicker?: string
}

export type LinkedCharacterDisplay = {
  id: number
  name: string
  portrait: string
  corporationId: number
  corporationName: string
  isActive: boolean
  linkedAt: Date
}

export type Doctrine = InferSelectModel<typeof doctrines>
export type NewDoctrine = InferInsertModel<typeof doctrines>

export type DoctrineShip = InferSelectModel<typeof doctrineShips>
export type NewDoctrineShip = InferInsertModel<typeof doctrineShips>

export type DoctrineWithShips = Doctrine & {
  ships: DoctrineShip[]
}

export type DoctrineShipWithDoctrine = DoctrineShip & {
  doctrine: Doctrine
}

export type Fleet = InferSelectModel<typeof fleets>
export type NewFleet = InferInsertModel<typeof fleets>

export type FleetRsvp = InferSelectModel<typeof fleetRsvps>
export type NewFleetRsvp = InferInsertModel<typeof fleetRsvps>

export type FleetWithRelations = Fleet & {
  doctrine: DoctrineWithShips | null
  rsvps: FleetRsvp[]
}

export type SrpRequest = InferSelectModel<typeof srpRequests>
export type NewSrpRequest = InferInsertModel<typeof srpRequests>

export type SrpRequestWithFleet = SrpRequest & {
  fleet: Fleet
}
