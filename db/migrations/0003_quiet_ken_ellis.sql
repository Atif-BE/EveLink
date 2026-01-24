CREATE TABLE "srp_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fleet_id" uuid NOT NULL,
	"character_id" integer NOT NULL,
	"character_name" text NOT NULL,
	"killmail_id" integer NOT NULL,
	"killmail_hash" text NOT NULL,
	"ship_type_id" integer NOT NULL,
	"ship_name" text NOT NULL,
	"isk_value" real NOT NULL,
	"fit_validation" text NOT NULL,
	"fit_match_score" real NOT NULL,
	"fit_differences" jsonb,
	"status" text DEFAULT 'pending' NOT NULL,
	"submitted_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"isk_payout" real,
	"reviewed_by_id" integer,
	"reviewed_by_name" text,
	"review_note" text,
	"reviewed_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "srp_requests" ADD CONSTRAINT "srp_requests_fleet_id_fleets_id_fk" FOREIGN KEY ("fleet_id") REFERENCES "public"."fleets"("id") ON DELETE cascade ON UPDATE no action;