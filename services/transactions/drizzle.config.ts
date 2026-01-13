import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import * as path from "path";
import { getDbEnv } from "./db/utils";

const { dbFile } = getDbEnv();

export default defineConfig({
  out: "./drizzle",
  schema: "./db/schema.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: path.join(process.cwd(), dbFile),
  },
});
