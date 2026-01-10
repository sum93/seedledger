import AutoLoad, { AutoloadPluginOptions } from "@fastify/autoload";
import fastify, {
  type FastifyInstance,
  type FastifyServerOptions,
} from "fastify";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function build(options: FastifyServerOptions = {}) {
  const app = fastify(options);
  return app;
}

// Options
export type AppOptions = {} & Partial<AutoloadPluginOptions>;

// Autoload all plugins and routes
export function autoLoad(app: FastifyInstance, options: AppOptions = {}) {
  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  app.register(AutoLoad, {
    dir: path.join(__dirname, "plugins"),
    options: options,
    forceESM: true,
  });

  // This loads all plugins defined in routes
  // define your routes in one of these
  app.register(AutoLoad, {
    dir: path.join(__dirname, "routes"),
    options: options,
    forceESM: true,
  });
}
