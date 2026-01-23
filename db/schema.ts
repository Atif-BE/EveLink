import {
  pgTable,
  text,
  integer,
  timestamp,
  boolean,
  real,
  uuid,
  jsonb,
} from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

// Users table - identified by a stable UUID, not by EVE character
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  primaryCharacterId: integer("primary_character_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Characters table - EVE characters linked to users
export const characters = pgTable("characters", {
  id: integer("id").primaryKey(), // EVE character ID from ESI
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  corporationId: integer("corporation_id").notNull(),
  allianceId: integer("alliance_id"),

  // OAuth tokens for this character
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token").notNull(),
  tokenExpiresAt: timestamp("token_expires_at").notNull(),

  // Character stats (cached from ESI)
  securityStatus: real("security_status"),
  birthday: timestamp("birthday"),
  raceId: integer("race_id"),
  bloodlineId: integer("bloodline_id"),
  ancestryId: integer("ancestry_id"),
  gender: text("gender"),

  // Metadata
  linkedAt: timestamp("linked_at").defaultNow().notNull(),
  lastLoginAt: timestamp("last_login_at"),
  isActive: boolean("is_active").default(true).notNull(),
})

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  characters: many(characters),
}))

export const charactersRelations = relations(characters, ({ one }) => ({
  user: one(users, {
    fields: [characters.userId],
    references: [users.id],
  }),
}))

export const doctrines = pgTable("doctrines", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  allianceId: integer("alliance_id").notNull(),
  createdById: integer("created_by_id").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const doctrineShips = pgTable("doctrine_ships", {
  id: uuid("id").defaultRandom().primaryKey(),
  doctrineId: uuid("doctrine_id")
    .notNull()
    .references(() => doctrines.id, { onDelete: "cascade" }),
  shipTypeId: integer("ship_type_id").notNull(),
  shipName: text("ship_name").notNull(),
  fitName: text("fit_name").notNull(),
  role: text("role").notNull(),
  fitting: jsonb("fitting").notNull(),
  rawEft: text("raw_eft").notNull(),
  priority: integer("priority").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const doctrinesRelations = relations(doctrines, ({ many }) => ({
  ships: many(doctrineShips),
}))

export const doctrineShipsRelations = relations(doctrineShips, ({ one }) => ({
  doctrine: one(doctrines, {
    fields: [doctrineShips.doctrineId],
    references: [doctrines.id],
  }),
}))
