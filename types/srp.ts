export const SRP_REQUEST_STATUSES = [
  "pending",
  "approved",
  "denied",
  "paid",
] as const

export type SrpRequestStatus = (typeof SRP_REQUEST_STATUSES)[number]

export const FIT_VALIDATION_STATUSES = ["valid", "partial", "invalid"] as const

export type FitValidationStatus = (typeof FIT_VALIDATION_STATUSES)[number]

export type FitDifferences = {
  missingModules: { name: string; typeId?: number; slot: string }[]
  extraModules: { name: string; typeId?: number; slot: string }[]
  summary: string
}

export type FitComparisonResult = {
  validation: FitValidationStatus
  matchScore: number
  differences: FitDifferences
}

export type EligibleLoss = {
  killmailId: number
  killmailHash: string
  shipTypeId: number
  shipName: string
  iskValue: number
  killmailTime: Date
  matchingFleets: {
    fleetId: string
    fleetName: string
    doctrineShipId: string
    doctrineShipName: string
    scheduledAt: Date
  }[]
}

export const SRP_STATUS_CONFIG: Record<
  SrpRequestStatus,
  { label: string; color: string }
> = {
  pending: { label: "Pending", color: "yellow" },
  approved: { label: "Approved", color: "cyan" },
  denied: { label: "Denied", color: "red" },
  paid: { label: "Paid", color: "green" },
}

export const FIT_VALIDATION_CONFIG: Record<
  FitValidationStatus,
  { label: string; color: string; description: string }
> = {
  valid: {
    label: "Valid Fit",
    color: "green",
    description: "Fit matches doctrine requirements (95%+ match)",
  },
  partial: {
    label: "Partial Match",
    color: "yellow",
    description: "Fit partially matches doctrine (70-95% match)",
  },
  invalid: {
    label: "Invalid Fit",
    color: "red",
    description: "Fit does not match doctrine requirements (<70% match)",
  },
}
