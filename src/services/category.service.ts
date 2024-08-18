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
      where: (category, { eq }) => eq(category.userId, this.userId),
    });
  }

  async find(categoryId: number) {
    return this.db.query.categories.findFirst({
      where: (category, { eq }) => eq(category.userId, this.userId) && eq(category.id, categoryId),
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
