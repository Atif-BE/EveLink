import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { getDoctrinesByAllianceId } from "@/db/queries"
import { DoctrinesListPanel } from "@/components/dashboard/doctrines-list-panel"

export default async function DoctrinesPage() {
  const session = await getSession()

  if (!session.allianceId) {
    redirect("/dashboard")
  }

  const doctrines = await getDoctrinesByAllianceId(session.allianceId)

  return <DoctrinesListPanel doctrines={doctrines} />
}
