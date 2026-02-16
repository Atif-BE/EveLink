"use client"

import { useTransition } from "react"
import { Starfield } from "@/components/backgrounds/starfield"
import { NebulaOverlay } from "@/components/backgrounds/nebula-overlay"
import { Scanlines } from "@/components/backgrounds/scanlines"
import { BrandHeader } from "@/components/login/brand-header"
import { registerAllianceAction } from "./actions"

type SetupFormProps = {
  allianceName: string
  allianceTicker: string
  executorCorpName: string
  characterName: string
}

export function SetupForm({
  allianceName,
  allianceTicker,
  executorCorpName,
  characterName,
}: SetupFormProps) {
  const [isPending, startTransition] = useTransition()

  const handleRegister = () => {
    startTransition(async () => {
      await registerAllianceAction()
    })
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4">
      <div className="fixed inset-0 bg-eve-void" />
      <NebulaOverlay />
      <Starfield />
      <Scanlines />

      <div className="relative z-20 flex w-full max-w-md flex-col items-center">
        <BrandHeader tagline="Alliance Registration" />

        <div className="w-full rounded-lg border border-eve-panel-border bg-eve-panel/80 p-6 backdrop-blur-sm">
          <h2 className="mb-4 font-display text-lg text-eve-text-primary">
            Register Your Alliance
          </h2>

          <div className="mb-6 space-y-3">
            <div className="flex justify-between">
              <span className="font-body text-sm text-eve-text-muted">
                Alliance
              </span>
              <span className="font-body text-sm text-eve-text-primary">
                {allianceName} [{allianceTicker}]
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-body text-sm text-eve-text-muted">
                Executor Corp
              </span>
              <span className="font-body text-sm text-eve-text-primary">
                {executorCorpName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-body text-sm text-eve-text-muted">
                Registered By
              </span>
              <span className="font-body text-sm text-eve-text-primary">
                {characterName}
              </span>
            </div>
          </div>

          <p className="mb-6 font-body text-sm text-eve-text-secondary">
            This will register your alliance on EveLink. All alliance members
            will be able to log in and use the dashboard.
          </p>

          <button
            onClick={handleRegister}
            disabled={isPending}
            className="w-full rounded border border-eve-cyan/30 bg-eve-cyan/10 px-4 py-3 font-display text-sm tracking-wide text-eve-cyan transition-all hover:border-eve-cyan/50 hover:bg-eve-cyan/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "Registering..." : "Register Alliance"}
          </button>
        </div>
      </div>
    </main>
  )
}
