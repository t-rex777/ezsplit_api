import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import { pool } from '../db';
import * as categorySchema from '../schema/category';

export class CategoryService {
  userId: number;

  constructor(userId: number) {
    this.userId = userId;
  }

  get db() {
    return drizzle(pool, { schema: categorySchema });
  }

  async all() {
    return this.db.query.categories.findMany({
      where: (expense, { eq }) => eq(expense.userId, this.userId),
    });
  }

  async find(expenseId: number) {
    return this.db.query.categories.findFirst({
      where: (expense, { eq }) => eq(expense.id, expenseId),
    });
  }

  async create(data: categorySchema.NewCategory) {
    return this.db.insert(categorySchema.categories).values(data).returning();
  }

  async update(expenseId: number, data: categorySchema.NewCategory) {
    return this.db.update(categorySchema.categories).set(data).where(eq(categorySchema.categories.id, expenseId)).returning();
  }

  async delete(expenseId: number) {
    return this.db.delete(categorySchema.categories).where(eq(categorySchema.categories.id, expenseId)).returning();
  }
}
