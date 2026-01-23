import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { generateState, getAuthorizationUrl } from "@/lib/eve-sso"
import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"

export const GET = async () => {
  const session = await getSession()

  if (!session.isLoggedIn || !session.userId) {
    redirect("/login")
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

  cookieStore.set("eve_linking_user_id", session.userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 10,
    path: "/",
  })

  const authUrl = getAuthorizationUrl(state)
  return NextResponse.redirect(authUrl)
}
