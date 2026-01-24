import { eq, and, desc, inArray } from "drizzle-orm"
import { db } from "@/db"
import { srpRequests, fleets } from "@/db/schema"
import type { NewSrpRequest } from "@/types/db"

export const getSrpRequestsByCharacterId = async (characterId: number) => {
  return db.query.srpRequests.findMany({
    where: eq(srpRequests.characterId, characterId),
    with: {
      fleet: true,
    },
    orderBy: [desc(srpRequests.submittedAt)],
  })
}

export const getSrpRequestsByCharacterIds = async (characterIds: number[]) => {
  if (characterIds.length === 0) return []
  return db.query.srpRequests.findMany({
    where: inArray(srpRequests.characterId, characterIds),
    with: {
      fleet: true,
    },
    orderBy: [desc(srpRequests.submittedAt)],
  })
}

export const getSrpRequestByKillmail = async (
  killmailId: number,
  fleetId: string
) => {
  return db.query.srpRequests.findFirst({
    where: and(
      eq(srpRequests.killmailId, killmailId),
      eq(srpRequests.fleetId, fleetId)
    ),
  })
}

export const getSrpRequestById = async (id: string) => {
  return db.query.srpRequests.findFirst({
    where: eq(srpRequests.id, id),
    with: {
      fleet: true,
    },
  })
}

export const createSrpRequest = async (data: NewSrpRequest) => {
  const [request] = await db.insert(srpRequests).values(data).returning()
  return request
}

export const getSrpEligibleFleets = async (allianceId: number) => {
  return db.query.fleets.findMany({
    where: and(
      eq(fleets.allianceId, allianceId),
      eq(fleets.srpEligible, true),
      eq(fleets.isActive, true),
      inArray(fleets.status, ["scheduled", "active", "completed"])
    ),
    with: {
      doctrine: {
        with: {
          ships: true,
        },
      },
      rsvps: true,
    },
    orderBy: [desc(fleets.scheduledAt)],
  })
}

export const getSrpRequestsByFleetId = async (fleetId: string) => {
  return db.query.srpRequests.findMany({
    where: eq(srpRequests.fleetId, fleetId),
    orderBy: [desc(srpRequests.submittedAt)],
  })
}

export const updateSrpRequestStatus = async (
  id: string,
  status: string,
  reviewData?: {
    iskPayout?: number
    reviewedById?: number
    reviewedByName?: string
    reviewNote?: string
  }
) => {
  const [request] = await db
    .update(srpRequests)
    .set({
      status,
      updatedAt: new Date(),
      reviewedAt: new Date(),
      ...reviewData,
    })
    .where(eq(srpRequests.id, id))
    .returning()
  return request
}
