import '../../env.helper';

import { Client } from 'pg';

export const pool = new Client({
  connectionString: process.env.DATABASE_URL,
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
