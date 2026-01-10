import { build, autoLoad } from "./app.js";

(async () => {
  const app = build({
    logger: {
      transport: {
        target: "pino-pretty",
        options: {
          translateTime: "HH:MM:ss Z",
          ignore: "pid,hostname",
        },
      },
    },
    routerOptions: {
      maxParamLength: 5000,
    },
  });

  autoLoad(app);

  try {
    await app.listen({ port: 3003 });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
})();
