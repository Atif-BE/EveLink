"use server"

import { revalidatePath } from "next/cache"
import { getSession } from "@/lib/session"
import { getDoctrineById, addShipToDoctrine, getCharacterById } from "@/db/queries"
import { parseEft, convertToESIFitting } from "@/lib/eft"
import { getTypeIdByName, postESIAuth } from "@/lib/esi"
import { getValidAccessToken } from "@/lib/tokens"
import { SHIP_ROLES, type ShipRole, type ParsedFitting } from "@/types/fitting"

export type ActionResult = {
  success: boolean
  error?: string
}

export const addShipAction = async (
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> => {
  const session = await getSession()
  if (!session.isLoggedIn || !session.allianceId) {
    return { success: false, error: "Unauthorized" }
  }

  const doctrineId = formData.get("doctrineId") as string
  const eft = formData.get("eft") as string
  const role = formData.get("role") as ShipRole

  const doctrine = await getDoctrineById(doctrineId)
  if (!doctrine || doctrine.allianceId !== session.allianceId) {
    return { success: false, error: "Doctrine not found" }
  }

  if (!eft?.trim()) {
    return { success: false, error: "EFT fitting is required" }
  }
  if (!role || !SHIP_ROLES.includes(role)) {
    return { success: false, error: "Valid role is required" }
  }

  const parsed = parseEft(eft)
  if (!parsed) {
    return { success: false, error: "Invalid EFT format" }
  }

  const shipTypeId = await getTypeIdByName(parsed.shipName)
  if (!shipTypeId) {
    return { success: false, error: `Could not find ship type: ${parsed.shipName}` }
  }

  await addShipToDoctrine({
    doctrineId,
    shipTypeId,
    shipName: parsed.shipName,
    fitName: parsed.fitName,
    role,
    fitting: parsed,
    rawEft: eft.trim(),
    priority: 0,
  })

  revalidatePath(`/dashboard/doctrines/${doctrineId}`)
  return { success: true }
}

export const saveFittingToEve = async (
  fitting: ParsedFitting,
  shipTypeId: number
): Promise<ActionResult> => {
  const session = await getSession()
  if (!session.isLoggedIn || !session.characterId) {
    return { success: false, error: "Not logged in" }
  }

  const character = await getCharacterById(session.characterId)
  if (!character) {
    return { success: false, error: "Character not found" }
  }

  const accessToken = await getValidAccessToken(session.characterId)
  if (!accessToken) {
    return { success: false, error: "Token expired. Please re-authenticate to use this feature." }
  }

  try {
    const esiFitting = await convertToESIFitting(fitting, shipTypeId)

    await postESIAuth(
      `/characters/${session.characterId}/fittings/`,
      accessToken,
      esiFitting
    )

    return { success: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to save fitting"
    if (message.includes("403") || message.includes("Forbidden")) {
      return { success: false, error: "Missing fittings permission. Please re-authenticate." }
    }
    return { success: false, error: message }
  }
}
