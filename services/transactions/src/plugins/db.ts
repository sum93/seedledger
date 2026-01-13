import Database from "better-sqlite3";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import fp from "fastify-plugin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { dbSchema } from "contracts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default fp(
  async (fastify) => {
    let dbFileEnv = fastify.config.TRANSACTIONS_DB_FILE!;
    // Might be read from fastify config
    if (typeof process !== "undefined" && !!process.env?.VITEST) {
      dbFileEnv = fastify.config.TRANSACTIONS_TEST_DB_FILE!;
    }

    const transactionDb = path.join(__dirname, "..", "..", dbFileEnv);

    const transactionDbDir = path.dirname(transactionDb);

    if (!fs.existsSync(transactionDbDir)) {
      fs.mkdirSync(transactionDbDir, { recursive: true });
    }

    const sqlite = new Database(transactionDb, { fileMustExist: true });
    const db = drizzle({ client: sqlite, schema: dbSchema });

    fastify.decorate("db", db);
    fastify.addHook("onClose", async () => {
      sqlite.close();
    });
  },
  { dependencies: ["env-plugin"] },
);

declare module "fastify" {
  export interface FastifyInstance {
    db: BetterSQLite3Database<typeof dbSchema>;
  }
}
