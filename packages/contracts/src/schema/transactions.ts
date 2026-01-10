import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const transactionSchema = sqliteTable("transactions", {
  id: text({ mode: "text" })
    .$defaultFn(() => crypto.randomUUID())
    .primaryKey(),
  type: text({ mode: "text" }).notNull(),
  amount: integer().notNull(),
  date: integer({ mode: "timestamp" }).notNull(),
  description: text({ mode: "text" }),
  category: text({ mode: "text" }),
});
