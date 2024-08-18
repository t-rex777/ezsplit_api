import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import { pool } from '../db';
import * as categorySchema from '../schema/category';
import * as groupExpenseSchema from '../schema/groupExpense';
import * as userSchema from '../schema/userExpense';

interface ICreateGroupExpense extends groupExpenseSchema.NewGroupExpense {
  expenses: Array<{ user_id: number; amount: string; is_lender: boolean }>;
}

export class GroupExpenseService {
  userId: number;

  constructor(userId: number) {
    this.userId = userId;
  }

  get db() {
    return drizzle(pool, { schema: { ...groupExpenseSchema, ...userSchema, ...categorySchema } });
  }

  async all() {
    return this.db.query.expensesToGroupUsers.findMany({
      where: (expensesToGroupUsers, { eq }) => eq(expensesToGroupUsers.userId, this.userId),
      columns: {
        expenseId: false,
        userId: false,
      },
      with: {
        user: { columns: { password: false } },
        expense: {
          columns: {
            categoryId: false,
          },
          with: {
            category: { columns: { userId: false } },
          },
        },
      },
    });
  }

  async find(expenseId: number) {
    return this.db.query.expensesToGroupUsers.findFirst({
      where: (expensesToGroupUsers, { eq }) => eq(expensesToGroupUsers.userId, this.userId) && eq(expensesToGroupUsers.expenseId, expenseId),
      columns: {
        expenseId: false,
        userId: false,
      },
      with: {
        user: { columns: { password: false } },
        expense: {
          columns: {
            categoryId: false,
          },
          with: {
            category: { columns: { userId: false } },
          },
        },
      },
    });
  }

  async create({ expenses, ...data }: ICreateGroupExpense) {
    const response = await this.db.insert(groupExpenseSchema.groupExpenses).values(data).returning();

    const expensesToGroupUsersData = expenses.map((expense) => ({
      amount: expense.amount,
      expenseId: response[0].id,
      isLender: expense.is_lender,
      userId: expense.user_id,
    }));

    await this.db.insert(groupExpenseSchema.expensesToGroupUsers).values(expensesToGroupUsersData).returning();

    return response;
  }

  async update(expenseId: number, data: groupExpenseSchema.GroupExpense) {
    return this.db.update(groupExpenseSchema.groupExpenses).set(data).where(eq(groupExpenseSchema.groupExpenses.id, expenseId)).returning();
  }

  async delete(expenseId: number) {
    return this.db.delete(groupExpenseSchema.groupExpenses).where(eq(groupExpenseSchema.groupExpenses.id, expenseId)).returning();
  }
}
