import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

import * as schema from "../schema/transactions.js";

export const transactionSelectSchema = createSelectSchema(
  schema.transactionSchema,
);
export const transactionInsertSchema = createInsertSchema(
  schema.transactionSchema,
);
export const transactionUpdateSchema = createUpdateSchema(
  schema.transactionSchema,
);
