import { relations } from 'drizzle-orm';
import { integer, pgTable, primaryKey, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { groups } from './group';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').unique().notNull(),
  password: text('password').notNull(),
  dob: text('dob'),
  image: text('image'),
  currency: text('currency').default('INR'),
  groupId: integer('group_id')
    .references(() => groups.id)
    .default(null),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

/**
 * join table for many-to-many relationships
 * between users and groups
 **/
export const usersToGroups = pgTable(
  'users_to_groups',
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
export const userRelations = relations(users, ({ many }) => ({
  usersToGroups: many(usersToGroups),
}));

/**
 * defined relation for groups
 */
export const groupRelations = relations(groups, ({ many }) => ({
  usersToGroups: many(usersToGroups),
}));

export const usersToGroupsRelations = relations(usersToGroups, ({ one }) => ({
  group: one(groups, {
    fields: [usersToGroups.groupId],
    references: [groups.id],
  }),

  user: one(users, {
    fields: [usersToGroups.userId],
    references: [users.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
