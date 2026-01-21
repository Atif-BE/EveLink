import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { exchangeCode, verifyToken } from "@/lib/eve-sso"
import { getCharacterAffiliation } from "@/lib/esi"

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

  cookieStore.delete("eve_oauth_state")

  try {
    const tokens = await exchangeCode(code)
    const { characterId, characterName } = await verifyToken(tokens.access_token)
    const affiliation = await getCharacterAffiliation(characterId)

    const requiredAllianceId = parseInt(process.env.ALLIANCE_ID || "0", 10)

    if (requiredAllianceId && affiliation.alliance_id !== requiredAllianceId) {
      return NextResponse.redirect(`${baseUrl}/login?error=not_member`)
    }

    const session = await getSession()
    session.isLoggedIn = true
    session.characterId = characterId
    session.characterName = characterName
    session.corporationId = affiliation.corporation_id
    session.allianceId = affiliation.alliance_id || null
    session.accessToken = tokens.access_token
    session.refreshToken = tokens.refresh_token
    session.expiresAt = Date.now() + tokens.expires_in * 1000

    await session.save()

    return NextResponse.redirect(`${baseUrl}/dashboard`)
  } catch (error) {
    console.error("SSO callback error:", error)
    return NextResponse.redirect(`${baseUrl}/login?error=sso_failed`)
  }
}
