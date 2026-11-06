import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const subscriberStatus = pgEnum("subscriber_status", [
  "pending",
  "active",
  "unsubscribed",
]);

export const subscribers = pgTable("subscribers", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 254 }).notNull().unique(),
  status: subscriberStatus("status").notNull().default("pending"),
  consentAt: timestamp("consent_at", { withTimezone: true }),
  consentSource: varchar("consent_source", { length: 100 }),
  welcomeEmailSentAt: timestamp("welcome_email_sent_at", {
    withTimezone: true,
  }),
  unsubscribeToken: varchar("unsubscribe_token", { length: 64 })
    .notNull()
    .unique(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const articles = pgTable("articles", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: varchar("slug", { length: 180 }).notNull().unique(),
  title: varchar("title", { length: 220 }).notNull(),
  dek: text("dek"),
  body: text("body").notNull().default(""),
  status: varchar("status", { length: 20 }).notNull().default("draft"),
  authorName: varchar("author_name", { length: 120 }).notNull(),
  heroImageUrl: text("hero_image_url"),
  heroImageAlt: text("hero_image_alt").default(""),
  category: varchar("category", { length: 120 }).default("FOUNDATIONS"),
  tags: text("tags").default("[]"),
  readingTimeMinutes: integer("reading_time_minutes").default(5),
  contentJson: text("content_json").default(""),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const adminUsers = pgTable("admin_users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 254 }).notNull().unique(),
  displayName: varchar("display_name", { length: 120 }).notNull(),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
