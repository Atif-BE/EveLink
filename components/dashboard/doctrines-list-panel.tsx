import { BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import { DoctrineCard } from "./doctrine-card"
import { CreateDoctrineDialog } from "./create-doctrine-dialog"
import type { DoctrineWithShips } from "@/types/db"

type DoctrinesListPanelProps = {
  doctrines: DoctrineWithShips[]
  className?: string
}

export const DoctrinesListPanel = ({
  doctrines,
  className,
}: DoctrinesListPanelProps) => {
  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-eve-cyan/10 border border-eve-cyan/30">
            <BookOpen className="h-5 w-5 text-eve-cyan" />
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold text-eve-text">
              Doctrines
            </h2>
            <p className="text-xs text-eve-text-muted">
              {doctrines.length} doctrine{doctrines.length !== 1 ? "s" : ""} available
            </p>
          </div>
        </div>
        <CreateDoctrineDialog />
      </div>

      {doctrines.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {doctrines.map((doctrine) => (
            <DoctrineCard key={doctrine.id} doctrine={doctrine} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-eve-border/50 bg-eve-deep/50 py-16">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-eve-void/50">
            <BookOpen className="h-8 w-8 text-eve-text-muted/50" />
          </div>
          <h3 className="mb-2 font-display text-base font-medium text-eve-text">
            No Doctrines Yet
          </h3>
          <p className="mb-6 max-w-sm text-center text-sm text-eve-text-muted">
            Create your first doctrine to start organizing ship fittings for
            your alliance fleets.
          </p>
          <CreateDoctrineDialog />
        </div>
      )}
    </div>
  )
}
