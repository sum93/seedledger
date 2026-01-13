import { beforeEach } from "vitest";
import { seedDb } from "../db/utils.js";

beforeEach(async () => {
  await seedDb();
});
