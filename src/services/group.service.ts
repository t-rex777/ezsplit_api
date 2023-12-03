import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import { pool } from '../db';
import * as groupSchema from '../schema/group';
import * as userSchema from '../schema/user';

export class GroupService {
  get db() {
    return drizzle(pool, { schema: groupSchema });
  }

  async all() {
    return await this.db.query.groups.findMany();
  }

  async find(groupId: number) {
    return await this.db.query.groups.findFirst({
      where: (group, { eq }) => eq(group.id, groupId),
    });
  }

  async addUsers(groupId: number, userIds: number[]) {
    const userGroupAssociations = new Array(userIds.length).fill('').map((_, i) => ({ userId: userIds[i], groupId }));

    return await this.db.insert(userSchema.usersOnGroups).values(userGroupAssociations).execute();
  }

  async create(data: groupSchema.NewGroup) {
    return await this.db.insert(groupSchema.groups).values(data).returning();
  }

  async update(groupId: number, data: groupSchema.Group) {
    return await this.db.update(groupSchema.groups).set(data).where(eq(groupSchema.groups.id, groupId)).returning();
  }

  async delete(groupId: number) {
    return await this.db.delete(groupSchema.groups).where(eq(groupSchema.groups.id, groupId)).returning({
      deletedId: groupSchema.groups.id,
    });
  }
}
