import { relations } from 'drizzle-orm';
import { boolean, integer, numeric, pgTable, primaryKey, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { categories } from './category';
import { users } from './user';

export const userExpenses = pgTable('user_expenses', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  categoryId: integer('category_id')
    .notNull()
    .references(() => categories.id),
  description: text('description'),
  currency: text('currency'),
  totalAmount: numeric('total_amount', { precision: 7, scale: 3 }).notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  modifiedAt: timestamp('modified_at').notNull().defaultNow(),
});

/**
 * user and expense will make many to many relation
 * one user can have multiple expenses
 */
export const expenseRelations = relations(userExpenses, ({ many, one }) => ({
  expenseToUsers: many(users),
  category: one(categories, {
    fields: [userExpenses.categoryId],
    references: [categories.id],
  }),
}));

export const userRelations = relations(users, ({ many }) => ({
  expenseToUsers: many(userExpenses),
}));

/**
 * join table for for friend expense and users relationships
 * if amount is negative then he is lender
 * else borrower
 */
export const expensesToUsers = pgTable(
  'expenses_to_users',
  {
    userId: integer('user_id')
      .notNull()
      .references(() => users.id),
    expenseId: integer('expense_id')
      .notNull()
      .references(() => userExpenses.id),
    amount: numeric('amount', { precision: 7, scale: 3 }).notNull(),
    isLender: boolean('is_lender').notNull(),
  },
  (t) => ({ pk: primaryKey({ columns: [t.userId, t.amount, t.expenseId] }) }),
);

export const expenseToUserRelations = relations(expensesToUsers, ({ one }) => ({
  expense: one(userExpenses, {
    fields: [expensesToUsers.expenseId],
    references: [userExpenses.id],
  }),

  user: one(users, {
    fields: [expensesToUsers.userId],
    references: [users.id],
  }),
}));

export type UserExpense = typeof userExpenses.$inferSelect;
export type NewExpense = typeof userExpenses.$inferInsert;
