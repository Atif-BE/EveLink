import { eq, and, desc } from "drizzle-orm"
import { db } from "@/db"
import { doctrines } from "@/db/schema"
import type { NewDoctrine } from "@/types/db"

export const getDoctrinesByAllianceId = async (allianceId: number) => {
  return db.query.doctrines.findMany({
    where: and(eq(doctrines.allianceId, allianceId), eq(doctrines.isActive, true)),
    with: { ships: true },
    orderBy: [desc(doctrines.createdAt)],
  })
}

export const getDoctrineById = async (id: string) => {
  return db.query.doctrines.findFirst({
    where: eq(doctrines.id, id),
    with: { ships: true },
  })
}

export const createDoctrine = async (data: NewDoctrine) => {
  const [doctrine] = await db.insert(doctrines).values(data).returning()
  return doctrine
}

export const updateDoctrine = async (
  id: string,
  data: Partial<Pick<NewDoctrine, "name" | "description" | "isActive">>
) => {
  const [doctrine] = await db
    .update(doctrines)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(doctrines.id, id))
    .returning()
  return doctrine
}

export const softDeleteDoctrine = async (id: string) => {
  return updateDoctrine(id, { isActive: false })
}
