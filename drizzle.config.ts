import type { Config } from 'drizzle-kit';

export default {
  schema: './src/schema/**/*.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'spacex',
    database: 'ezsplit',
  },
} satisfies Config;
