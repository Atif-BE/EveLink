import { eq, and } from "drizzle-orm"
import { db } from "@/db"
import { fleetRsvps } from "@/db/schema"
import type { NewFleetRsvp } from "@/types"

export const getRsvpsByFleetId = async (fleetId: string) => {
  return db.query.fleetRsvps.findMany({
    where: eq(fleetRsvps.fleetId, fleetId),
  })
}

export const getRsvpByFleetAndCharacter = async (
  fleetId: string,
  characterId: number
) => {
  return db.query.fleetRsvps.findFirst({
    where: and(
      eq(fleetRsvps.fleetId, fleetId),
      eq(fleetRsvps.characterId, characterId)
    ),
  })
}

export const createRsvp = async (data: NewFleetRsvp) => {
  const [rsvp] = await db.insert(fleetRsvps).values(data).returning()
  return rsvp
}

export const updateRsvp = async (
  id: string,
  data: Partial<Pick<NewFleetRsvp, "status" | "shipTypeId" | "shipName">>
) => {
  const [rsvp] = await db
    .update(fleetRsvps)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(fleetRsvps.id, id))
    .returning()
  return rsvp
}

export const deleteRsvp = async (id: string) => {
  await db.delete(fleetRsvps).where(eq(fleetRsvps.id, id))
}

export const upsertRsvp = async (
  fleetId: string,
  characterId: number,
  data: Omit<NewFleetRsvp, "fleetId" | "characterId">
) => {
  const existing = await getRsvpByFleetAndCharacter(fleetId, characterId)

  if (existing) {
    return updateRsvp(existing.id, data)
  }

  return createRsvp({
    fleetId,
    characterId,
    ...data,
  })
}
