import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import { pool } from '../db';
import * as groupExpenseSchema from '../schema/groupExpense';

export class ExpenseService {
  get db() {
    return drizzle(pool, { schema: groupExpenseSchema });
  }

  async all() {
    return this.db.query.groupExpenses.findMany();
  }

  async find(expenseId: number) {
    return this.db.query.groupExpenses.findFirst({
      where: (expense, { eq }) => eq(expense.id, expenseId),
    });
  }

  async create(data: groupExpenseSchema.NewExpense) {
    const expenses = this.db.insert(groupExpenseSchema.groupExpenses).values(data).returning();

    return expenses;
  }

  async update(expenseId: number, data: groupExpenseSchema.Expense) {
    return this.db.update(groupExpenseSchema.groupExpenses).set(data).where(eq(groupExpenseSchema.groupExpenses.id, expenseId)).returning();
  }

  async delete(expenseId: number) {
    return this.db.delete(groupExpenseSchema.groupExpenses).where(eq(groupExpenseSchema.groupExpenses.id, expenseId)).returning();
  }
}
