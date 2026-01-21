import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { generateState, getAuthorizationUrl } from "@/lib/eve-sso"

export async function GET() {
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
