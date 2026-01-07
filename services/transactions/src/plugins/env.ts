import fastifyEnv from '@fastify/env'
import fp from 'fastify-plugin'

const schema = {
  type: 'object',
  required: [ 'TRANSACTIONS_DB_FILE' ],
  properties: {
    TRANSACTIONS_DB_FILE: {
      type: 'string',
      default: 'db/transactions.db',
    }
  }
}

const options = {
  schema: schema,
}

export default fp(async (fastify, opts) => {
  await fastify.register(fastifyEnv, options)
}, { name: 'env-plugin' })

declare module 'fastify' {
  export interface FastifyInstance {
    config: {
      TRANSACTIONS_DB_FILE: string
    };
  }
}
