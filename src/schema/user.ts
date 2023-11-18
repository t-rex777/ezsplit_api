import { pgTable, serial, text } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name'),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
