import '../../env.helper';

import { faker } from '@faker-js/faker';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { groups, users } from '../schema';

if (!('DATABASE_URL' in process.env)) throw new Error('DATABASE_URL not found on .env.development');

const main = async () => {
  const client = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const db = drizzle(client);
  const data1: (typeof users.$inferInsert)[] = [];
  const data2: (typeof groups.$inferInsert)[] = [];

  for (let i = 0; i < 2; i++) {
    data1.push({
      name: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      dob: faker.date.birthdate().toDateString(),
      currency: 'INR',
      image: faker.image.avatar(),
    });
  }

  for (let i = 0; i < 1; i++) {
    data2.push({
      name: faker.internet.userName(),
      image: faker.image.avatar(),
    });
  }

  // console.log('Seed start', data1[0].id, data2[0].id);
  // !for deleting db data
  // await db.delete(usersToGroups);
  // await db.delete(groupExpenses);
  // await db.delete(expensesToGroupUsers);
  // await db.delete(expensesToUsers);
  // await db.delete(users);
  // await db.delete(groups);

  // await db.insert(groups).values(data2);
  // await db.insert(users).values(data1);
  // await db.insert(usersToGroups).values({
  //   groupId: data2[0].id,
  //   userId: data1[0].id,
  // });

  // eslint-disable-next-line no-console
  console.log('Seed done');
};

main();
