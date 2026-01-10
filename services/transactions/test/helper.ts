import { autoLoad, build as buildApp } from "../src/app.js";

// Automatically build and tear down our instance
export function build() {
  const app = buildApp();

  autoLoad(app);
  // t.after(() => void app.close());

  return app;
}
