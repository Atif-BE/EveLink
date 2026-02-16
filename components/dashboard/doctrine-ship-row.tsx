"use client"

import { useSortable } from "@dnd-kit/react/sortable"
import Image from "next/image"
import Link from "next/link"
import { GripVertical, Trash2, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { eveImageUrl, type DoctrineShip, type ShipRole } from "@/types"
import { RoleBadge } from "@/components/eve/role-badge"

type DoctrineShipRowProps = {
  ship: DoctrineShip
  index: number
  doctrineId: string
  onDelete?: (shipId: string) => void
  isDeleting?: boolean
  className?: string
}

export const DoctrineShipRow = ({
  ship,
  index,
  doctrineId,
  onDelete,
  isDeleting,
  className,
}: DoctrineShipRowProps) => {
  const { ref, isDragging } = useSortable({ id: ship.id, index })

  return (
    <div
      ref={ref}
      className={cn(
        "group flex items-center gap-3 rounded-lg border border-eve-border bg-eve-deep p-3 transition-all",
        isDragging && "z-50 border-eve-cyan/50 bg-eve-deep/90 shadow-lg shadow-eve-cyan/10",
        className
      )}
    >
      <div className="cursor-grab touch-none text-eve-text-muted/50 transition-colors hover:text-eve-text-muted active:cursor-grabbing">
        <GripVertical className="h-4 w-4" />
      </div>

      <Link
        href={`/dashboard/doctrines/${doctrineId}/ships/${ship.id}`}
        className="flex min-w-0 flex-1 items-center gap-3"
      >
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md border border-eve-border bg-eve-void">
          <Image
            src={eveImageUrl.render(ship.shipTypeId, 64)}
            alt={ship.shipName}
            fill
            className="object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate font-display text-sm font-medium text-eve-text">
              {ship.shipName}
            </span>
            <RoleBadge role={ship.role as ShipRole} size="sm" />
          </div>
          <p className="truncate text-sm text-eve-text-muted">{ship.fitName}</p>
        </div>
      </Link>

      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete(ship.id)
          }}
          disabled={isDeleting}
          className="rounded-lg p-2 text-eve-text-muted opacity-0 transition-all hover:bg-eve-red/10 hover:text-eve-red group-hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isDeleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </button>
      )}
    </div>
  )
}
