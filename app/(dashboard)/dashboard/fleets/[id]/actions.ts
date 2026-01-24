"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import {
  getFleetById,
  updateFleet,
  updateFleetStatus,
  softDeleteFleet,
  upsertRsvp,
  deleteRsvp,
  getRsvpByFleetAndCharacter,
} from "@/data-access"
import type { FleetStatus, RsvpStatus } from "@/types/fleet"

export type ActionResult = {
  success: boolean
  error?: string
}

export const updateFleetAction = async (
  fleetId: string,
  formData: FormData
): Promise<ActionResult> => {
  const session = await getSession()
  if (!session.isLoggedIn || !session.allianceId) {
    return { success: false, error: "Unauthorized" }
  }

  const fleet = await getFleetById(fleetId)
  if (!fleet || fleet.allianceId !== session.allianceId) {
    return { success: false, error: "Fleet not found" }
  }

  const name = formData.get("name") as string
  const description = formData.get("description") as string | null
  const doctrineId = formData.get("doctrineId") as string | null
  const fcCharacterId = formData.get("fcCharacterId") as string
  const fcCharacterName = formData.get("fcCharacterName") as string
  const scheduledAt = formData.get("scheduledAt") as string

  if (!name?.trim()) {
    return { success: false, error: "Name is required" }
  }

  await updateFleet(fleetId, {
    name: name.trim(),
    description: description?.trim() || null,
    doctrineId: doctrineId || null,
    fcCharacterId: parseInt(fcCharacterId),
    fcCharacterName,
    scheduledAt: new Date(scheduledAt),
  })

  revalidatePath(`/dashboard/fleets/${fleetId}`)
  return { success: true }
}

export const updateFleetStatusAction = async (
  fleetId: string,
  status: FleetStatus
): Promise<ActionResult> => {
  const session = await getSession()
  if (!session.isLoggedIn || !session.allianceId) {
    return { success: false, error: "Unauthorized" }
  }

  const fleet = await getFleetById(fleetId)
  if (!fleet || fleet.allianceId !== session.allianceId) {
    return { success: false, error: "Fleet not found" }
  }

  await updateFleetStatus(fleetId, status)
  revalidatePath(`/dashboard/fleets/${fleetId}`)
  revalidatePath("/dashboard/fleets")
  return { success: true }
}

export const deleteFleetAction = async (
  fleetId: string
): Promise<ActionResult> => {
  const session = await getSession()
  if (!session.isLoggedIn || !session.allianceId) {
    return { success: false, error: "Unauthorized" }
  }

  const fleet = await getFleetById(fleetId)
  if (!fleet || fleet.allianceId !== session.allianceId) {
    return { success: false, error: "Fleet not found" }
  }

  await softDeleteFleet(fleetId)
  redirect("/dashboard/fleets")
}

export const rsvpToFleetAction = async (
  fleetId: string,
  status: RsvpStatus,
  shipTypeId: number | null,
  shipName: string | null
): Promise<ActionResult> => {
  const session = await getSession()
  if (!session.isLoggedIn || !session.characterId || !session.characterName) {
    return { success: false, error: "Unauthorized" }
  }

  const fleet = await getFleetById(fleetId)
  if (!fleet || fleet.allianceId !== session.allianceId) {
    return { success: false, error: "Fleet not found" }
  }

  await upsertRsvp(fleetId, session.characterId, {
    characterName: session.characterName,
    status,
    shipTypeId,
    shipName,
  })

  revalidatePath(`/dashboard/fleets/${fleetId}`)
  return { success: true }
}

export const cancelRsvpAction = async (
  fleetId: string
): Promise<ActionResult> => {
  const session = await getSession()
  if (!session.isLoggedIn || !session.characterId) {
    return { success: false, error: "Unauthorized" }
  }

  const rsvp = await getRsvpByFleetAndCharacter(fleetId, session.characterId)
  if (!rsvp) {
    return { success: false, error: "RSVP not found" }
  }

  await deleteRsvp(rsvp.id)
  revalidatePath(`/dashboard/fleets/${fleetId}`)
  return { success: true }
}
