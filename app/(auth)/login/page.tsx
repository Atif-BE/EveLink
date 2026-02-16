"use client"

import { Suspense, useState, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { Starfield } from "@/components/backgrounds/starfield"
import { NebulaOverlay } from "@/components/backgrounds/nebula-overlay"
import { Scanlines } from "@/components/backgrounds/scanlines"
import { BrandHeader } from "@/components/login/brand-header"
import { LoginCard } from "@/components/login/login-card"

const ERROR_MESSAGES: Record<string, string> = {
  not_member: "Your character is not in the required alliance",
  sso_failed: "Eve Online authentication failed. Please try again.",
  invalid_state: "Session expired. Please try again.",
  no_alliance:
    "Your character must be in an alliance to use EveLink.",
  alliance_not_registered:
    "Your alliance hasn't been set up on EveLink yet. Ask your executor corp CEO to register it.",
}

function LoginContent() {
  const searchParams = useSearchParams()
  const initialError = useMemo(() => {
    const errorCode = searchParams.get("error")
    return errorCode && ERROR_MESSAGES[errorCode] ? ERROR_MESSAGES[errorCode] : null
  }, [searchParams])
  const [error, setError] = useState<string | null>(initialError)

  const handleLogin = () => {
    window.location.href = "/api/auth/login"
  }

  const handleRetry = () => {
    setError(null)
    window.history.replaceState({}, "", "/login")
  }

  return (
    <div className="relative z-20 flex w-full max-w-md flex-col items-center">
      <BrandHeader />
      <LoginCard error={error} onLogin={handleLogin} onRetry={handleRetry} />

      <p className="mt-8 text-center font-body text-sm text-eve-text-muted">
        By signing in, you agree to our{" "}
        <a
          href="#"
          className="text-eve-cyan transition-colors hover:text-eve-cyan-dim hover:underline"
        >
          Terms of Service
        </a>{" "}
        and{" "}
        <a
          href="#"
          className="text-eve-cyan transition-colors hover:text-eve-cyan-dim hover:underline"
        >
          Privacy Policy
        </a>
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4">
      <div className="fixed inset-0 bg-eve-void" />
      <NebulaOverlay />
      <Starfield />
      <Scanlines />

      <Suspense fallback={null}>
        <LoginContent />
      </Suspense>
    </main>
  )
}
