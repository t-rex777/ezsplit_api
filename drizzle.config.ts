import 'dotenv/config';
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/schema/**/*.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    host: 'localhost',
    port: Number(process.env.DATABASE_PORT),
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  },
} satisfies Config;
