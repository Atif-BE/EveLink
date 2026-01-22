// ESI API response types - match the EVE ESI specification

export type CharacterInfo = {
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

export type CorporationInfo = {
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

export type AllianceInfo = {
  creator_corporation_id: number
  creator_id: number
  date_founded: string
  executor_corporation_id?: number
  name: string
  ticker: string
}

export type CharacterAffiliation = {
  alliance_id?: number
  character_id: number
  corporation_id: number
}

// Static universe data types
export type RaceInfo = {
  race_id: number
  name: string
  description: string
  alliance_id: number
}

export type BloodlineInfo = {
  bloodline_id: number
  name: string
  description: string
  race_id: number
  corporation_id: number
  ship_type_id: number
  charisma: number
  intelligence: number
  memory: number
  perception: number
  willpower: number
}

export type AncestryInfo = {
  id: number
  name: string
  bloodline_id: number
  description: string
  short_description: string
  icon_id: number
}
