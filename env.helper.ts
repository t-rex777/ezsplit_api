import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  const env = dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
  if (env.error) {
    console.error(env.parsed);

    throw env.error;
  }
}

import 'dotenv/config';

// eslint-disable-next-line no-console
console.log(process.env.DATABASE_USER + ' connected successfully!');
