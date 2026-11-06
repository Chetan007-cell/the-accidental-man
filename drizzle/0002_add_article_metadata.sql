ALTER TABLE "articles" ADD COLUMN IF NOT EXISTS "hero_image_alt" text DEFAULT '';--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN IF NOT EXISTS "category" varchar(120) DEFAULT 'FOUNDATIONS';--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN IF NOT EXISTS "tags" text DEFAULT '[]';--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN IF NOT EXISTS "reading_time_minutes" integer DEFAULT 5;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN IF NOT EXISTS "content_json" text DEFAULT '';
