import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { pool } from '../db';
import * as userSchema from '../schema/user';

export class UserService {
  get db() {
    return drizzle(pool, { schema: userSchema });
  }

  async findByEmail(email: string) {
    return await this.db.query.users.findFirst({
      where: (user, { eq }) => eq(user.email, email),
    });
  }

  async findById(userId: number) {
    return await this.db.query.users.findFirst({
      where: (user, { eq }) => eq(user.id, userId),
    });
  }

  async all() {
    return await this.db.query.users.findMany();
  }

  async create(data: userSchema.NewUser) {
    const users = await this.db.insert(userSchema.users).values(data).returning();

    if (data.groupId) {
      await this.db.insert(userSchema.usersToGroups).values({
        groupId: data.groupId,
        userId: users[0].id,
      });
    }

    return users;
  }

  async update(userId: number, data: userSchema.User) {
    return await this.db.update(userSchema.users).set(data).where(eq(userSchema.users.id, userId)).returning();
  }

  async delete(userId: number) {
    return await this.db.delete(userSchema.users).where(eq(userSchema.users.id, userId)).returning();
  }
}
