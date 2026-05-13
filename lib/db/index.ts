import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

// Connection pool
const client = postgres(process.env.DATABASE_URL);

// Drizzle instance
export const db = drizzle(client, { schema });

export { schema };
