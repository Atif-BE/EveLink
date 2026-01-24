import { eq, and } from "drizzle-orm"
import { db } from "@/db"
import { characters } from "@/db/schema"
import type { NewCharacter } from "@/types/db"

export const getCharacterById = async (characterId: number) => {
  return db.query.characters.findFirst({
    where: eq(characters.id, characterId),
    with: { user: true },
  })
}

export const getCharactersByUserId = async (userId: string) => {
  return db.query.characters.findMany({
    where: eq(characters.userId, userId),
    orderBy: (characters, { desc }) => [desc(characters.linkedAt)],
  })
}

export const createCharacter = async (data: NewCharacter) => {
  const [character] = await db.insert(characters).values(data).returning()
  return character
}

export const updateCharacterTokens = async (
  characterId: number,
  tokens: {
    accessToken: string
    refreshToken: string
    tokenExpiresAt: Date
  }
) => {
  await db
    .update(characters)
    .set({
      ...tokens,
      lastLoginAt: new Date(),
    })
    .where(eq(characters.id, characterId))
}

export const updateCharacterInfo = async (
  characterId: number,
  info: {
    corporationId: number
    allianceId: number | null
    securityStatus?: number
    birthday?: Date
    raceId?: number
    bloodlineId?: number
    ancestryId?: number
    gender?: string
  }
) => {
  await db.update(characters).set(info).where(eq(characters.id, characterId))
}

export const deactivateCharacter = async (characterId: number) => {
  await db
    .update(characters)
    .set({ isActive: false })
    .where(eq(characters.id, characterId))
}

export const getCharactersByAllianceId = async (allianceId: number) => {
  return db.query.characters.findMany({
    where: and(
      eq(characters.allianceId, allianceId),
      eq(characters.isActive, true)
    ),
    orderBy: (characters, { asc }) => [asc(characters.name)],
  })
}
