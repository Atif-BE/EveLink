import type {
  CharacterInfo,
  CorporationInfo,
  AllianceInfo,
  CharacterAffiliation,
  RaceInfo,
  BloodlineInfo,
  AncestryInfo,
} from "@/types/esi"

export type {
  CharacterInfo,
  CorporationInfo,
  AllianceInfo,
  CharacterAffiliation,
  RaceInfo,
  BloodlineInfo,
  AncestryInfo,
} from "@/types/esi"

const ESI_BASE = "https://esi.evetech.net/latest"
const USER_AGENT = `EveLink/0.1.0 (${process.env.EVE_CONTACT_EMAIL || "contact@example.com"})`

async function fetchESI<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${ESI_BASE}${endpoint}`, {
    headers: {
      Accept: "application/json",
      "X-User-Agent": USER_AGENT,
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
      "X-User-Agent": USER_AGENT,
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

// Cache for static universe data (rarely changes)
let racesCache: RaceInfo[] | null = null
let bloodlinesCache: BloodlineInfo[] | null = null
let ancestriesCache: AncestryInfo[] | null = null

export async function getRaces(): Promise<RaceInfo[]> {
  if (racesCache) return racesCache
  racesCache = await fetchESI<RaceInfo[]>("/universe/races/")
  return racesCache
}

export async function getBloodlines(): Promise<BloodlineInfo[]> {
  if (bloodlinesCache) return bloodlinesCache
  bloodlinesCache = await fetchESI<BloodlineInfo[]>("/universe/bloodlines/")
  return bloodlinesCache
}

export async function getAncestries(): Promise<AncestryInfo[]> {
  if (ancestriesCache) return ancestriesCache
  ancestriesCache = await fetchESI<AncestryInfo[]>("/universe/ancestries/")
  return ancestriesCache
}

export async function getRaceById(raceId: number): Promise<RaceInfo | undefined> {
  const races = await getRaces()
  return races.find((r) => r.race_id === raceId)
}

export async function getBloodlineById(
  bloodlineId: number
): Promise<BloodlineInfo | undefined> {
  const bloodlines = await getBloodlines()
  return bloodlines.find((b) => b.bloodline_id === bloodlineId)
}

export async function getAncestryById(
  ancestryId: number
): Promise<AncestryInfo | undefined> {
  const ancestries = await getAncestries()
  return ancestries.find((a) => a.id === ancestryId)
}
