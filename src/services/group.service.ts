import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import { pool } from '../db';
import * as schema from '../schema';

export class GroupService {
  userId: number;
  constructor(userId: number) {
    this.userId = userId;
  }

  get db() {
    return drizzle(pool, { schema });
  }

  async all() {
    return await this.db.query.usersToGroups.findMany({
      where: eq(schema.usersToGroups.userId, this.userId),
      with: {
        group: true,
      },
    });
  }

  async find(groupId: number) {
    return await this.db.query.groups.findFirst({
      where: (group, { eq }) => eq(group.id, groupId),
    });
  }

  async addUsers(groupId: number, userIds: number[]) {
    const userGroupAssociations = new Array(userIds.length).fill('').map((_, i) => ({ userId: userIds[i], groupId }));

    return await this.db.insert(schema.usersToGroups).values(userGroupAssociations).returning().execute();
  }

  async create(data: schema.NewGroup) {
    return await this.db.insert(schema.groups).values(data).returning();
  }

  async update(groupId: number, data: schema.Group) {
    return await this.db.update(schema.groups).set(data).where(eq(schema.groups.id, groupId)).returning();
  }

  async delete(groupId: number) {
    return await this.db.delete(schema.groups).where(eq(schema.groups.id, groupId)).returning();
  }
}
