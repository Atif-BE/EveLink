// Display types for EVE Online entities
// These are simplified versions for UI rendering

export type CharacterDisplay = {
  id: number
  name: string
  portrait: string
}

export type CorporationDisplay = {
  id: number
  name: string
  ticker: string
  logo: string
}

export type AllianceDisplay = {
  id: number
  name: string
  ticker: string
  logo: string
}

export type UserProfile = {
  isLoggedIn: boolean
  character: CharacterDisplay
  corporation: CorporationDisplay
  alliance: AllianceDisplay | null
}

export type KillmailDisplay = {
  id: number
  hash: string
  timestamp: Date
  isLoss: boolean
  victim: {
    characterId?: number
    characterName?: string
    corporationId?: number
    corporationName?: string
    allianceId?: number
    shipTypeId?: number
    shipName?: string
  }
  zkillboardUrl: string
  totalValue?: number
}

export const eveImageUrl = {
  character: (id: number, size: 32 | 64 | 128 | 256 | 512 = 128) =>
    `https://images.evetech.net/characters/${id}/portrait?size=${size}`,
  corporation: (id: number, size: 32 | 64 | 128 | 256 = 64) =>
    `https://images.evetech.net/corporations/${id}/logo?size=${size}`,
  alliance: (id: number, size: 32 | 64 | 128 = 64) =>
    `https://images.evetech.net/alliances/${id}/logo?size=${size}`,
  ship: (typeId: number, size: 32 | 64 | 128 | 256 = 64) =>
    `https://images.evetech.net/types/${typeId}/render?size=${size}`,
}
