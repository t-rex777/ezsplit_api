import dotenv from 'dotenv';
const env = dotenv.config({ path: process.env.NODE_ENV === 'production' ? '.env' : '.env.development' });

if (env.error) {
  console.error(env.parsed);

  throw env.error;
}

// eslint-disable-next-line no-console
console.log(process.env.DATABASE_USER + ' connected successfully!');

import 'dotenv/config';
