"use server"

import { getSession } from "@/lib/session"
import { getCharactersByUserId, updateUserPrimaryCharacter } from "@/data-access"
import { revalidatePath } from "next/cache"

export const setMainCharacter = async (characterId: number) => {
  const session = await getSession()

  if (!session.userId) {
    return { error: "Unauthorized" }
  }

  const characters = await getCharactersByUserId(session.userId)
  const characterBelongsToUser = characters.some((c) => c.id === characterId)

  if (!characterBelongsToUser) {
    return { error: "Character not found" }
  }

  await updateUserPrimaryCharacter(session.userId, characterId)
  revalidatePath("/dashboard/characters")

  return { success: true }
}
