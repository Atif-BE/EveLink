"use server"

import { revalidatePath } from "next/cache"
import { getSession } from "@/lib/session"
import {
  createSrpRequest,
  getSrpRequestByKillmail,
  getFleetById,
  getDoctrineShipById,
} from "@/data-access"
import { getKillmailDetails, getTypeName, getTypeIdsByNames } from "@/lib/esi"
import { compareFittings } from "@/lib/fit-comparison"
import type { ParsedFitting } from "@/types/fitting"
import type { KillmailItem } from "@/types/esi"

export type ActionResult = {
  success: boolean
  error?: string
  requestId?: string
}

const FLEET_TIME_WINDOW = {
  BEFORE_MINUTES: 30,
  AFTER_HOURS: 6,
}

export const submitSrpRequestAction = async (
  fleetId: string,
  killmailId: number,
  killmailHash: string,
  doctrineShipId: string,
  iskValue: number
): Promise<ActionResult> => {
  const session = await getSession()
  if (!session.isLoggedIn || !session.allianceId) {
    return { success: false, error: "Unauthorized" }
  }

  const fleet = await getFleetById(fleetId)
  if (!fleet) {
    return { success: false, error: "Fleet not found" }
  }

  if (!fleet.srpEligible) {
    return { success: false, error: "This fleet is not SRP eligible" }
  }

  const existingRequest = await getSrpRequestByKillmail(killmailId, fleetId)
  if (existingRequest) {
    return { success: false, error: "SRP request already submitted for this loss" }
  }

  const doctrineShip = await getDoctrineShipById(doctrineShipId)
  if (!doctrineShip) {
    return { success: false, error: "Doctrine ship not found" }
  }

  let killmail
  try {
    killmail = await getKillmailDetails(killmailId, killmailHash)
  } catch {
    return { success: false, error: "Failed to fetch killmail details" }
  }

  if (killmail.victim.ship_type_id !== doctrineShip.shipTypeId) {
    return { success: false, error: "Ship type does not match doctrine" }
  }

  const killmailTime = new Date(killmail.killmail_time)
  const fleetStart = new Date(fleet.scheduledAt)
  const windowStart = new Date(
    fleetStart.getTime() - FLEET_TIME_WINDOW.BEFORE_MINUTES * 60 * 1000
  )
  const windowEnd = new Date(
    fleetStart.getTime() + FLEET_TIME_WINDOW.AFTER_HOURS * 60 * 60 * 1000
  )

  if (killmailTime < windowStart || killmailTime > windowEnd) {
    return { success: false, error: "Loss occurred outside the fleet time window" }
  }

  const doctrineFitting = doctrineShip.fitting as ParsedFitting
  const killmailItems = (killmail.victim.items ?? []) as KillmailItem[]

  const allModuleNames: string[] = []
  const moduleArrays = [
    doctrineFitting.highSlots,
    doctrineFitting.midSlots,
    doctrineFitting.lowSlots,
    doctrineFitting.rigs,
    doctrineFitting.drones,
  ]
  for (const modules of moduleArrays) {
    for (const mod of modules) {
      allModuleNames.push(mod.name)
    }
  }

  const killmailTypeIds = killmailItems.map((item) => item.item_type_id)
  const uniqueTypeIds = [...new Set(killmailTypeIds)]

  const [nameToIdMap, ...typeNameResults] = await Promise.all([
    getTypeIdsByNames(allModuleNames),
    ...uniqueTypeIds.map((id) => getTypeName(id).then((name) => ({ id, name }))),
  ])

  const typeIdToName = new Map<number, string>()
  for (const result of typeNameResults) {
    typeIdToName.set(result.id, result.name)
  }
  for (const [name, id] of nameToIdMap) {
    typeIdToName.set(id, name)
  }

  const fitResult = compareFittings(killmailItems, doctrineFitting, typeIdToName)

  const shipName = await getTypeName(doctrineShip.shipTypeId)

  const request = await createSrpRequest({
    fleetId,
    characterId: session.characterId,
    characterName: session.characterName,
    killmailId,
    killmailHash,
    shipTypeId: doctrineShip.shipTypeId,
    shipName,
    iskValue,
    fitValidation: fitResult.validation,
    fitMatchScore: fitResult.matchScore,
    fitDifferences: fitResult.differences,
    status: "pending",
  })

  revalidatePath("/dashboard/srp")
  return { success: true, requestId: request.id }
}
