import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core"
import type { AdapterAccountType } from "@auth/core/adapters"
 

// Enums
export const teamRoleEnum = pgEnum("team_role", ["leader", "member"]);
export const joinRequestStatusEnum = pgEnum("join_request_status", ["pending", "accepted", "rejected"]);

 
export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  role: text("role", { enum: ["admin", "user"] }).notNull().default("user"),
  rollNo: text("rollNo"),
  branch: text("branch"),
  phoneNo: text("phoneNo"),
  createdAt: timestamp("createdAt", { mode: "date" })
    .notNull()
    .defaultNow()
})
 
export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ]
)
 
export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})
 
export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => [
    {
      compositePk: primaryKey({
        columns: [verificationToken.identifier, verificationToken.token],
      }),
    },
  ]
)
 
export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => [
    {
      compositePK: primaryKey({
        columns: [authenticator.userId, authenticator.credentialID],
      }),
    },
  ]
)

// Teams and Team Members Tables
export const teams = pgTable(
  "team",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    score: integer("score").notNull().default(0),
    leaderId: text("leaderId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("createdAt", { mode: "date" })
      .notNull()
      .defaultNow(),
  }
)

export const teamMembers = pgTable(
  "team_member",
  {
    teamId: text("teamId")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: teamRoleEnum("role").notNull().default("member"),
    joinedAt: timestamp("joinedAt", { mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (teamMember) => [
    {
      compositePK: primaryKey({
        columns: [teamMember.teamId, teamMember.userId],
      }),
    }
  ]
)

// Join Requests Table - for leader approval workflow
export const joinRequests = pgTable(
  "join_request",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    teamId: text("teamId")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    status: joinRequestStatusEnum("status").notNull().default("pending"),
    createdAt: timestamp("createdAt", { mode: "date" })
      .notNull()
      .defaultNow(),
  }
)

// Events Table
export const eventCategoryEnum = pgEnum("event_category", [
  "hackathon",
  "exhibition",
  "competition",
  "workshop",
  "session",
]);

export const events = pgTable("event", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  category: eventCategoryEnum("category").notNull(),
  date: text("date"), // e.g. "23 Jan, 7 PM - 24 Jan, 2 PM"
  maxScore: integer("maxScore").notNull().default(100),
  isActive: boolean("isActive").notNull().default(true),
  createdAt: timestamp("createdAt", { mode: "date" })
    .notNull()
    .defaultNow(),
});

// Event Registrations Table - teams registered for events
export const eventRegistrations = pgTable(
  "event_registration",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    eventId: text("eventId")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    teamId: text("teamId")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    score: integer("score").default(0),
    rank: integer("rank"),
    registeredAt: timestamp("registeredAt", { mode: "date" })
      .notNull()
      .defaultNow(),
  }
)

