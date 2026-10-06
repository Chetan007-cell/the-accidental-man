ALTER TABLE "subscribers" ADD COLUMN "welcome_email_sent_at" timestamp with time zone;
--> statement-breakpoint
ALTER TABLE "subscribers" ADD COLUMN "unsubscribe_token" varchar(64);
--> statement-breakpoint
UPDATE "subscribers" SET "unsubscribe_token" = replace(gen_random_uuid()::text, '-', '') WHERE "unsubscribe_token" IS NULL;
--> statement-breakpoint
ALTER TABLE "subscribers" ALTER COLUMN "unsubscribe_token" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "subscribers" ADD CONSTRAINT "subscribers_unsubscribe_token_unique" UNIQUE("unsubscribe_token");
