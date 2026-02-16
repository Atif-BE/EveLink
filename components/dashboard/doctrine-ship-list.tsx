"use client"

import { useState, useRef } from "react"
import { DragDropProvider } from "@dnd-kit/react"
import { isSortable } from "@dnd-kit/react/sortable"
import { move } from "@dnd-kit/helpers"
import { cn } from "@/lib/utils"
import { DoctrineShipRow } from "./doctrine-ship-row"
import { reorderShips, removeShipAction } from "@/app/(dashboard)/dashboard/doctrines/[id]/actions"
import type { DoctrineShip } from "@/types"

type DoctrineShipListProps = {
  ships: DoctrineShip[]
  doctrineId: string
  className?: string
}

export const DoctrineShipList = ({
  ships: initialShips,
  doctrineId,
  className,
}: DoctrineShipListProps) => {
  const [ships, setShips] = useState(initialShips)
  const [deletingShipId, setDeletingShipId] = useState<string | null>(null)
  const previousShips = useRef(ships)

  const sortedShips = [...ships].sort((a, b) => b.priority - a.priority)

  const handleDeleteShip = async (shipId: string) => {
    if (!confirm("Remove this ship from the doctrine?")) return

    setDeletingShipId(shipId)
    try {
      const result = await removeShipAction(doctrineId, shipId)
      if (result.success) {
        setShips(ships.filter((s) => s.id !== shipId))
      }
    } finally {
      setDeletingShipId(null)
    }
  }

  return (
    <DragDropProvider
      onDragStart={() => {
        previousShips.current = sortedShips
      }}
      onDragOver={(event) => {
        setShips((current) => {
          const sorted = [...current].sort((a, b) => b.priority - a.priority)
          return move(sorted, event)
        })
      }}
      onDragEnd={async (event) => {
        if (event.canceled) {
          setShips(previousShips.current)
          return
        }

        const { source } = event.operation
        if (isSortable(source)) {
          const from = source.sortable.initialIndex
          const to = source.sortable.index
          if (from !== to) {
            const reordered = [...ships].sort((a, b) => b.priority - a.priority)
            await reorderShips(doctrineId, reordered.map((s) => s.id))
          }
        }
      }}
    >
      <div className={cn("space-y-2", className)}>
        {sortedShips.map((ship, index) => (
          <DoctrineShipRow
            key={ship.id}
            ship={ship}
            index={index}
            doctrineId={doctrineId}
            onDelete={handleDeleteShip}
            isDeleting={deletingShipId === ship.id}
          />
        ))}
      </div>
    </DragDropProvider>
  )
}
