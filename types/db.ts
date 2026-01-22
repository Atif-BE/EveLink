import type { InferSelectModel, InferInsertModel } from "drizzle-orm"
import type { users, characters } from "@/db/schema"

// User types
export type User = InferSelectModel<typeof users>
export type NewUser = InferInsertModel<typeof users>

// Character types
export type Character = InferSelectModel<typeof characters>
export type NewCharacter = InferInsertModel<typeof characters>

// Extended types for UI
export type CharacterWithCorp = Character & {
  corporationName?: string
  corporationTicker?: string
  allianceName?: string
  allianceTicker?: string
}

export type LinkedCharacterDisplay = {
  id: number
  name: string
  portrait: string
  corporationId: number
  corporationName: string
  isActive: boolean
  linkedAt: Date
}
