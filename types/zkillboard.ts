export type ZKillboardMeta = {
  hash: string
  totalValue: number
  fittedValue: number
  points: number
  npc: boolean
  solo: boolean
  awox: boolean
  locationID?: number
}

export type ZKillboardEntry = {
  killmail_id: number
  zkb: ZKillboardMeta
}
