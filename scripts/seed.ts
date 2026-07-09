import { db } from '../src/db/index.js';
import * as schema from '../src/db/schema.js';
import bcrypt from 'bcryptjs';

async function seed() {
  const hashedPassword = await bcrypt.hash('password', 10);
  
  await db.insert(schema.users).values({
    id: 'test-user-id',
    name: 'Demo User',
    email: 'demo@investoriq.ai',
    password: hashedPassword,
  }).onConflictDoNothing();
  
  console.log('Test user created.');
}

seed().catch(console.error);
