import type { ZKillboardEntry } from "@/types/zkillboard"

const ZKILLBOARD_BASE = "https://zkillboard.com/api"
const USER_AGENT = `EveLink/0.1.0 (${process.env.EVE_CONTACT_EMAIL || "contact@example.com"})`

const fetchZKillboard = async <T>(endpoint: string): Promise<T> => {
  const url = `${ZKILLBOARD_BASE}${endpoint}`

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": USER_AGENT,
    },
  })

  if (!response.ok) {
    throw new Error(`zKillboard request failed: ${response.status}`)
  }

  return response.json()
}

export const getCharacterKills = async (
  characterId: number
): Promise<ZKillboardEntry[]> => {
  return fetchZKillboard<ZKillboardEntry[]>(
    `/kills/characterID/${characterId}/`
  )
}

export const getCharacterLosses = async (
  characterId: number
): Promise<ZKillboardEntry[]> => {
  return fetchZKillboard<ZKillboardEntry[]>(
    `/losses/characterID/${characterId}/`
  )
}
