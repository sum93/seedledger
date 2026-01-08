import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import * as path from "path";

const dbFileEnv = process.env.TRANSACTIONS_DB_FILE;

if (!dbFileEnv) {
  throw new Error("TRANSACTIONS_DB_FILE is not set in the environment");
}

const dbFile = path.isAbsolute(dbFileEnv)
  ? dbFileEnv
  : path.join(process.cwd(), dbFileEnv);

export default defineConfig({
  out: "./drizzle",
  schema: "./db/schema.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: dbFile,
  },
});
