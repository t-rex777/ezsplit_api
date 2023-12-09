import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import { pool } from '../db';
import * as expenseSchema from '../schema/expense';

export class ExpenseService {
  get db() {
    return drizzle(pool, { schema: expenseSchema });
  }

  async all() {
    return this.db.query.expenses.findMany();
  }

  async find(expenseId: number) {
    return this.db.query.expenses.findFirst({
      where: (expense, { eq }) => eq(expense.id, expenseId),
    });
  }

  async create(data: expenseSchema.NewExpense) {
    return this.db.insert(expenseSchema.expenses).values(data).returning();
  }

  async update(expenseId: number, data: expenseSchema.Expense) {
    return this.db.update(expenseSchema.expenses).set(data).where(eq(expenseSchema.expenses.id, expenseId)).returning();
  }

  async delete(expenseId: number) {
    return this.db.delete(expenseSchema.expenses).where(eq(expenseSchema.expenses.id, expenseId)).returning();
  }
}
