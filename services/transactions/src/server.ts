import AutoLoad, { AutoloadPluginOptions } from '@fastify/autoload';
import fastify from 'fastify';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Create server instance
const server = fastify({
  logger: true,
  routerOptions: {
    maxParamLength: 5000,
  },
});

// Options
export type AppOptions = {} & Partial<AutoloadPluginOptions>
const options: AppOptions = {}

// Do not touch the following lines

// This loads all plugins defined in plugins
// those should be support plugins that are reused
// through your application
// eslint-disable-next-line no-void
server.register(AutoLoad, {
  dir: path.join(__dirname, 'plugins'),
  options: options,
  forceESM: true
});

// This loads all plugins defined in routes
// define your routes in one of these
// eslint-disable-next-line no-void
server.register(AutoLoad, {
  dir: path.join(__dirname, 'routes'),
  options: options,
  forceESM: true
});

(async () => {
  try {
    await server.listen({ port: 3003 });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
})();
