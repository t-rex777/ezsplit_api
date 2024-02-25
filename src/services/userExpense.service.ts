import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import { pool } from '../db';
import * as categorySchema from '../schema/category';
import * as userSchema from '../schema/user';
import * as userExpenseSchema from '../schema/userExpense';

interface ICreateUserExpense extends userExpenseSchema.NewUserExpense {
  expenses: Array<{ user_id: number; amount: string; is_lender: boolean }>;
}

export class UserExpenseService {
  userId: number;

  constructor(userId: number) {
    this.userId = userId;
  }

  get db() {
    return drizzle(pool, { schema: { ...userExpenseSchema, ...userSchema, ...categorySchema }, logger: true });
  }

  async all() {
    return this.db.query.expensesToUsers.findMany({
      where: (expense, { eq }) => eq(expense.userId, this.userId),
      columns: {
        expenseId: false,
        userId: false,
      },
      with: {
        user: { columns: { password: false } },
        expense: {
          columns: { categoryId: false },
          with: {
            category: { columns: { userId: false } },
          },
        },
      },
    });
  }

  async find(expenseId: number) {
    return this.db.query.expensesToUsers.findMany({
      where: (expensesToUsers, { eq }) => eq(expensesToUsers.expenseId, expenseId),
      columns: {
        expenseId: false,
        userId: false,
      },
      with: {
        user: { columns: { password: false } },
        expense: {
          columns: { categoryId: false },
          with: {
            category: { columns: { userId: false } },
          },
        },
      },
    });
  }

  async create({ expenses, ...data }: ICreateUserExpense) {
    const response = await this.db.insert(userExpenseSchema.userExpenses).values(data).returning();

    const expensesToUsersData = expenses.map((expense) => ({
      amount: expense.amount,
      expenseId: response[0].id,
      isLender: expense.is_lender,
      userId: expense.user_id,
    }));

    await this.db.insert(userExpenseSchema.expensesToUsers).values(expensesToUsersData).returning();

    return expenses;
  }

  async update(expenseId: number, data: userExpenseSchema.UserExpense) {
    return this.db.update(userExpenseSchema.userExpenses).set(data).where(eq(userExpenseSchema.userExpenses.id, expenseId)).returning();
  }

  async delete(expenseId: number) {
    return this.db.delete(userExpenseSchema.expensesToUsers).where(eq(userExpenseSchema.expensesToUsers.expenseId, expenseId)).returning();
  }
}
