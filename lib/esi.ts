const ESI_BASE = "https://esi.evetech.net/latest"

type CharacterInfo = {
  alliance_id?: number
  birthday: string
  bloodline_id: number
  corporation_id: number
  description?: string
  gender: string
  name: string
  race_id: number
  security_status?: number
}

type CorporationInfo = {
  alliance_id?: number
  ceo_id: number
  creator_id: number
  date_founded?: string
  description?: string
  home_station_id?: number
  member_count: number
  name: string
  shares?: number
  tax_rate: number
  ticker: string
  url?: string
}

type AllianceInfo = {
  creator_corporation_id: number
  creator_id: number
  date_founded: string
  executor_corporation_id?: number
  name: string
  ticker: string
}

type CharacterAffiliation = {
  alliance_id?: number
  character_id: number
  corporation_id: number
}

async function fetchESI<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${ESI_BASE}${endpoint}`, {
    headers: {
      Accept: "application/json",
    },
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`ESI request failed: ${error}`)
  }

  return response.json()
}

export async function getCharacterInfo(
  characterId: number
): Promise<CharacterInfo> {
  return fetchESI<CharacterInfo>(`/characters/${characterId}/`)
}

export async function getCorporationInfo(
  corporationId: number
): Promise<CorporationInfo> {
  return fetchESI<CorporationInfo>(`/corporations/${corporationId}/`)
}

export async function getAllianceInfo(
  allianceId: number
): Promise<AllianceInfo> {
  return fetchESI<AllianceInfo>(`/alliances/${allianceId}/`)
}

export async function getCharacterAffiliation(
  characterId: number
): Promise<CharacterAffiliation> {
  const response = await fetch(`${ESI_BASE}/characters/affiliation/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify([characterId]),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`ESI affiliation request failed: ${error}`)
  }

  const affiliations: CharacterAffiliation[] = await response.json()
  return affiliations[0]
}
