import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { getDoctrineById, removeShipFromDoctrine } from "@/db/queries"

type RouteParams = {
  params: Promise<{ id: string; shipId: string }>
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const session = await getSession()
  const { id: doctrineId, shipId } = await params

  if (!session.isLoggedIn || !session.allianceId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const doctrine = await getDoctrineById(doctrineId)

  if (!doctrine) {
    return NextResponse.json({ error: "Doctrine not found" }, { status: 404 })
  }

  if (doctrine.allianceId !== session.allianceId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const shipExists = doctrine.ships.some((s) => s.id === shipId)

  if (!shipExists) {
    return NextResponse.json({ error: "Ship not found" }, { status: 404 })
  }

  await removeShipFromDoctrine(shipId)

  return NextResponse.json({ success: true })
}
