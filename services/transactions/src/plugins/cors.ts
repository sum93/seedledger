import cors from "@fastify/cors";
import { type FastifyInstance } from "fastify";
import fastifyPlugin from "fastify-plugin";

/**
 * This plugin enables CORS support for cross-origin requests
 *
 * @see https://github.com/fastify/fastify-cors
 */
export default fastifyPlugin(async function (app: FastifyInstance) {
  app.register(cors, {
    origin: true, // Allow all origins in development; restrict in production
    credentials: true,
  });
});
