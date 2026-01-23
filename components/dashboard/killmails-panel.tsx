import { Skull, Crosshair } from "lucide-react"
import { cn } from "@/lib/utils"
import { KillmailItem } from "./killmail-item"
import type { KillmailDisplay } from "@/types/eve"

type KillmailsPanelProps = {
  kills: KillmailDisplay[]
  losses: KillmailDisplay[]
  incomplete: boolean
  className?: string
}

export const KillmailsPanel = ({
  kills,
  losses,
  incomplete,
  className,
}: KillmailsPanelProps) => {
  return (
    <div className={cn("grid grid-cols-1 gap-6 md:grid-cols-2", className)}>
      <div className="rounded-xl border border-eve-border bg-eve-deep p-4">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-eve-red/10">
            <Skull className="h-4 w-4 text-eve-red" />
          </div>
          <h3 className="font-semibold text-eve-text">Recent Losses</h3>
        </div>

        {losses.length > 0 ? (
          <div className="space-y-2">
            {losses.map((loss) => (
              <KillmailItem key={loss.id} killmail={loss} />
            ))}
          </div>
        ) : (
          <div className="flex h-32 flex-col items-center justify-center rounded-lg border border-dashed border-eve-border/50 text-center">
            <Skull className="mb-2 h-6 w-6 text-eve-muted/50" />
            <p className="text-sm text-eve-muted">No recent losses.</p>
            <p className="text-xs text-eve-muted/70">Fly safe!</p>
          </div>
        )}

        {incomplete && losses.length > 0 && (
          <p className="mt-3 text-center text-xs text-eve-muted/70">
            Some characters may need re-authentication
          </p>
        )}
      </div>

      <div className="rounded-xl border border-eve-border bg-eve-deep p-4">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-eve-green/10">
            <Crosshair className="h-4 w-4 text-eve-green" />
          </div>
          <h3 className="font-semibold text-eve-text">Recent Kills</h3>
        </div>

        {kills.length > 0 ? (
          <div className="space-y-2">
            {kills.map((kill) => (
              <KillmailItem key={kill.id} killmail={kill} />
            ))}
          </div>
        ) : (
          <div className="flex h-32 flex-col items-center justify-center rounded-lg border border-dashed border-eve-border/50 text-center">
            <Crosshair className="mb-2 h-6 w-6 text-eve-muted/50" />
            <p className="text-sm text-eve-muted">No recent kills.</p>
            <p className="text-xs text-eve-muted/70">Get out there!</p>
          </div>
        )}

        {incomplete && kills.length > 0 && (
          <p className="mt-3 text-center text-xs text-eve-muted/70">
            Some characters may need re-authentication
          </p>
        )}
      </div>
    </div>
  )
}
