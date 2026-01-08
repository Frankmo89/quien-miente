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
 * Question packs that can be purchased
 */
export const questionPacks = mysqlTable("question_packs", {
  id: int("id").autoincrement().primaryKey(),
  packId: varchar("pack_id", { length: 64 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  mode: mysqlEnum("mode", ["familiar", "adultos", "both"]).notNull(),
  price: int("price").notNull(), // Price in cents (0 for free packs)
  stripePriceId: varchar("stripe_price_id", { length: 255 }), // Stripe Price ID for paid packs
  isActive: int("is_active").default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type QuestionPack = typeof questionPacks.$inferSelect;
export type InsertQuestionPack = typeof questionPacks.$inferInsert;

/**
 * Questions belonging to packs
 */
export const questions = mysqlTable("questions", {
  id: int("id").autoincrement().primaryKey(),
  packId: varchar("pack_id", { length: 64 }).notNull(),
  questionText: text("question_text").notNull(),
  mode: mysqlEnum("mode", ["familiar", "adultos"]).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Question = typeof questions.$inferSelect;
export type InsertQuestion = typeof questions.$inferInsert;

/**
 * Mini challenges for losers
 */
export const miniChallenges = mysqlTable("mini_challenges", {
  id: int("id").autoincrement().primaryKey(),
  challengeText: text("challenge_text").notNull(),
  mode: mysqlEnum("mode", ["familiar", "adultos", "both"]).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type MiniChallenge = typeof miniChallenges.$inferSelect;
export type InsertMiniChallenge = typeof miniChallenges.$inferInsert;