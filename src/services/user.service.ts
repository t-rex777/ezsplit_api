import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import { pool } from '../db';
import * as userSchema from '../schema/user';

export class UserService {
  get db() {
    return drizzle(pool, { schema: userSchema });
  }

  async getUserByEmail(email: string) {
    return await this.db.query.users.findFirst({
      where: (user, { eq }) => eq(user.email, email),
    });
  }

  async getAllUsers() {
    return await this.db.query.users.findMany();
  }

  async insertUser(data: userSchema.NewUser) {
    return await this.db.insert(userSchema.users).values(data).returning();
  }

  async updateUser(userId: number, data: userSchema.User) {
    return await this.db.update(userSchema.users).set(data).where(eq(userSchema.users.id, userId)).returning();
  }

  async deleteUser(email: string) {
    return await this.db.delete(userSchema.users).where(eq(userSchema.users.email, email)).returning({
      deletedId: userSchema.users.email,
    });
  }
}
