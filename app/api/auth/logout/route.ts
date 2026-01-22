import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"

export async function GET() {
  const session = await getSession()
  session.destroy()

  const baseUrl = process.env.BASE_URL || "http://localhost:3000"
  return NextResponse.redirect(`${baseUrl}/login`)
}

export async function POST() {
  const session = await getSession()
  session.destroy()

  return NextResponse.json({ success: true })
}
