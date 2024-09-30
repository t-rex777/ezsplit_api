import '../../env.helper';

import { Pool } from 'pg';
const db = process.env.DATABASE_URL;

// eslint-disable-next-line no-console
console.info('Accessing database at: ' + db);

export const pool = new Pool({
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
    console.error('Error connecting to the database:', err);
    console.error('Error details:', err.message, err.code, err.name);
  });

//! DROP QUERY
//DROP TABLE categories,expenses_to_group_users,expenses_to_users,group_expenses,groups,users,user_expenses,users_to_groups
