import { expect, test } from "vitest";

import { build } from "../helper.js";

test("default root route", async () => {
  const app = build();

  const res = await app.inject({
    url: "/",
  });

  expect(JSON.parse(res.payload)).toEqual({ root: true });
});
