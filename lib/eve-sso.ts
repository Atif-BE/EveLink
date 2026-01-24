import * as jose from "jose"
import type { TokenResponse, JWTPayload } from "@/types/auth"

const EVE_SSO_BASE = "https://login.eveonline.com"
const EVE_JWKS_URL = "https://login.eveonline.com/oauth/jwks"
const USER_AGENT = `EveLink/0.1.0 (${process.env.EVE_CONTACT_EMAIL || "contact@example.com"})`

export function generateState(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("")
}

export function getAuthorizationUrl(state: string): string {
  const params = new URLSearchParams({
    response_type: "code",
    redirect_uri: process.env.EVE_CALLBACK_URL!,
    client_id: process.env.EVE_CLIENT_ID!,
    scope: "publicData esi-wallet.read_character_wallet.v1 esi-killmails.read_killmails.v1 esi-fittings.write_fittings.v1 esi-skills.read_skills.v1",
    state,
  })

  return `${EVE_SSO_BASE}/v2/oauth/authorize?${params.toString()}`
}

export async function exchangeCode(
  code: string
): Promise<TokenResponse> {
  const credentials = Buffer.from(
    `${process.env.EVE_CLIENT_ID}:${process.env.EVE_CLIENT_SECRET}`
  ).toString("base64")

  const response = await fetch(`${EVE_SSO_BASE}/v2/oauth/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${credentials}`,
      Host: "login.eveonline.com",
      "X-User-Agent": USER_AGENT,
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Token exchange failed: ${error}`)
  }

  return response.json()
}

export async function verifyToken(accessToken: string): Promise<{
  characterId: number
  characterName: string
}> {
  const JWKS = jose.createRemoteJWKSet(new URL(EVE_JWKS_URL))

  const { payload } = await jose.jwtVerify<JWTPayload>(accessToken, JWKS, {
    issuer: [EVE_SSO_BASE, "https://login.eveonline.com"],
    audience: "EVE Online",
  })

  const characterId = parseInt(payload.sub.replace("CHARACTER:EVE:", ""), 10)
  const characterName = payload.name

  return { characterId, characterName }
}

export async function refreshAccessToken(
  refreshToken: string
): Promise<TokenResponse> {
  const credentials = Buffer.from(
    `${process.env.EVE_CLIENT_ID}:${process.env.EVE_CLIENT_SECRET}`
  ).toString("base64")

  const response = await fetch(`${EVE_SSO_BASE}/v2/oauth/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${credentials}`,
      Host: "login.eveonline.com",
      "X-User-Agent": USER_AGENT,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Token refresh failed: ${error}`)
  }

  return response.json()
}
