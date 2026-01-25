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

export type KillmailRef = {
  killmail_id: number
  killmail_hash: string
}

export type KillmailItem = {
  item_type_id: number
  flag: number
  quantity_destroyed?: number
  quantity_dropped?: number
  singleton?: number
}

export type KillmailVictim = {
  character_id?: number
  corporation_id?: number
  alliance_id?: number
  ship_type_id?: number
  damage_taken: number
  items?: KillmailItem[]
}

export type KillmailAttacker = {
  character_id?: number
  corporation_id?: number
  final_blow: boolean
  damage_done: number
  ship_type_id?: number
}

export type Killmail = {
  killmail_id: number
  killmail_time: string
  victim: KillmailVictim
  attackers: KillmailAttacker[]
  solar_system_id: number
}

export type UniverseType = {
  type_id: number
  name: string
  description: string
  group_id: number
}

export type DogmaAttribute = {
  attribute_id: number
  value: number
}

export type UniverseTypeWithSkills = {
  type_id: number
  name: string
  description: string
  group_id: number
  dogma_attributes?: DogmaAttribute[]
}

export type SkillRequirement = {
  skillId: number
  skillName: string
  requiredLevel: number
}

export type CharacterSkill = {
  skill_id: number
  active_skill_level: number
  trained_skill_level: number
  skillpoints_in_skill: number
}

export type CharacterSkillsResponse = {
  skills: CharacterSkill[]
  total_sp: number
  unallocated_sp?: number
}

export type SkillQueueEntry = {
  skill_id: number
  finish_date?: string
  finished_level: number
  queue_position: number
  start_date?: string
  level_start_sp?: number
  level_end_sp?: number
  training_start_sp?: number
}
