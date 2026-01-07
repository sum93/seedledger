import Database from 'better-sqlite3';
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import fp from 'fastify-plugin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { dbSchema } from 'contracts';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export interface DbPluginOptions {}

export default fp<DbPluginOptions>(async (fastify, _opts) => {
  const dbFileEnv = process.env.TRANSACTIONS_DB_FILE;

  const transactionDb = dbFileEnv
    ? path.isAbsolute(dbFileEnv)
      ? dbFileEnv
      : path.join(__dirname, '..', '..', dbFileEnv)
    : path.join(__dirname, '..', '..', 'db', 'transactions.db');

  const transactionDbDir = path.dirname(transactionDb);

  if (!fs.existsSync(transactionDbDir)) {
    fs.mkdirSync(transactionDbDir, { recursive: true });
  }

  const sqlite = new Database(transactionDb);
  const db = drizzle({ client: sqlite, schema: dbSchema });

  fastify.decorate('db', db);
  fastify.addHook('onClose', async () => {
    sqlite.close();
  });
});

declare module 'fastify' {
  export interface FastifyInstance {
    db: BetterSQLite3Database<typeof dbSchema>;
  }
};
