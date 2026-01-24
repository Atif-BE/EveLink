CREATE TABLE "fleet_rsvps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fleet_id" uuid NOT NULL,
	"character_id" integer NOT NULL,
	"character_name" text NOT NULL,
	"ship_type_id" integer,
	"ship_name" text,
	"status" text DEFAULT 'confirmed' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fleets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"alliance_id" integer NOT NULL,
	"doctrine_id" uuid,
	"fc_character_id" integer NOT NULL,
	"fc_character_name" text NOT NULL,
	"created_by_id" integer NOT NULL,
	"scheduled_at" timestamp NOT NULL,
	"status" text DEFAULT 'scheduled' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "fleet_rsvps" ADD CONSTRAINT "fleet_rsvps_fleet_id_fleets_id_fk" FOREIGN KEY ("fleet_id") REFERENCES "public"."fleets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fleets" ADD CONSTRAINT "fleets_doctrine_id_doctrines_id_fk" FOREIGN KEY ("doctrine_id") REFERENCES "public"."doctrines"("id") ON DELETE set null ON UPDATE no action;