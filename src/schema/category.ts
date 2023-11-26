import { relations } from 'drizzle-orm';
import { integer, pgEnum, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { users } from './user';

const CATEGORIES_ENUM = pgEnum('name', ['grocery', 'rent', 'dining_out', 'clothing', 'misc']);

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: CATEGORIES_ENUM('name').default('grocery').notNull(),
  image: text('image'),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

/**
 * defined relation for category with user
 */
export const categoryRelations = relations(categories, ({ one }) => ({
  userId: one(users, {
    fields: [categories.userId],
    references: [users.id],
  }),
}));

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
