import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session.isLoggedIn) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-eve-void">
      <DashboardHeader
        characterId={session.characterId}
        characterName={session.characterName}
      />

      <main className="mx-auto max-w-[1600px] px-6 py-8">{children}</main>
    </div>
  )
}
