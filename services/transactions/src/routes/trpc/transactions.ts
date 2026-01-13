import { initTRPC } from "@trpc/server";
import {
  fastifyTRPCPlugin,
  type FastifyTRPCPluginOptions,
} from "@trpc/server/adapters/fastify";
import { eq } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import * as z from "zod";

import { dbSchema, validationSchema } from "contracts";

export default fp(async function (fastify) {
  fastify.register(fastifyTRPCPlugin, {
    prefix: "/trpc",
    trpcOptions: {
      router: createTransactionsRouter(fastify.db),
      onError({ path, error }) {
        // report to error monitoring
        console.error(`Error in tRPC handler on path '${path}':`, error);
      },
    } satisfies FastifyTRPCPluginOptions<TransactionsRouter>["trpcOptions"],
  });
});

const t = initTRPC.create();
const createTransactionsRouter = (db: FastifyInstance["db"]) =>
  t.router({
    getTransactions: t.procedure
      .output(validationSchema.transactionSelectSchema.array())
      .query(() => {
        const rows = db.select().from(dbSchema.transactionSchema).all();
        return rows as z.infer<
          typeof validationSchema.transactionSelectSchema
        >[];
      }),

    getTransaction: t.procedure
      // .input(z.object({ id: z.uuid() })) // There's a bug and drizzle seed returns invalid uuid
      .input(z.object({ id: z.string() }))
      .output(validationSchema.transactionSelectSchema.nullable())
      .query((opts) => {
        const row = db
          .select()
          .from(dbSchema.transactionSchema)
          .where(eq(dbSchema.transactionSchema.id, opts.input.id))
          .get();

        return row as z.infer<
          typeof validationSchema.transactionSelectSchema
        > | null;
      }),

    addTransaction: t.procedure
      .input(validationSchema.transactionInsertSchema)
      .mutation((opts) => {
        const result = db
          .insert(dbSchema.transactionSchema)
          .values(opts.input)
          .returning()
          .get();

        return result;
      }),

    updateTransaction: t.procedure
      .input(validationSchema.transactionUpdateSchema)
      .mutation((opts) => {
        const result = db
          .update(dbSchema.transactionSchema)
          .set(opts.input)
          .where(eq(dbSchema.transactionSchema.id, opts.input.id))
          .returning()
          .get();

        return result;
      }),

    deleteTransaction: t.procedure
      // .input(z.object({ id: z.uuid() })) // There's a bug and drizzle seed returns invalid uuid
      .input(z.object({ id: z.string() }))
      .mutation((opts) => {
        const result = db
          .delete(dbSchema.transactionSchema)
          .where(eq(dbSchema.transactionSchema.id, opts.input.id))
          .returning()
          .get();

        return result;
      }),
  });

export type TransactionsRouter = ReturnType<typeof createTransactionsRouter>;
