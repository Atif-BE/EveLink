export type TokenResponse = {
  access_token: string
  refresh_token: string
  expires_in: number
  token_type: string
}

export type JWTPayload = {
  sub: string
  name: string
  owner: string
  exp: number
  iat: number
  iss: string
  aud: string[]
}
