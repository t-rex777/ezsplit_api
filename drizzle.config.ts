import dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

import 'dotenv/config';
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/schema/**/*.ts',
  out: './drizzle',
  // driver: 'pg',
  dialect: 'postgresql',
  dbCredentials: {
    host: 'localhost',
    ssl: {
      rejectUnauthorized: process.env.NODE_ENV === 'production',
    },
    port: Number(process.env.DATABASE_PORT),
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  },
} satisfies Config;
