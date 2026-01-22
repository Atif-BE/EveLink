import { eq } from "drizzle-orm"
import { db } from "./index"
import { users, characters } from "./schema"
import type { NewUser, NewCharacter } from "@/types/db"

// User queries
export async function createUser(data: Partial<NewUser> = {}) {
  const [user] = await db.insert(users).values(data).returning()
  return user
}

export async function getUserById(id: string) {
  return db.query.users.findFirst({
    where: eq(users.id, id),
    with: { characters: true },
  })
}

export async function updateUserPrimaryCharacter(
  userId: string,
  characterId: number
) {
  await db
    .update(users)
    .set({ primaryCharacterId: characterId, updatedAt: new Date() })
    .where(eq(users.id, userId))
}

// Character queries
export async function getCharacterById(characterId: number) {
  return db.query.characters.findFirst({
    where: eq(characters.id, characterId),
    with: { user: true },
  })
}

export async function getCharactersByUserId(userId: string) {
  return db.query.characters.findMany({
    where: eq(characters.userId, userId),
    orderBy: (characters, { desc }) => [desc(characters.linkedAt)],
  })
}

export async function createCharacter(data: NewCharacter) {
  const [character] = await db.insert(characters).values(data).returning()
  return character
}

export async function updateCharacterTokens(
  characterId: number,
  tokens: {
    accessToken: string
    refreshToken: string
    tokenExpiresAt: Date
  }
) {
  await db
    .update(characters)
    .set({
      ...tokens,
      lastLoginAt: new Date(),
    })
    .where(eq(characters.id, characterId))
}

export async function updateCharacterInfo(
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
) {
  await db.update(characters).set(info).where(eq(characters.id, characterId))
}

export async function deactivateCharacter(characterId: number) {
  await db
    .update(characters)
    .set({ isActive: false })
    .where(eq(characters.id, characterId))
}
