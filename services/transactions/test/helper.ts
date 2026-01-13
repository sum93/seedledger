import type { FastifyInstance } from "fastify";
import { test as baseTest } from "vitest";

import { autoLoad, build } from "../src/app.js";

export const test = baseTest.extend<{ app: FastifyInstance }>({
  app: async ({}, use) => {
    const app = build();
    autoLoad(app);

    await use(app);

    await app.close();
  },
});
