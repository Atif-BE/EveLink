import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { getSession } from "@/lib/session"
import { exchangeCode, verifyToken } from "@/lib/eve-sso"
import { getCharacterAffiliation, getCharacterInfo } from "@/lib/esi"
import {
  getCharacterById,
  createUser,
  createCharacter,
  updateCharacterTokens,
  updateCharacterInfo,
} from "@/db/queries"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")
  const state = searchParams.get("state")
  const baseUrl = request.nextUrl.origin

  if (!code || !state) {
    return NextResponse.redirect(`${baseUrl}/login?error=sso_failed`)
  }

  const cookieStore = await cookies()
  const storedState = cookieStore.get("eve_oauth_state")?.value

  if (!storedState || storedState !== state) {
    return NextResponse.redirect(`${baseUrl}/login?error=invalid_state`)
  }

  const linkingUserId = cookieStore.get("eve_linking_user_id")?.value

  cookieStore.delete("eve_oauth_state")
  cookieStore.delete("eve_linking_user_id")

  try {
    const tokens = await exchangeCode(code)
    const { characterId, characterName } = await verifyToken(tokens.access_token)
    const [affiliation, charInfo] = await Promise.all([
      getCharacterAffiliation(characterId),
      getCharacterInfo(characterId),
    ])

    const requiredAllianceId = parseInt(process.env.ALLIANCE_ID || "0", 10)

    if (requiredAllianceId && affiliation.alliance_id !== requiredAllianceId) {
      return NextResponse.redirect(`${baseUrl}/login?error=not_member`)
    }

    const session = await getSession()
    const tokenExpiresAt = new Date(Date.now() + tokens.expires_in * 1000)

    const existingCharacter = await getCharacterById(characterId)

    let userId: string

    if (existingCharacter) {
      userId = existingCharacter.userId
      await updateCharacterTokens(characterId, {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        tokenExpiresAt,
      })
      await updateCharacterInfo(characterId, {
        corporationId: affiliation.corporation_id,
        allianceId: affiliation.alliance_id ?? null,
        securityStatus: charInfo.security_status,
      })
    } else {
      if (linkingUserId) {
        userId = linkingUserId
      } else if (session.isLoggedIn && session.userId) {
        userId = session.userId
      } else {
        const newUser = await createUser({ primaryCharacterId: characterId })
        userId = newUser.id
      }

      try {
        const newChar = await createCharacter({
          id: characterId,
          userId,
          name: characterName,
          corporationId: affiliation.corporation_id,
          allianceId: affiliation.alliance_id ?? null,
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          tokenExpiresAt,
          securityStatus: charInfo.security_status ?? null,
          birthday: charInfo.birthday ? new Date(charInfo.birthday) : null,
          raceId: charInfo.race_id,
          bloodlineId: charInfo.bloodline_id,
          gender: charInfo.gender,
        })
        console.log("[Callback] Character created successfully:", {
          characterId,
          userId,
          result: newChar,
        })
      } catch (err) {
        console.error("[Callback] Failed to create character:", err)
        throw err
      }
    }

    session.isLoggedIn = true
    session.userId = userId
    session.characterId = characterId
    session.characterName = characterName
    session.corporationId = affiliation.corporation_id
    session.allianceId = affiliation.alliance_id || null
    session.accessToken = tokens.access_token
    session.refreshToken = tokens.refresh_token
    session.expiresAt = Date.now() + tokens.expires_in * 1000

    await session.save()

    revalidatePath("/dashboard")

    return NextResponse.redirect(`${baseUrl}/dashboard`)
  } catch (error) {
    console.error("SSO callback error:", error)
    return NextResponse.redirect(`${baseUrl}/login?error=sso_failed`)
  }
}
