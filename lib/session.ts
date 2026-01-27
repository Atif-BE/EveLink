import { getIronSession, SessionOptions } from "iron-session"
import { cookies } from "next/headers"
import type { SessionData } from "@/types"

export type { SessionData } from "@/types"

const defaultSession: SessionData = {
  isLoggedIn: false,
  userId: "",
  characterId: 0,
  characterName: "",
  corporationId: 0,
  allianceId: null,
  accessToken: "",
  refreshToken: "",
  expiresAt: 0,
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: "evelink-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  },
}

export async function getSession() {
  const cookieStore = await cookies()
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions)

  if (!session.isLoggedIn) {
    Object.assign(session, defaultSession)
  }

  return session
}
