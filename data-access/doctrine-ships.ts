import { eq, desc } from "drizzle-orm"
import { db } from "@/db"
import { doctrineShips } from "@/db/schema"
import type { NewDoctrineShip } from "@/types"

export const addShipToDoctrine = async (data: NewDoctrineShip) => {
  const [ship] = await db.insert(doctrineShips).values(data).returning()
  return ship
}

export const removeShipFromDoctrine = async (shipId: string) => {
  await db.delete(doctrineShips).where(eq(doctrineShips.id, shipId))
}

export const getShipsByDoctrineId = async (doctrineId: string) => {
  return db.query.doctrineShips.findMany({
    where: eq(doctrineShips.doctrineId, doctrineId),
    orderBy: [desc(doctrineShips.priority), desc(doctrineShips.createdAt)],
  })
}

export const getDoctrineShipById = async (shipId: string) => {
  return db.query.doctrineShips.findFirst({
    where: eq(doctrineShips.id, shipId),
    with: { doctrine: true },
  })
}

export const updateShipPriority = async (shipId: string, priority: number) => {
  await db
    .update(doctrineShips)
    .set({ priority })
    .where(eq(doctrineShips.id, shipId))
}
