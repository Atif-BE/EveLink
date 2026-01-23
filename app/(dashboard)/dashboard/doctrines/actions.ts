"use server"

import { revalidatePath } from "next/cache"
import { getSession } from "@/lib/session"
import { createDoctrine } from "@/db/queries"

export type ActionResult = {
  success: boolean
  error?: string
}

export const createDoctrineAction = async (
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> => {
  const session = await getSession()
  if (!session.isLoggedIn || !session.allianceId) {
    return { success: false, error: "Unauthorized" }
  }

  const name = formData.get("name") as string
  const description = formData.get("description") as string | null

  if (!name?.trim()) {
    return { success: false, error: "Name is required" }
  }

  await createDoctrine({
    name: name.trim(),
    description: description?.trim() || null,
    allianceId: session.allianceId,
    createdById: session.characterId,
  })

  revalidatePath("/dashboard/doctrines")
  return { success: true }
}
