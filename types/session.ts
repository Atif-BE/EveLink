export type SessionData = {
  isLoggedIn: boolean
  userId: string
  characterId: number
  characterName: string
  corporationId: number
  allianceId: number | null
  accessToken: string
  refreshToken: string
  expiresAt: number
}
