import type {
  CharacterInfo,
  CorporationInfo,
  AllianceInfo,
  CharacterAffiliation,
  RaceInfo,
  BloodlineInfo,
  AncestryInfo,
  KillmailRef,
  Killmail,
  UniverseType,
} from "@/types/esi"
import type { KillmailDisplay } from "@/types/eve"
import type { ZKillboardEntry } from "@/types/zkillboard"
import { getCharactersByUserId } from "@/db/queries"
import { getValidAccessToken } from "@/lib/tokens"
import { getCharacterKills, getCharacterLosses } from "@/lib/zkillboard"

export type {
  CharacterInfo,
  CorporationInfo,
  AllianceInfo,
  CharacterAffiliation,
  RaceInfo,
  BloodlineInfo,
  AncestryInfo,
  KillmailRef,
  Killmail,
  UniverseType,
} from "@/types/esi"

export type { KillmailDisplay } from "@/types/eve"

export type CharacterWealth = {
  characterId: number
  characterName: string
  balance: number | null
}

export type AggregateWealth = {
  total: number
  characters: CharacterWealth[]
  incomplete: boolean
}

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

async function fetchESIAuth<T>(
  endpoint: string,
  accessToken: string
): Promise<T> {
  const response = await fetch(`${ESI_BASE}${endpoint}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
      "X-User-Agent": USER_AGENT,
    },
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`ESI request failed: ${error}`)
  }

  return response.json()
}

export async function getCharacterWallet(
  characterId: number,
  accessToken: string
): Promise<number> {
  return fetchESIAuth<number>(
    `/characters/${characterId}/wallet/`,
    accessToken
  )
}

export async function getAggregateWealth(
  userId: string
): Promise<AggregateWealth> {
  const characters = await getCharactersByUserId(userId)

  if (characters.length === 0) {
    return { total: 0, characters: [], incomplete: false }
  }

  const results = await Promise.all(
    characters.map(async (char) => {
      const token = await getValidAccessToken(char.id)

      if (!token) {
        return {
          characterId: char.id,
          characterName: char.name,
          balance: null,
        }
      }

      try {
        const balance = await getCharacterWallet(char.id, token)
        return {
          characterId: char.id,
          characterName: char.name,
          balance,
        }
      } catch {
        return {
          characterId: char.id,
          characterName: char.name,
          balance: null,
        }
      }
    })
  )

  const validBalances = results.filter((r) => r.balance !== null)
  const total = validBalances.reduce((sum, r) => sum + (r.balance ?? 0), 0)
  const incomplete = results.some((r) => r.balance === null)

  return { total, characters: results, incomplete }
}

const typeNameCache = new Map<number, string>()

export async function getTypeName(typeId: number): Promise<string> {
  if (typeNameCache.has(typeId)) {
    return typeNameCache.get(typeId)!
  }

  try {
    const typeInfo = await fetchESI<UniverseType>(`/universe/types/${typeId}/`)
    typeNameCache.set(typeId, typeInfo.name)
    return typeInfo.name
  } catch {
    return "Unknown Ship"
  }
}

export async function getCharacterKillmails(
  characterId: number,
  accessToken: string
): Promise<KillmailRef[]> {
  return fetchESIAuth<KillmailRef[]>(
    `/characters/${characterId}/killmails/recent/`,
    accessToken
  )
}

export async function getKillmailDetails(
  killmailId: number,
  hash: string
): Promise<Killmail> {
  return fetchESI<Killmail>(`/killmails/${killmailId}/${hash}/`)
}

export type AggregateKillmails = {
  kills: KillmailDisplay[]
  losses: KillmailDisplay[]
  incomplete: boolean
}

const fetchKillmailDisplay = async (
  entry: ZKillboardEntry,
  isLoss: boolean
): Promise<KillmailDisplay | null> => {
  try {
    const details = await getKillmailDetails(entry.killmail_id, entry.zkb.hash)

    let victimName: string | undefined
    let corpName: string | undefined
    let shipName: string | undefined

    if (details.victim.character_id) {
      try {
        const charInfo = await getCharacterInfo(details.victim.character_id)
        victimName = charInfo.name
      } catch {
        victimName = undefined
      }
    }

    if (details.victim.corporation_id) {
      try {
        const corpInfo = await getCorporationInfo(details.victim.corporation_id)
        corpName = corpInfo.name
      } catch {
        corpName = undefined
      }
    }

    if (details.victim.ship_type_id) {
      shipName = await getTypeName(details.victim.ship_type_id)
    }

    return {
      id: details.killmail_id,
      hash: entry.zkb.hash,
      timestamp: new Date(details.killmail_time),
      isLoss,
      victim: {
        characterId: details.victim.character_id,
        characterName: victimName,
        corporationId: details.victim.corporation_id,
        corporationName: corpName,
        allianceId: details.victim.alliance_id,
        shipTypeId: details.victim.ship_type_id,
        shipName,
      },
      zkillboardUrl: `https://zkillboard.com/kill/${details.killmail_id}/`,
      totalValue: entry.zkb.totalValue,
    }
  } catch {
    return null
  }
}

export const getAggregateKillmails = async (
  userId: string,
  limit: number = 5
): Promise<AggregateKillmails> => {
  const characters = await getCharactersByUserId(userId)

  if (characters.length === 0) {
    return { kills: [], losses: [], incomplete: false }
  }

  const allKillEntries: ZKillboardEntry[] = []
  const allLossEntries: ZKillboardEntry[] = []
  let incomplete = false

  await Promise.all(
    characters.map(async (char) => {
      try {
        const [kills, losses] = await Promise.all([
          getCharacterKills(char.id),
          getCharacterLosses(char.id),
        ])
        allKillEntries.push(...kills)
        allLossEntries.push(...losses)
      } catch {
        incomplete = true
      }
    })
  )

  const uniqueKills = new Map<number, ZKillboardEntry>()
  for (const entry of allKillEntries) {
    if (!uniqueKills.has(entry.killmail_id)) {
      uniqueKills.set(entry.killmail_id, entry)
    }
  }

  const uniqueLosses = new Map<number, ZKillboardEntry>()
  for (const entry of allLossEntries) {
    if (!uniqueLosses.has(entry.killmail_id)) {
      uniqueLosses.set(entry.killmail_id, entry)
    }
  }

  const topKillEntries = Array.from(uniqueKills.values())
    .sort((a, b) => b.killmail_id - a.killmail_id)
    .slice(0, limit)

  const topLossEntries = Array.from(uniqueLosses.values())
    .sort((a, b) => b.killmail_id - a.killmail_id)
    .slice(0, limit)

  const [killResults, lossResults] = await Promise.all([
    Promise.all(topKillEntries.map((entry) => fetchKillmailDisplay(entry, false))),
    Promise.all(topLossEntries.map((entry) => fetchKillmailDisplay(entry, true))),
  ])

  const kills = killResults.filter((km): km is KillmailDisplay => km !== null)
  const losses = lossResults.filter((km): km is KillmailDisplay => km !== null)

  return { kills, losses, incomplete }
}
