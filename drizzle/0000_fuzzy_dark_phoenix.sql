CREATE TYPE "public"."website_status" AS ENUM('active', 'inactive', 'archived');--> statement-breakpoint
CREATE TABLE "sections" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"website_id" varchar(256) NOT NULL,
	"title" varchar(256) NOT NULL,
	"subtitle" varchar(500),
	"content" text,
	"order" integer DEFAULT 0 NOT NULL,
	"type" varchar(50) DEFAULT 'text' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"website_id" varchar(256) NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" text,
	"icon" varchar(100),
	"price" varchar(100),
	"order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "team_members" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"website_id" varchar(256) NOT NULL,
	"name" varchar(256) NOT NULL,
	"role" varchar(256) NOT NULL,
	"bio" text,
	"image" varchar(500),
	"social_links" text,
	"order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"email" varchar(256) NOT NULL,
	"password_hash" varchar(256),
	"name" varchar(256) NOT NULL,
	"image" varchar(256),
	"role" varchar(50) DEFAULT 'editor' NOT NULL,
	"status" varchar(50) DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "websites" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"slug" varchar(256) NOT NULL,
	"name" varchar(256) NOT NULL,
	"url" varchar(500) NOT NULL,
	"description" text,
	"api_key" varchar(256) NOT NULL,
	"status" "website_status" DEFAULT 'active' NOT NULL,
	"owner_id" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "websites_slug_unique" UNIQUE("slug"),
	CONSTRAINT "websites_api_key_unique" UNIQUE("api_key")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "owner_id_idx" ON "websites" USING btree ("owner_id");--> statement-breakpoint
CREATE UNIQUE INDEX "url_idx" ON "websites" USING btree ("url");--> statement-breakpoint
CREATE UNIQUE INDEX "api_key_idx" ON "websites" USING btree ("api_key");--> statement-breakpoint
CREATE UNIQUE INDEX "slug_idx" ON "websites" USING btree ("slug");