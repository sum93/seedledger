import 'dotenv/config';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { reset, seed } from 'drizzle-seed';

import { dbSchema } from 'contracts';

export async function seedDb() {
  if (process.env.TRANSACTIONS_DB_FILE == undefined) {
    throw new Error('TRANSACTIONS_DB_FILE is not set in the environment');
  }

  const db = drizzle(process.env.TRANSACTIONS_DB_FILE);
  await reset(db, dbSchema);
  await seed(db, dbSchema, { count: 100, seed: 42 }).refine(f => ({
    transactionSchema: {
      columns: {
        id: f.uuid(),
        amount: f.int({ minValue: 500, maxValue: 50000 }),
        type: f.valuesFromArray({ values: ['credit', 'debit']}),
      },
    }
  }));
  console.log('Database seeding complete!');
}

export async function resetDb() {
  if (process.env.TRANSACTIONS_DB_FILE == undefined) {
    throw new Error('TRANSACTIONS_DB_FILE is not set in the environment');
  }

  const db = drizzle(process.env.TRANSACTIONS_DB_FILE);
  await reset(db, dbSchema);
  console.log('Database reset complete!');
}
