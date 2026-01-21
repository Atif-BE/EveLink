import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Starfield } from "@/components/backgrounds/starfield"
import { NebulaOverlay } from "@/components/backgrounds/nebula-overlay"
import { Scanlines } from "@/components/backgrounds/scanlines"

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
      <Starfield />
      <NebulaOverlay />
      <Scanlines />

      <div className="relative z-20">
        <DashboardHeader
          characterId={session.characterId}
          characterName={session.characterName}
        />

        <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
      </div>
    </div>
  )
}
