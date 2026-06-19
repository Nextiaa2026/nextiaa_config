ALTER TABLE "team_members" ADD COLUMN IF NOT EXISTS "email" varchar(256);--> statement-breakpoint
ALTER TABLE "team_members" ADD COLUMN IF NOT EXISTS "phone" varchar(50);--> statement-breakpoint
ALTER TABLE "team_members" ADD COLUMN IF NOT EXISTS "department" varchar(256);--> statement-breakpoint
ALTER TABLE "team_members" ADD COLUMN IF NOT EXISTS "location" varchar(256);--> statement-breakpoint
ALTER TABLE "team_members" ADD COLUMN IF NOT EXISTS "linkedin" varchar(500);--> statement-breakpoint
ALTER TABLE "team_members" ADD COLUMN IF NOT EXISTS "twitter" varchar(500);--> statement-breakpoint
ALTER TABLE "team_members" ADD COLUMN IF NOT EXISTS "github" varchar(500);
