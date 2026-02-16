import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { getCharacterById, getAllianceRegistration } from "@/data-access"
import { getCharacterAffiliation } from "@/lib/esi"

export async function POST(request: NextRequest) {
  const session = await getSession()

  if (!session.isLoggedIn || !session.userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const body = await request.json()
  const { characterId } = body

  if (!characterId || typeof characterId !== "number") {
    return NextResponse.json({ error: "Invalid character ID" }, { status: 400 })
  }

  const character = await getCharacterById(characterId)

  if (!character || character.userId !== session.userId) {
    return NextResponse.json({ error: "Character not found" }, { status: 404 })
  }

  const affiliation = await getCharacterAffiliation(characterId)

  const newAllianceId = affiliation.alliance_id ?? null

  if (!process.env.ALLIANCE_ID && newAllianceId) {
    const registration = await getAllianceRegistration(newAllianceId)
    if (!registration) {
      return NextResponse.json(
        { error: "That character's alliance is not registered on EveLink" },
        { status: 403 }
      )
    }
    session.isAllianceAdmin = character.id === registration.registeredById
  } else if (!process.env.ALLIANCE_ID) {
    return NextResponse.json(
      { error: "That character is not in an alliance" },
      { status: 403 }
    )
  }

  session.characterId = character.id
  session.characterName = character.name
  session.corporationId = affiliation.corporation_id
  session.allianceId = newAllianceId
  session.accessToken = character.accessToken
  session.refreshToken = character.refreshToken
  session.expiresAt = character.tokenExpiresAt.getTime()

  await session.save()

  return NextResponse.json({ success: true })
}
