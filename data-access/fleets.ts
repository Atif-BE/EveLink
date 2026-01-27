import { eq, and, desc, inArray } from "drizzle-orm"
import { db } from "@/db"
import { fleets } from "@/db/schema"
import type { NewFleet, FleetStatus } from "@/types"

export const getFleetsByAllianceId = async (allianceId: number) => {
  return db.query.fleets.findMany({
    where: and(eq(fleets.allianceId, allianceId), eq(fleets.isActive, true)),
    with: {
      doctrine: { with: { ships: true } },
      rsvps: true,
    },
    orderBy: [desc(fleets.scheduledAt)],
  })
}

export const getUpcomingFleetsByAllianceId = async (allianceId: number) => {
  return db.query.fleets.findMany({
    where: and(
      eq(fleets.allianceId, allianceId),
      eq(fleets.isActive, true),
      inArray(fleets.status, ["scheduled", "active"])
    ),
    with: {
      doctrine: { with: { ships: true } },
      rsvps: true,
    },
    orderBy: [desc(fleets.scheduledAt)],
  })
}

export const getFleetById = async (id: string) => {
  return db.query.fleets.findFirst({
    where: eq(fleets.id, id),
    with: {
      doctrine: { with: { ships: true } },
      rsvps: true,
    },
  })
}

export const createFleet = async (data: NewFleet) => {
  const [fleet] = await db.insert(fleets).values(data).returning()
  return fleet
}

export const updateFleet = async (
  id: string,
  data: Partial<
    Pick<
      NewFleet,
      | "name"
      | "description"
      | "doctrineId"
      | "fcCharacterId"
      | "fcCharacterName"
      | "scheduledAt"
    >
  >
) => {
  const [fleet] = await db
    .update(fleets)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(fleets.id, id))
    .returning()
  return fleet
}

export const updateFleetStatus = async (id: string, status: FleetStatus) => {
  const [fleet] = await db
    .update(fleets)
    .set({ status, updatedAt: new Date() })
    .where(eq(fleets.id, id))
    .returning()
  return fleet
}

export const softDeleteFleet = async (id: string) => {
  const [fleet] = await db
    .update(fleets)
    .set({ isActive: false, updatedAt: new Date() })
    .where(eq(fleets.id, id))
    .returning()
  return fleet
}
