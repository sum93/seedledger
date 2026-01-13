import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import z from "zod";

import * as schema from "../schema/transactions.js";

const typeSchema = z.enum(["inflow", "outflow"]);
const getOptionalTypeSchema = () => typeSchema.optional();
const getAmountSchema = (schema: z.ZodNumber) => schema.gte(0);
const getOptionalAmountSchema = (schema: z.ZodNumber) =>
  getAmountSchema(schema).optional();
const getOptionalDateSchema = (schema: z.ZodDate) => schema.optional();

export const transactionSelectSchema = createSelectSchema(
  schema.transactionSchema,
  {
    type: typeSchema,
  },
);

export const transactionInsertSchema = createInsertSchema(
  schema.transactionSchema,
  {
    type: typeSchema,
    amount: getAmountSchema,
    date: getOptionalDateSchema,
  },
);

export const transactionUpdateSchema = createUpdateSchema(
  schema.transactionSchema,
  {
    // id: z.uuid(), // There's a bug and drizzle seed returns invalid uuid
    id: z.string(),
    type: getOptionalTypeSchema,
    amount: getOptionalAmountSchema,
    date: getOptionalDateSchema,
  },
);
