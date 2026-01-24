import { eq } from "drizzle-orm"
import { db } from "@/db"
import { users } from "@/db/schema"
import type { NewUser } from "@/types/db"

export const createUser = async (data: Partial<NewUser> = {}) => {
  const [user] = await db.insert(users).values(data).returning()
  return user
}

export const getUserById = async (id: string) => {
  return db.query.users.findFirst({
    where: eq(users.id, id),
    with: { characters: true },
  })
}

export const updateUserPrimaryCharacter = async (
  userId: string,
  characterId: number
) => {
  await db
    .update(users)
    .set({ primaryCharacterId: characterId, updatedAt: new Date() })
    .where(eq(users.id, userId))
}
