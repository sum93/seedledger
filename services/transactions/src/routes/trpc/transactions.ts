import { initTRPC } from "@trpc/server";
import {
  fastifyTRPCPlugin,
  type FastifyTRPCPluginOptions,
} from "@trpc/server/adapters/fastify";
import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

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
    getTransactions: t.procedure.query(() => {
      return db.select().from(dbSchema.transactionSchema);
    }),
    addTransaction: t.procedure
      .input(validationSchema.transactionInsertSchema)
      .mutation((opts) => {
        console.log(opts.input.amount, opts.input.type);
      }),
  });

export type TransactionsRouter = ReturnType<typeof createTransactionsRouter>;
