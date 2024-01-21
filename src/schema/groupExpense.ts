import { relations } from 'drizzle-orm';
import { boolean, integer, numeric, pgTable, primaryKey, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { categories } from './category';
import { groups } from './group';
import { users } from './user';

export const groupExpenses = pgTable('group_expenses', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  categoryId: integer('category_id')
    .notNull()
    .references(() => categories.id),
  groupId: integer('group_id')
    .notNull()
    .references(() => groups.id),
  description: text('description'),
  currency: text('currency'),
  totalAmount: numeric('total_amount', { precision: 7, scale: 3 }).notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  modifiedAt: timestamp('modified_at').notNull().defaultNow(),
});

/**
 * relations for expense relations
 */
export const expenseToGroupsRelations = relations(groupExpenses, ({ one, many }) => ({
  expenseToGroups: many(groups),
  category: one(categories, {
    fields: [groupExpenses.categoryId],
    references: [categories.id],
  }),
}));

export const groupUserToExpensesRelations = relations(groups, ({ many }) => ({
  expenseToGroups: many(groupExpenses),
}));

/**
 * join table for for friend expense and group relationships
 * if amount is negative then he is lender
 * else borrower
 */
export const expensesToGroupUsers = pgTable(
  'expenses_to_group_users',
  {
    userId: integer('user_id')
      .notNull()
      .references(() => users.id),
    expenseId: integer('expense_id')
      .notNull()
      .references(() => groupExpenses.id),
    amount: numeric('amount', { precision: 7, scale: 3 }).notNull(),
    isLender: boolean('is_lender').notNull(),
  },
  (t) => ({ pk: primaryKey({ columns: [t.userId, t.amount, t.expenseId] }) }),
);

export const expenseToGroupUserRelations = relations(expensesToGroupUsers, ({ one }) => ({
  expense: one(groupExpenses, {
    fields: [expensesToGroupUsers.expenseId],
    references: [groupExpenses.id],
  }),

  user: one(users, {
    fields: [expensesToGroupUsers.userId],
    references: [users.id],
  }),
}));

export type GroupExpense = typeof groupExpenses.$inferSelect;
export type NewGroupExpense = typeof groupExpenses.$inferInsert;
