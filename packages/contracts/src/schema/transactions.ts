import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const transactionSchema = sqliteTable("transactions", {
  id: text({ mode: "text" })
    .$defaultFn(() => crypto.randomUUID())
    .primaryKey()
    .notNull(),
  type: text({ mode: "text" }).notNull(),
  amount: integer().notNull(),
  date: integer({ mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  description: text({ mode: "text" }),
  category: text({ mode: "text" }),
});
