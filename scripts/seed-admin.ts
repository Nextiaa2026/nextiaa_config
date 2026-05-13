import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { users } from '../lib/db/schema';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

const client = postgres(process.env.DATABASE_URL);
const db = drizzle(client);

async function seed() {
  console.log('Seeding admin user...');
  
  const email = 'admin@example.com';
  const password = 'admin_password_123';
  const hashedPassword = await bcrypt.hash(password, 10);

  await db.insert(users).values({
    email,
    passwordHash: hashedPassword,
    name: 'Master Admin',
    role: 'admin',
    status: 'active',
  }).onConflictDoNothing();

  console.log('Admin user seeded successfully!');
  console.log('Email:', email);
  console.log('Password:', password);
  
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
