import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import Fuse from 'fuse.js';
import { pool } from '../db';
import * as categorySchema from '../schema/category';
import * as groupSchema from '../schema/group';
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
    return drizzle(pool, { schema: { ...userExpenseSchema, ...userSchema, ...categorySchema, ...groupSchema }, logger: true });
  }

  /**
   *
   * @returns number of expenses for with an user
   */
  async total() {
    const schema = userExpenseSchema.expensesToUsers;

    return (await this.db.select().from(schema).where(eq(schema.userId, this.userId)).execute()).length;
  }

  async all() {
    const commonExpense = await this.db.query.expensesToUsers.findMany({
      where: (expense, { eq }) => eq(expense.userId, this.userId),
    });

    return await this.db.query.expensesToUsers.findMany({
      orderBy: (expense, { asc }) => asc(expense.expenseId),

      where: (expense, { inArray }) =>
        inArray(
          expense.expenseId,
          commonExpense.map((d) => d.expenseId),
        ),
      columns: {
        expenseId: false,
        userId: false,
      },
      with: {
        user: {
          columns: { password: false },
        },
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
      where: (expensesToUsers, { eq, and, ne }) => and(eq(expensesToUsers.expenseId, expenseId), ne(expensesToUsers.userId, this.userId)),
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

  async getExpenseIdFromSearchTerm(term: string) {
    const schema = userExpenseSchema.userExpenses;
    const expenses = await this.db.select({ name: schema.name, id: schema.id }).from(schema).execute();

    const fuse = new Fuse(expenses, {
      keys: ['name'],
    });

    return fuse.search(term).map((d) => d.item.id);
  }

  /**
   * 1. get all user expenses
   * 2. filter them where that expense is shared by current user
   */
  async findByFriendId(friendId: number, term = '', page = 1, pageSize = 10) {
    const searchedIds = await this.getExpenseIdFromSearchTerm(term);

    return this.db.query.expensesToUsers.findMany({
      limit: pageSize,
      offset: (page - 1) * pageSize,

      where: (expensesToUsers, { eq, or, and, inArray }) =>
        // can't pass [] to inArray
        searchedIds.length === 0
          ? or(eq(expensesToUsers.userId, friendId), eq(expensesToUsers.userId, this.userId))
          : and(or(eq(expensesToUsers.userId, friendId), eq(expensesToUsers.userId, this.userId)), inArray(expensesToUsers.expenseId, searchedIds)),
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
