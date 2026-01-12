DO $$ BEGIN
 CREATE TYPE "public"."event_category" AS ENUM('hackathon', 'exhibition', 'competition', 'workshop', 'session');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "event_registration" (
	"id" text PRIMARY KEY NOT NULL,
	"eventId" text NOT NULL,
	"teamId" text NOT NULL,
	"score" integer DEFAULT 0,
	"rank" integer,
	"registeredAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "event" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"category" "event_category" NOT NULL,
	"date" text,
	"maxScore" integer DEFAULT 100 NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "event_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "user" DROP CONSTRAINT IF EXISTS "user_rollNo_unique";
--> statement-breakpoint
ALTER TABLE "user" DROP CONSTRAINT IF EXISTS "user_phoneNo_unique";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "event_registration" ADD CONSTRAINT "event_registration_eventId_event_id_fk" FOREIGN KEY ("eventId") REFERENCES "public"."event"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "event_registration" ADD CONSTRAINT "event_registration_teamId_team_id_fk" FOREIGN KEY ("teamId") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;