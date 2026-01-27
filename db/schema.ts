import {
  pgTable,
  text,
  integer,
  timestamp,
  boolean,
  real,
  uuid,
  jsonb,
  index,
} from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  primaryCharacterId: integer("primary_character_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const characters = pgTable(
  "characters",
  {
    id: integer("id").primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    corporationId: integer("corporation_id").notNull(),
    allianceId: integer("alliance_id"),

    accessToken: text("access_token").notNull(),
    refreshToken: text("refresh_token").notNull(),
    tokenExpiresAt: timestamp("token_expires_at").notNull(),

    securityStatus: real("security_status"),
    birthday: timestamp("birthday"),
    raceId: integer("race_id"),
    bloodlineId: integer("bloodline_id"),
    ancestryId: integer("ancestry_id"),
    gender: text("gender"),

    linkedAt: timestamp("linked_at").defaultNow().notNull(),
    lastLoginAt: timestamp("last_login_at"),
    isActive: boolean("is_active").default(true).notNull(),
  },
  (table) => [index("characters_user_id_idx").on(table.userId)]
)

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

export const doctrineShips = pgTable(
  "doctrine_ships",
  {
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
  },
  (table) => [index("doctrine_ships_doctrine_id_idx").on(table.doctrineId)]
)

export const doctrinesRelations = relations(doctrines, ({ many }) => ({
  ships: many(doctrineShips),
}))

export const doctrineShipsRelations = relations(doctrineShips, ({ one }) => ({
  doctrine: one(doctrines, {
    fields: [doctrineShips.doctrineId],
    references: [doctrines.id],
  }),
}))

export const fleets = pgTable(
  "fleets",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    description: text("description"),
    allianceId: integer("alliance_id").notNull(),
    doctrineId: uuid("doctrine_id").references(() => doctrines.id, {
      onDelete: "set null",
    }),
    fcCharacterId: integer("fc_character_id").notNull(),
    fcCharacterName: text("fc_character_name").notNull(),
    createdById: integer("created_by_id").notNull(),
    scheduledAt: timestamp("scheduled_at").notNull(),
    srpEligible: boolean("srp_eligible").default(false).notNull(),
    status: text("status").default("scheduled").notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("fleets_alliance_id_idx").on(table.allianceId),
    index("fleets_status_idx").on(table.status),
    index("fleets_alliance_status_idx").on(table.allianceId, table.status),
  ]
)

export const fleetRsvps = pgTable("fleet_rsvps", {
  id: uuid("id").defaultRandom().primaryKey(),
  fleetId: uuid("fleet_id")
    .notNull()
    .references(() => fleets.id, { onDelete: "cascade" }),
  characterId: integer("character_id").notNull(),
  characterName: text("character_name").notNull(),
  shipTypeId: integer("ship_type_id"),
  shipName: text("ship_name"),
  status: text("status").default("confirmed").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const fleetsRelations = relations(fleets, ({ one, many }) => ({
  doctrine: one(doctrines, {
    fields: [fleets.doctrineId],
    references: [doctrines.id],
  }),
  rsvps: many(fleetRsvps),
  srpRequests: many(srpRequests),
}))

export const fleetRsvpsRelations = relations(fleetRsvps, ({ one }) => ({
  fleet: one(fleets, {
    fields: [fleetRsvps.fleetId],
    references: [fleets.id],
  }),
}))

export const srpRequests = pgTable(
  "srp_requests",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    fleetId: uuid("fleet_id")
      .notNull()
      .references(() => fleets.id, { onDelete: "cascade" }),
    characterId: integer("character_id").notNull(),
    characterName: text("character_name").notNull(),
    killmailId: integer("killmail_id").notNull(),
    killmailHash: text("killmail_hash").notNull(),
    shipTypeId: integer("ship_type_id").notNull(),
    shipName: text("ship_name").notNull(),
    iskValue: real("isk_value").notNull(),
    fitValidation: text("fit_validation").notNull(),
    fitMatchScore: real("fit_match_score").notNull(),
    fitDifferences: jsonb("fit_differences"),
    status: text("status").default("pending").notNull(),
    submittedAt: timestamp("submitted_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    iskPayout: real("isk_payout"),
    reviewedById: integer("reviewed_by_id"),
    reviewedByName: text("reviewed_by_name"),
    reviewNote: text("review_note"),
    reviewedAt: timestamp("reviewed_at"),
  },
  (table) => [
    index("srp_requests_fleet_id_idx").on(table.fleetId),
    index("srp_requests_status_idx").on(table.status),
    index("srp_requests_fleet_status_idx").on(table.fleetId, table.status),
  ]
)

export const srpRequestsRelations = relations(srpRequests, ({ one }) => ({
  fleet: one(fleets, {
    fields: [srpRequests.fleetId],
    references: [fleets.id],
  }),
}))
