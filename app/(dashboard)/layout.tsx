import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { getAllianceRegistration } from "@/data-access"
import { canRegisterAlliance } from "@/lib/admin"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session.isLoggedIn) {
    redirect("/login")
  }

  if (!process.env.ALLIANCE_ID) {
    if (!session.allianceId) {
      redirect("/login?error=no_alliance")
    }

    const registration = await getAllianceRegistration(session.allianceId)
    if (!registration) {
      const eligible = await canRegisterAlliance(
        session.characterId,
        session.allianceId
      )
      if (eligible) {
        redirect("/setup")
      } else {
        redirect("/login?error=alliance_not_registered")
      }
    }
  }

  return (
    <div className="min-h-screen bg-eve-void">
      <DashboardHeader
        characterId={session.characterId}
        characterName={session.characterName}
      />

      <DashboardSidebar />

      <main className="lg:pl-18">
        <div className="mx-auto max-w-400 px-6 py-8">{children}</div>
      </main>
    </div>
  )
}
