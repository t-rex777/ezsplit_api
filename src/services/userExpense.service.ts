import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import { pool } from '../db';
import * as userExpenseSchema from '../schema/userExpense';

export class ExpenseService {
  get db() {
    return drizzle(pool, { schema: userExpenseSchema });
  }

  async all() {
    return this.db.query.userExpenses.findMany();
  }

  async find(expenseId: number) {
    return this.db.query.userExpenses.findFirst({
      where: (expense, { eq }) => eq(expense.id, expenseId),
    });
  }

  async create(data: userExpenseSchema.NewUserExpense) {
    const expenses = this.db.insert(userExpenseSchema.userExpenses).values(data).returning();

    return expenses;
  }

  async update(expenseId: number, data: userExpenseSchema.UserExpense) {
    return this.db.update(userExpenseSchema.userExpenses).set(data).where(eq(userExpenseSchema.userExpenses.id, expenseId)).returning();
  }

  async delete(expenseId: number) {
    return this.db.delete(userExpenseSchema.userExpenses).where(eq(userExpenseSchema.userExpenses.id, expenseId)).returning();
  }
}
