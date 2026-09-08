CREATE TABLE "commentary" (
	"id" bigserial PRIMARY KEY,
	"tracked_event_id" bigint NOT NULL,
	"display_name" varchar(50) DEFAULT 'Anonymous' NOT NULL,
	"body" text NOT NULL,
	"flagged" boolean DEFAULT false NOT NULL,
	"ip_hash" varchar(64) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event_entries" (
	"id" bigserial PRIMARY KEY,
	"tracked_event_id" bigint NOT NULL,
	"entry_type" varchar(50) NOT NULL,
	"payload" jsonb DEFAULT '{}' NOT NULL,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tracked_events" (
	"id" bigserial PRIMARY KEY,
	"title" varchar(255) NOT NULL,
	"status" varchar(20) DEFAULT 'scheduled' NOT NULL,
	"starts_at" timestamp with time zone,
	"ended_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "idx_commentary_event_time" ON "commentary" ("tracked_event_id","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "idx_commentary_ip_hash" ON "commentary" ("ip_hash","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "idx_entries_event_time" ON "event_entries" ("tracked_event_id","occurred_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "idx_entries_type" ON "event_entries" ("tracked_event_id","entry_type");--> statement-breakpoint
ALTER TABLE "commentary" ADD CONSTRAINT "commentary_tracked_event_id_tracked_events_id_fkey" FOREIGN KEY ("tracked_event_id") REFERENCES "tracked_events"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "event_entries" ADD CONSTRAINT "event_entries_tracked_event_id_tracked_events_id_fkey" FOREIGN KEY ("tracked_event_id") REFERENCES "tracked_events"("id") ON DELETE CASCADE;