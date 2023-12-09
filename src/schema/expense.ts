import { relations } from 'drizzle-orm';
import { integer, numeric, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { categories } from './category';
import { users } from './user';

export const expenses = pgTable('expenses', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  categoryId: integer('category_id')
    .notNull()
    .references(() => categories.id),
  description: text('description'),
  currency: text('currency'),
  lender: integer('lender').references(() => users.id),
  borrower: integer('borrower').references(() => users.id),
  amount: numeric('amount', { precision: 7, scale: 3 }).notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  modifiedAt: timestamp('modified_at').notNull().defaultNow(),
});

/**
 * relations for expense relations
 */
export const expenseRelations = relations(expenses, ({ one }) => ({
  category: one(categories, {
    fields: [expenses.categoryId],
    references: [categories.id],
  }),
  lender: one(users, {
    fields: [expenses.lender],
    references: [users.id],
  }),
  borrower: one(users, {
    fields: [expenses.borrower],
    references: [users.id],
  }),
  modifiedBy: one(users, {
    fields: [expenses.modifiedAt],
    references: [users.id],
  }),
}));

export type Expense = typeof expenses.$inferSelect;
export type NewExpense = typeof expenses.$inferInsert;
