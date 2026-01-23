import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { getDoctrineById, softDeleteDoctrine } from "@/db/queries"

type RouteParams = {
  params: Promise<{ id: string }>
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const session = await getSession()
  const { id } = await params

  if (!session.isLoggedIn || !session.allianceId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const doctrine = await getDoctrineById(id)

  if (!doctrine) {
    return NextResponse.json({ error: "Doctrine not found" }, { status: 404 })
  }

  if (doctrine.allianceId !== session.allianceId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  await softDeleteDoctrine(id)

  return NextResponse.json({ success: true })
}
