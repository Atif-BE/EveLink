"use client"

import { useEffect, useState } from "react"
import { LogOut, User } from "lucide-react"

type UserData = {
  isLoggedIn: boolean
  characterId: number
  characterName: string
  corporationId: number
  allianceId: number | null
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.isLoggedIn) {
          setUser(data)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleLogout = () => {
    window.location.href = "/api/auth/logout"
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-eve-void">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-eve-cyan border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-eve-void p-8">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between rounded-lg border border-eve-border bg-eve-deep/50 p-6 backdrop-blur">
          <div className="flex items-center gap-4">
            {user && (
              <img
                src={`https://images.evetech.net/characters/${user.characterId}/portrait?size=64`}
                alt={user.characterName}
                className="h-16 w-16 rounded-full border-2 border-eve-cyan"
              />
            )}
            <div>
              <h1 className="font-display text-2xl font-semibold text-eve-text-primary">
                {user?.characterName}
              </h1>
              <p className="font-body text-sm text-eve-text-secondary">
                Welcome to EveLink
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg border border-eve-border bg-eve-void/50 px-4 py-2 font-body text-sm text-eve-text-secondary transition-colors hover:border-eve-red hover:text-eve-red"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>

        <div className="mt-8 rounded-lg border border-eve-border bg-eve-deep/50 p-6 backdrop-blur">
          <div className="flex items-center gap-2 text-eve-text-muted">
            <User className="h-5 w-5" />
            <span className="font-body text-sm">Dashboard content coming soon...</span>
          </div>
        </div>
      </div>
    </div>
  )
}
