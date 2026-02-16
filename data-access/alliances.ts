import { eq } from "drizzle-orm"
import { db } from "@/db"
import { alliances } from "@/db/schema"
import type { NewAlliance } from "@/types"

export const getAllianceRegistration = async (allianceId: number) => {
  return db.query.alliances.findFirst({
    where: eq(alliances.id, allianceId),
  }) ?? null
}

export const registerAlliance = async (data: NewAlliance) => {
  const [alliance] = await db.insert(alliances).values(data).returning()
  return alliance
}
