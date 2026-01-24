export const FLEET_STATUSES = [
  "scheduled",
  "active",
  "completed",
  "cancelled",
] as const

export type FleetStatus = (typeof FLEET_STATUSES)[number]

export const RSVP_STATUSES = ["confirmed", "tentative", "declined"] as const

export type RsvpStatus = (typeof RSVP_STATUSES)[number]

export const FLEET_STATUS_CONFIG: Record<
  FleetStatus,
  { label: string; color: string }
> = {
  scheduled: { label: "Scheduled", color: "cyan" },
  active: { label: "Active", color: "green" },
  completed: { label: "Completed", color: "muted" },
  cancelled: { label: "Cancelled", color: "red" },
}

export const RSVP_STATUS_CONFIG: Record<
  RsvpStatus,
  { label: string; color: string }
> = {
  confirmed: { label: "Confirmed", color: "green" },
  tentative: { label: "Tentative", color: "yellow" },
  declined: { label: "Declined", color: "red" },
}
