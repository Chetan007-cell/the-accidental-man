import { sql } from "drizzle-orm";
import {
  boolean,
  char,
  check,
  index,
  integer,
  jsonb,
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

export const uploadedMedia = pgTable("uploaded_media", {
  id: uuid("id").defaultRandom().primaryKey(),
  filename: varchar("filename", { length: 255 }).notNull().unique(),
  mimeType: varchar("mime_type", { length: 100 })
    .notNull()
    .default("image/jpeg"),
  dataBase64: text("data_base64").notNull(),
  sizeBytes: integer("size_bytes").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ---------------------------------------------------------------------------
// Commerce Foundation: Catalogue, Variants, Images & Inventory Movements
// ---------------------------------------------------------------------------

export const productStatus = pgEnum("product_status", [
  "draft",
  "active",
  "archived",
]);

export const inventoryMovementReason = pgEnum("inventory_movement_reason", [
  "opening_balance",
  "restock",
  "correction",
  "damage",
  "reservation",
  "release",
  "sale",
  "return",
]);

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: varchar("slug", { length: 80 }).notNull().unique(),
    name: varchar("name", { length: 120 }).notNull(),
    description: text("description"),
    isActive: boolean("is_active").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("categories_sort_order_idx").on(table.sortOrder),
    index("categories_is_active_idx").on(table.isActive),
  ],
);

export const products = pgTable(
  "products",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    slug: varchar("slug", { length: 160 }).notNull().unique(),
    name: varchar("name", { length: 200 }).notNull(),
    summary: varchar("summary", { length: 500 }).notNull(),
    description: text("description").notNull(),
    status: productStatus("status").notNull().default("draft"),
    currency: char("currency", { length: 3 }).notNull().default("INR"),
    metadata: jsonb("metadata").notNull().default({}),
    seoTitle: varchar("seo_title", { length: 200 }),
    seoDescription: varchar("seo_description", { length: 500 }),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("products_status_category_idx").on(table.status, table.categoryId),
    index("products_published_at_idx").on(table.publishedAt),
  ],
);

export const productVariants = pgTable(
  "product_variants",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "restrict" }),
    sku: varchar("sku", { length: 80 }).notNull().unique(),
    name: varchar("name", { length: 160 }).notNull(),
    optionValues: jsonb("option_values").notNull().default({}),
    priceMinor: integer("price_minor").notNull(),
    compareAtPriceMinor: integer("compare_at_price_minor"),
    stockOnHand: integer("stock_on_hand").notNull().default(0),
    stockReserved: integer("stock_reserved").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check("price_minor_check", sql.raw("price_minor >= 0")),
    check(
      "compare_at_price_check",
      sql.raw(
        "compare_at_price_minor IS NULL OR compare_at_price_minor >= price_minor",
      ),
    ),
    check("stock_on_hand_check", sql.raw("stock_on_hand >= 0")),
    check(
      "stock_reserved_check",
      sql.raw("stock_reserved >= 0 AND stock_reserved <= stock_on_hand"),
    ),
    index("product_variants_product_id_idx").on(table.productId),
    index("product_variants_product_active_idx").on(
      table.productId,
      table.isActive,
    ),
  ],
);

export const productImages = pgTable(
  "product_images",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "restrict" }),
    variantId: uuid("variant_id").references(() => productVariants.id, {
      onDelete: "set null",
    }),
    storageKey: varchar("storage_key", { length: 500 }).notNull(),
    altText: varchar("alt_text", { length: 300 }).notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("product_images_product_sort_idx").on(
      table.productId,
      table.sortOrder,
    ),
  ],
);

export const inventoryMovements = pgTable(
  "inventory_movements",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    variantId: uuid("variant_id")
      .notNull()
      .references(() => productVariants.id, { onDelete: "restrict" }),
    delta: integer("delta").notNull(),
    reason: inventoryMovementReason("reason").notNull(),
    referenceType: varchar("reference_type", { length: 40 }),
    referenceId: uuid("reference_id"),
    actorUserId: uuid("actor_user_id"),
    note: varchar("note", { length: 500 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check("delta_nonzero_check", sql.raw("delta <> 0")),
    index("inventory_movements_variant_id_idx").on(table.variantId),
    index("inventory_movements_created_at_idx").on(table.createdAt),
  ],
);
