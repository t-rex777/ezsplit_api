import { relations } from 'drizzle-orm';
import { boolean, integer, numeric, pgTable, primaryKey, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { categories } from './category';
import { groups } from './group';
import { users } from './user';

export const groupExpenses = pgTable('expenses', {
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
export const expenseRelations = relations(groupExpenses, ({ one, many }) => ({
  expenseToGroups: many(groups),
  category: one(categories, {
    fields: [groupExpenses.categoryId],
    references: [categories.id],
  }),
}));

export const userRelations = relations(groups, ({ many }) => ({
  expenseToGroups: many(groupExpenses),
}));

/**
 * join table for for friend expense and group relationships
 * if amount is negative then he is lender
 * else borrower
 */
export const expensesToUsers = pgTable(
  'expenses_to_group_users',
  {
    userId: integer('user_id')
      .notNull()
      .references(() => groups.id),
    expenseId: integer('expense_id')
      .notNull()
      .references(() => groupExpenses.id),
    amount: numeric('amount', { precision: 7, scale: 3 }).notNull(),
    isLender: boolean('is_lender').notNull(),
  },
  (t) => ({ pk: primaryKey({ columns: [t.userId, t.amount, t.expenseId] }) }),
);

export const expenseToUserRelations = relations(expensesToUsers, ({ one }) => ({
  expense: one(groupExpenses, {
    fields: [expensesToUsers.expenseId],
    references: [groupExpenses.id],
  }),

  user: one(users, {
    fields: [expensesToUsers.userId],
    references: [users.id],
  }),
}));

export type Expense = typeof groupExpenses.$inferSelect;
export type NewExpense = typeof groupExpenses.$inferInsert;
