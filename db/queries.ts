import { eq, and, desc } from "drizzle-orm"
import { db } from "./index"
import { users, characters, doctrines, doctrineShips } from "./schema"
import type { NewUser, NewCharacter, NewDoctrine, NewDoctrineShip } from "@/types/db"

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

export async function getDoctrinesByAllianceId(allianceId: number) {
  return db.query.doctrines.findMany({
    where: and(eq(doctrines.allianceId, allianceId), eq(doctrines.isActive, true)),
    with: { ships: true },
    orderBy: [desc(doctrines.createdAt)],
  })
}

export async function getDoctrineById(id: string) {
  return db.query.doctrines.findFirst({
    where: eq(doctrines.id, id),
    with: { ships: true },
  })
}

export async function createDoctrine(data: NewDoctrine) {
  const [doctrine] = await db.insert(doctrines).values(data).returning()
  return doctrine
}

export async function updateDoctrine(
  id: string,
  data: Partial<Pick<NewDoctrine, "name" | "description" | "isActive">>
) {
  const [doctrine] = await db
    .update(doctrines)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(doctrines.id, id))
    .returning()
  return doctrine
}

export async function softDeleteDoctrine(id: string) {
  return updateDoctrine(id, { isActive: false })
}

export async function addShipToDoctrine(data: NewDoctrineShip) {
  const [ship] = await db.insert(doctrineShips).values(data).returning()
  return ship
}

export async function removeShipFromDoctrine(shipId: string) {
  await db.delete(doctrineShips).where(eq(doctrineShips.id, shipId))
}

export async function getShipsByDoctrineId(doctrineId: string) {
  return db.query.doctrineShips.findMany({
    where: eq(doctrineShips.doctrineId, doctrineId),
    orderBy: [desc(doctrineShips.priority), desc(doctrineShips.createdAt)],
  })
}
