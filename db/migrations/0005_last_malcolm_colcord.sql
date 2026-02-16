CREATE TABLE "alliances" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"ticker" text NOT NULL,
	"executor_corp_id" integer NOT NULL,
	"registered_by_id" integer NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"registered_at" timestamp DEFAULT now() NOT NULL
);
