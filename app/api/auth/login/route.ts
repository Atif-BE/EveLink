import { cookies, headers } from "next/headers"
import { NextResponse } from "next/server"
import { generateState, getAuthorizationUrl } from "@/lib/eve-sso"
import { rateLimit, getRateLimitHeaders } from "@/lib/rate-limit"

const RATE_LIMIT = 10
const WINDOW_MS = 60_000

export async function GET() {
  const headersList = await headers()
  const ip = headersList.get("x-forwarded-for")?.split(",")[0] ?? "unknown"
  const result = rateLimit(`login:${ip}`, RATE_LIMIT, WINDOW_MS)

  if (result.limited) {
    return NextResponse.json(
      { error: "Too many login attempts. Please try again later." },
      {
        status: 429,
        headers: getRateLimitHeaders(result, RATE_LIMIT),
      }
    )
  }

  const state = generateState()
  const cookieStore = await cookies()

  cookieStore.set("eve_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 10,
    path: "/",
  })

  const authUrl = getAuthorizationUrl(state)
  return NextResponse.redirect(authUrl)
}
