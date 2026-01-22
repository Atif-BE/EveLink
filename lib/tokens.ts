import { getCharacterById, updateCharacterTokens } from "@/db/queries"
import { refreshAccessToken } from "@/lib/eve-sso"

export async function getValidAccessToken(
  characterId: number
): Promise<string | null> {
  const character = await getCharacterById(characterId)

  if (!character) {
    return null
  }

  const now = new Date()
  const expiresAt = new Date(character.tokenExpiresAt)
  const bufferMs = 60 * 1000

  if (expiresAt.getTime() - bufferMs > now.getTime()) {
    return character.accessToken
  }

  try {
    const tokens = await refreshAccessToken(character.refreshToken)
    const newExpiresAt = new Date(Date.now() + tokens.expires_in * 1000)

    await updateCharacterTokens(characterId, {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      tokenExpiresAt: newExpiresAt,
    })

    return tokens.access_token
  } catch {
    return null
  }
}
