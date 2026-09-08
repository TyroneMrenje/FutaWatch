import {
  pgTable, bigserial, bigint,varchar,text,
  boolean,
  jsonb,
  timestamp,
  index,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const trackedEvents = pgTable('tracked_events', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),

  title: varchar('title', { length: 255 }).notNull(), //match, fight , ufc

  status: varchar('status', { length: 20 }).notNull().default('scheduled'),

  startsAt: timestamp('starts_at', { withTimezone: true }),

  endedAt: timestamp('ended_at', { withTimezone: true }),

  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const eventEntries = pgTable(
  'event_entries',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),

    trackedEventId: bigint('tracked_event_id', { mode: 'number' })
      .notNull()
      .references(() => trackedEvents.id, { onDelete: 'cascade' }),

    entryType: varchar('entry_type', { length: 50 }).notNull(), //'goal', 'score_update', 'note', etc.

    payload: jsonb('payload').notNull().default(sql`'{}'::jsonb`),

    occurredAt: timestamp('occurred_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    eventTimeIdx: index('idx_entries_event_time').on(
      table.trackedEventId,
      table.occurredAt.desc()
    ),
    typeIdx: index('idx_entries_type').on(table.trackedEventId, table.entryType),
  })
);

export const commentary = pgTable(
  'commentary',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    trackedEventId: bigint('tracked_event_id', { mode: 'number' })
      .notNull()
      .references(() => trackedEvents.id, { onDelete: 'cascade' }),
      
    displayName: varchar('display_name', { length: 50 })
      .notNull()
      .default('Anonymous'),

    body: text('body').notNull(),
    
    flagged: boolean('flagged').notNull().default(false),

    ipHash: varchar('ip_hash', { length: 64 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    eventTimeIdx: index('idx_commentary_event_time').on(
      table.trackedEventId,
      table.createdAt.desc()
    ),
    ipHashIdx: index('idx_commentary_ip_hash').on(
      table.ipHash,
      table.createdAt.desc()
    ),
  })
);