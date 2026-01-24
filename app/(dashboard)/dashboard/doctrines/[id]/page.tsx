import { notFound, redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { getDoctrineById } from "@/data-access"
import { DoctrineDetailPanel } from "@/components/dashboard/doctrine-detail-panel"

type DoctrineDetailPageProps = {
  params: Promise<{ id: string }>
}

export default async function DoctrineDetailPage({
  params,
}: DoctrineDetailPageProps) {
  const session = await getSession()
  const { id } = await params

  if (!session.allianceId) {
    redirect("/dashboard")
  }

  const doctrine = await getDoctrineById(id)

  if (!doctrine || doctrine.allianceId !== session.allianceId) {
    notFound()
  }

  return <DoctrineDetailPanel doctrine={doctrine} />
}
