"use client"

import { useState } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
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

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = ships.findIndex((s) => s.id === active.id)
      const newIndex = ships.findIndex((s) => s.id === over.id)

      const newShips = arrayMove(ships, oldIndex, newIndex)
      setShips(newShips)

      await reorderShips(doctrineId, newShips.map((s) => s.id))
    }
  }

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

  const sortedShips = [...ships].sort((a, b) => b.priority - a.priority)

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={sortedShips.map((s) => s.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className={cn("space-y-2", className)}>
          {sortedShips.map((ship) => (
            <DoctrineShipRow
              key={ship.id}
              ship={ship}
              doctrineId={doctrineId}
              onDelete={handleDeleteShip}
              isDeleting={deletingShipId === ship.id}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
