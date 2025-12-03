import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * User tier table - tracks subscription tier for each user
 */
export const userTiers = mysqlTable("userTiers", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  tier: mysqlEnum("tier", ["lite", "pro"]).default("lite").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserTier = typeof userTiers.$inferSelect;
export type InsertUserTier = typeof userTiers.$inferInsert;

/**
 * Generated clips table - stores metadata for each generated clip
 */
export const clips = mysqlTable("clips", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  videoUrl: text("videoUrl").notNull(),
  videoSource: mysqlEnum("videoSource", ["youtube", "upload"]).notNull(),
  artistName: varchar("artistName", { length: 255 }).notNull(),
  sceneTheme: varchar("sceneTheme", { length: 255 }).notNull(),
  keywords: text("keywords"),
  clipTitle: text("clipTitle").notNull(),
  clipDescription: text("clipDescription").notNull(),
  clipUrl: text("clipUrl"),
  startTime: int("startTime").notNull(), // in seconds
  endTime: int("endTime").notNull(), // in seconds
  duration: int("duration").notNull(), // in seconds
  hasSubtitles: int("hasSubtitles").default(0).notNull(), // 0 or 1 for boolean
  viralScore: int("viralScore").default(0).notNull(), // 0-100
  personaAnalysis: text("personaAnalysis"),
  themeAnalysis: text("themeAnalysis"),
  sentimentAnalysis: text("sentimentAnalysis"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Clip = typeof clips.$inferSelect;
export type InsertClip = typeof clips.$inferInsert;

/**
 * Daily usage tracking - tracks clip generation count per day for Lite tier
 */
export const dailyUsage = mysqlTable("dailyUsage", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD format
  clipsGenerated: int("clipsGenerated").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DailyUsage = typeof dailyUsage.$inferSelect;
export type InsertDailyUsage = typeof dailyUsage.$inferInsert;

/**
 * User preferences table - stores user-specific settings
 */
export const userPreferences = mysqlTable("userPreferences", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  defaultArtistName: varchar("defaultArtistName", { length: 255 }),
  defaultTheme: varchar("defaultTheme", { length: 255 }),
  subtitlesEnabled: int("subtitlesEnabled").default(1).notNull(), // 0 or 1
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserPreferences = typeof userPreferences.$inferSelect;
export type InsertUserPreferences = typeof userPreferences.$inferInsert;