import { relations } from 'drizzle-orm';
import { integer, pgTable, primaryKey, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { groups } from './group';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  password: text('password').notNull(),
  dob: text('dob'),
  image: text('image'),
  currency: text('currency'),
  groupId: integer('group_id').references(() => groups.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

/**
 * join table for many-to-many relationships
 * between users and groups
 **/
export const usersOnGroups = pgTable(
  'users_on_groups',
  {
    userId: integer('user_id')
      .notNull()
      .references(() => users.id),
    groupId: integer('group_id')
      .notNull()
      .references(() => groups.id),
  },
  (t) => ({ pk: primaryKey({ columns: [t.userId, t.groupId] }) }),
);

/**
 * defined relation for join table
 * here, it will be one to many relation between two of them
 * in the join table
 */
export const usersOnGroupsRelations = relations(usersOnGroups, ({ one }) => ({
  user: one(users, {
    fields: [usersOnGroups.userId],
    references: [users.id],
  }),
  group: one(groups, {
    fields: [usersOnGroups.groupId],
    references: [groups.id],
  }),
}));

/**
 * defined relation for users
 */
export const userRelations = relations(users, ({ many }) => ({
  groups: many(usersOnGroups),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
