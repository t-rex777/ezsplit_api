import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

export const pool = postgres(process.env.DATABASE_URL, { max: 1, ssl: false });

export const dbClient = (schema) => drizzle(pool, { schema });

//! DROP QUERY
//DROP TABLE categories,expenses_to_group_users,expenses_to_users,group_expenses,groups,users,user_expenses,users_to_groups
