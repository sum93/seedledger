import { expect } from "vitest";

import { test } from "../helper.js";

test("default root route", async ({ app }) => {
  const res = await app.inject({
    url: "/",
  });

  expect(JSON.parse(res.payload)).toEqual({ root: true });
});
