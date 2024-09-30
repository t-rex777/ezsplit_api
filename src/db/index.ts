import '../../env.helper';

import { Client } from 'pg';
const db = process.env.DATABASE_URL || 'postgres://postgres:spacex@localhost:5433/ezsplit';
console.log(db + ' connected!', ' env ', process.env.DATABASE_URL);

export const pool = new Client({
  connectionString: db,
  ssl: false,
});

pool
  .connect()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('Database Connected successfully!');
  })
  .catch((err) => {
    console.error(err);
  });

//! DROP QUERY
//DROP TABLE categories,expenses_to_group_users,expenses_to_users,group_expenses,groups,users,user_expenses,users_to_groups
