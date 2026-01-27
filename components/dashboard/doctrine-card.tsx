import Link from "next/link"
import Image from "next/image"
import { Ship, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { eveImageUrl, type DoctrineWithShips, type ShipRole } from "@/types"
import { RoleBadge } from "@/components/eve/role-badge"

type DoctrineCardProps = {
  doctrine: DoctrineWithShips
  className?: string
}

export const DoctrineCard = ({ doctrine, className }: DoctrineCardProps) => {
  const roleCount = doctrine.ships.reduce(
    (acc, ship) => {
      const role = ship.role as ShipRole
      acc[role] = (acc[role] || 0) + 1
      return acc
    },
    {} as Record<ShipRole, number>
  )

  const topRoles = Object.entries(roleCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)

  const previewShips = doctrine.ships.slice(0, 4)

  return (
    <Link
      href={`/dashboard/doctrines/${doctrine.id}`}
      className={cn(
        "group relative block rounded-xl border border-eve-border bg-eve-deep p-4 transition-all duration-200",
        "hover:border-eve-cyan/50 hover:bg-eve-deep/80",
        className
      )}
    >
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-eve-cyan/5 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

      <div className="relative">
        <div className="mb-3 flex items-start justify-between">
          <div>
            <h3 className="font-display text-base font-semibold text-eve-text group-hover:text-eve-cyan">
              {doctrine.name}
            </h3>
            {doctrine.description && (
              <p className="mt-1 line-clamp-2 text-sm text-eve-text-muted">
                {doctrine.description}
              </p>
            )}
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-eve-text-muted transition-transform duration-200 group-hover:translate-x-1 group-hover:text-eve-cyan" />
        </div>

        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-eve-void/50">
            <Ship className="h-3.5 w-3.5 text-eve-text-muted" />
          </div>
          <span className="text-sm text-eve-text-secondary">
            {doctrine.ships.length} ship{doctrine.ships.length !== 1 ? "s" : ""}
          </span>
        </div>

        {topRoles.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {topRoles.map(([role, count]) => (
              <div key={role} className="flex items-center gap-1">
                <RoleBadge role={role as ShipRole} />
                <span className="text-sm text-eve-text-muted">x{count}</span>
              </div>
            ))}
          </div>
        )}

        {previewShips.length > 0 && (
          <div className="flex -space-x-2">
            {previewShips.map((ship) => (
              <div
                key={ship.id}
                className="relative h-8 w-8 overflow-hidden rounded-lg border-2 border-eve-deep bg-eve-void"
              >
                <Image
                  src={eveImageUrl.render(ship.shipTypeId, 64)}
                  alt={ship.shipName}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
            {doctrine.ships.length > 4 && (
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-eve-deep bg-eve-void text-sm text-eve-text-muted">
                +{doctrine.ships.length - 4}
              </div>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}
