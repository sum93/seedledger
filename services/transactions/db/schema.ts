import { dbSchema } from "contracts";

// Each table needs to be exported individually for Drizzle to pick them up
// Not good, not terrible. Consider another approach.
export const transactionSchema = dbSchema.transactionSchema;
