import "dotenv/config";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { reset, seed } from "drizzle-seed";

import { dbSchema } from "contracts";

const ROW_COUNT_DEV = 100;
const ROW_COUNT_TEST = 10;

export async function seedDb() {
  const { dbFile, isTestEnv } = getDbEnv();
  const db = drizzle(dbFile);
  await reset(db, dbSchema);
  await seed(db, dbSchema, {
    count: isTestEnv ? ROW_COUNT_TEST : ROW_COUNT_DEV,
    seed: 42,
  }).refine((f) => ({
    transactionSchema: {
      columns: {
        id: f.uuid(),
        amount: f.int({ minValue: 500, maxValue: 50000 }),
        type: f.valuesFromArray({ values: ["inflow", "outflow"] }),
        date: f.date({ minDate: new Date(2020, 0, 1), maxDate: new Date() }),
        description: f.loremIpsum(),
        category: f.valuesFromArray({
          values: [
            "groceries",
            "utilities",
            "entertainment",
            "transportation",
            "healthcare",
            "education",
            "dining",
          ],
        }),
      },
    },
  }));

  if (!isTestEnv) {
    console.log("Database seeding complete!");
  }
}

export async function resetDb() {
  const { dbFile } = getDbEnv();
  const db = drizzle(dbFile);
  await reset(db, dbSchema);
  console.log("Database reset complete!");
}

export const getDbEnv = () => {
  let isTestEnv = false;
  if (typeof process !== "undefined" && !!process.env?.VITEST) {
    isTestEnv = true;
  }

  let dbFile: string;
  if (isTestEnv) {
    if (process.env.TRANSACTIONS_TEST_DB_FILE == undefined) {
      throw new Error(
        "TRANSACTIONS_TEST_DB_FILE is not set in the environment",
      );
    }
    dbFile = process.env.TRANSACTIONS_TEST_DB_FILE;
  } else {
    if (process.env.TRANSACTIONS_DB_FILE == undefined) {
      throw new Error("TRANSACTIONS_DB_FILE is not set in the environment");
    }
    dbFile = process.env.TRANSACTIONS_DB_FILE;
  }

  return { dbFile, isTestEnv };
};
