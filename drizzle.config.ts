import './env.helper';

import type { Config } from 'drizzle-kit';

// eslint-disable-next-line no-console
console.log('database url:' + process.env.DATABASE_URL);

export default {
  schema: './src/schema/**/*.ts',
  out: './drizzle',
  // driver: 'pg',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
    ssl: false,
  },
} satisfies Config;
