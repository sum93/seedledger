import { initTRPC } from "@trpc/server";
import {
  fastifyTRPCPlugin,
  FastifyTRPCPluginOptions,
} from "@trpc/server/adapters/fastify";
import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

import { validationSchema, dbSchema } from "contracts";

export default fp(async function (fastify: FastifyInstance) {
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
