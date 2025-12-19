
import { initTRPC } from '@trpc/server'
import { fastifyTRPCPlugin, FastifyTRPCPluginOptions } from '@trpc/server/adapters/fastify';
import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin'

import { transactionSchema } from 'contracts'

export default fp(async function (fastify: FastifyInstance, opts: any) {
  fastify.register(fastifyTRPCPlugin, {
    prefix: '/trpc',
    trpcOptions: {
      router: transactionsRouter,
      onError({ path, error }) {
        // report to error monitoring
        console.error(`Error in tRPC handler on path '${path}':`, error);
      },
    } satisfies FastifyTRPCPluginOptions<TransactionsRouter>['trpcOptions'],
  })
})

const transactions = [{
    amount: 100,
    type: 'expense'
}]

const t = initTRPC.create()
const transactionsRouter = t.router({
  getTransactions: t.procedure.query(() => {
    return transactions
  }),
  addTransaction: t.procedure
    .input(transactionSchema)
    .mutation(opts => {
        console.log(opts.input.amount, opts.input.type)
    }),
})

export type TransactionsRouter = typeof transactionsRouter