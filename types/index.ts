// Central re-export for all types

// ESI API types
export type {
  CharacterInfo,
  CorporationInfo,
  AllianceInfo,
  CharacterAffiliation,
  RaceInfo,
  BloodlineInfo,
  AncestryInfo,
} from "./esi"

// Session types
export type { SessionData } from "./session"

// Auth/OAuth types
export type { TokenResponse, JWTPayload } from "./auth"

// Display types (for UI)
export type {
  CharacterDisplay,
  CorporationDisplay,
  AllianceDisplay,
  UserProfile,
} from "./eve"
export { eveImageUrl } from "./eve"

// Database types
export type {
  User,
  NewUser,
  Character,
  NewCharacter,
  CharacterWithCorp,
  LinkedCharacterDisplay,
  SrpRequest,
  NewSrpRequest,
  SrpRequestWithFleet,
} from "./db"

// SRP types
export type {
  SrpRequestStatus,
  FitValidationStatus,
  FitDifferences,
  FitComparisonResult,
  EligibleLoss,
} from "./srp"
export {
  SRP_REQUEST_STATUSES,
  FIT_VALIDATION_STATUSES,
  SRP_STATUS_CONFIG,
  FIT_VALIDATION_CONFIG,
} from "./srp"
