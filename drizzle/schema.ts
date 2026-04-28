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
 * Leads table for storing form submissions from website
 */
export const leads = mysqlTable("leads", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  whatsapp: varchar("whatsapp", { length: 50 }),
  email: varchar("email", { length: 320 }),
  equipmentType: varchar("equipmentType", { length: 100 }),
  component: varchar("component", { length: 100 }),
  symptoms: text("symptoms"),
  comment: text("comment"),
  sourcePage: varchar("sourcePage", { length: 500 }).notNull(),
  formType: varchar("formType", { length: 50 }).notNull(), // 'b2b', 'call_specialist', 'calculator'
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  priority: int("priority").default(3).notNull(), // 1-5, where 5 is highest priority
  status: mysqlEnum("status", ["new", "urgent", "in_progress", "completed", "rejected"]).default("new").notNull(),
  aiSummary: text("aiSummary"), // AI-generated summary of the lead
  emailSent: int("emailSent").default(0).notNull(), // 0 = not sent, 1 = sent
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;