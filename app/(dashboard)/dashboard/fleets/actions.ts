"use server"

import { revalidatePath } from "next/cache"
import { getSession } from "@/lib/session"
import { createFleet } from "@/data-access"

export type ActionResult = {
  success: boolean
  error?: string
}

export const createFleetAction = async (
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> => {
  const session = await getSession()
  if (!session.isLoggedIn || !session.allianceId) {
    return { success: false, error: "Unauthorized" }
  }

  const name = formData.get("name") as string
  const description = formData.get("description") as string | null
  const doctrineId = formData.get("doctrineId") as string | null
  const fcCharacterId = formData.get("fcCharacterId") as string
  const fcCharacterName = formData.get("fcCharacterName") as string
  const scheduledAt = formData.get("scheduledAt") as string
  const srpEligible = formData.get("srpEligible") === "on"

  if (!name?.trim()) {
    return { success: false, error: "Name is required" }
  }

  if (!fcCharacterId || !fcCharacterName) {
    return { success: false, error: "Fleet Commander is required" }
  }

  if (!scheduledAt) {
    return { success: false, error: "Scheduled time is required" }
  }

  await createFleet({
    name: name.trim(),
    description: description?.trim() || null,
    allianceId: session.allianceId,
    doctrineId: doctrineId || null,
    fcCharacterId: parseInt(fcCharacterId),
    fcCharacterName,
    createdById: session.characterId,
    scheduledAt: new Date(scheduledAt),
    srpEligible,
    status: "scheduled",
  })

  revalidatePath("/dashboard/fleets")
  return { success: true }
}
