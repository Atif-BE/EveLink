import { Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { FleetCard } from "./fleet-card"
import { CreateFleetDialog } from "./create-fleet-dialog"
import type { FleetWithRelations, DoctrineWithShips, Character } from "@/types/db"

type FleetsListPanelProps = {
  fleets: FleetWithRelations[]
  doctrines: DoctrineWithShips[]
  allianceMembers: Pick<Character, "id" | "name">[]
  className?: string
}

export const FleetsListPanel = ({
  fleets,
  doctrines,
  allianceMembers,
  className,
}: FleetsListPanelProps) => {
  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-eve-cyan/10 border border-eve-cyan/30">
            <Users className="h-5 w-5 text-eve-cyan" />
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold text-eve-text">
              Fleets
            </h2>
            <p className="text-xs text-eve-text-muted">
              {fleets.length} upcoming fleet{fleets.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <CreateFleetDialog doctrines={doctrines} allianceMembers={allianceMembers} />
      </div>

      {fleets.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {fleets.map((fleet) => (
            <FleetCard key={fleet.id} fleet={fleet} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-eve-border/50 bg-eve-deep/50 py-16">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-eve-void/50">
            <Users className="h-8 w-8 text-eve-text-muted/50" />
          </div>
          <h3 className="mb-2 font-display text-base font-medium text-eve-text">
            No Upcoming Fleets
          </h3>
          <p className="mb-6 max-w-sm text-center text-sm text-eve-text-muted">
            Schedule a fleet operation to coordinate with your alliance members.
          </p>
          <CreateFleetDialog doctrines={doctrines} allianceMembers={allianceMembers} />
        </div>
      )}
    </div>
  )
}
