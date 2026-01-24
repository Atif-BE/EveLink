import { notFound } from "next/navigation"
import { getDoctrineShipById, getCharactersByUserId } from "@/db/queries"
import { getSession } from "@/lib/session"
import { getValidAccessToken } from "@/lib/tokens"
import {
  getFittingSkillRequirements,
  checkCharacterCanFly,
  resolveFittingModuleTypeIds,
  type SkillRequirement,
  type CharacterFlyability,
} from "@/lib/esi"
import { ShipDetailView } from "@/components/dashboard/ship-detail-view"
import type { ParsedFitting } from "@/types/fitting"

type PageProps = {
  params: Promise<{ id: string; shipId: string }>
}

const ShipDetailPage = async ({ params }: PageProps) => {
  const { id: doctrineId, shipId } = await params
  const session = await getSession()

  if (!session.isLoggedIn || !session.allianceId || !session.userId) {
    notFound()
  }

  const ship = await getDoctrineShipById(shipId)

  if (!ship || ship.doctrineId !== doctrineId) {
    notFound()
  }

  if (ship.doctrine.allianceId !== session.allianceId) {
    notFound()
  }

  const baseFitting = ship.fitting as ParsedFitting
  const fitting = await resolveFittingModuleTypeIds(baseFitting)

  let skillRequirements: SkillRequirement[] = []
  try {
    skillRequirements = await getFittingSkillRequirements(baseFitting, ship.shipTypeId)
  } catch {
    skillRequirements = []
  }

  const characters = await getCharactersByUserId(session.userId)
  const characterFlyability: CharacterFlyability[] = []

  for (const character of characters) {
    if (!character.isActive) continue

    const token = await getValidAccessToken(character.id)
    if (!token) {
      characterFlyability.push({
        characterId: character.id,
        characterName: character.name,
        canFly: false,
        missingSkills: skillRequirements,
      })
      continue
    }

    try {
      const result = await checkCharacterCanFly(
        character.id,
        character.name,
        skillRequirements,
        token
      )
      characterFlyability.push(result)
    } catch {
      characterFlyability.push({
        characterId: character.id,
        characterName: character.name,
        canFly: false,
        missingSkills: skillRequirements,
      })
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <ShipDetailView
        ship={ship}
        fitting={fitting}
        skillRequirements={skillRequirements}
        characterFlyability={characterFlyability}
      />
    </div>
  )
}

export default ShipDetailPage
