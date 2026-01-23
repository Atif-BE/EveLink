CREATE TABLE "characters" (
	"id" integer PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"corporation_id" integer NOT NULL,
	"alliance_id" integer,
	"access_token" text NOT NULL,
	"refresh_token" text NOT NULL,
	"token_expires_at" timestamp NOT NULL,
	"security_status" real,
	"birthday" timestamp,
	"race_id" integer,
	"bloodline_id" integer,
	"ancestry_id" integer,
	"gender" text,
	"linked_at" timestamp DEFAULT now() NOT NULL,
	"last_login_at" timestamp,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "doctrine_ships" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"doctrine_id" uuid NOT NULL,
	"ship_type_id" integer NOT NULL,
	"ship_name" text NOT NULL,
	"fit_name" text NOT NULL,
	"role" text NOT NULL,
	"fitting" jsonb NOT NULL,
	"raw_eft" text NOT NULL,
	"priority" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "doctrines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"alliance_id" integer NOT NULL,
	"created_by_id" integer NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"primary_character_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "characters" ADD CONSTRAINT "characters_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctrine_ships" ADD CONSTRAINT "doctrine_ships_doctrine_id_doctrines_id_fk" FOREIGN KEY ("doctrine_id") REFERENCES "public"."doctrines"("id") ON DELETE cascade ON UPDATE no action;