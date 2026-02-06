import { describe, expect } from "vitest";

import { test } from "../../helper.js";

describe("/trpc", () => {
  describe("/getTransactions", () => {
    test("should return all transactions", async ({ app }) => {
      const res = await app.inject({
        url: "/trpc/getTransactions",
      });

      expect(JSON.parse(res.payload).result.data.length).toEqual(10);
    });
  });

  describe("/getTransaction", () => {
    test("should return a single transaction by ID", async ({ app }) => {
      const res = await app.inject({
        url: `/trpc/getTransaction?input=${encodeURIComponent(JSON.stringify({ id: "043f1427-7019-433f-c34b-e221666c103a" }))}`,
        method: "GET",
      });

      expect(JSON.parse(res.body).result.data).toMatchObject({
        id: "043f1427-7019-433f-c34b-e221666c103a",
        amount: 18286,
        type: "outflow",
        date: "2021-03-07T03:18:40.000Z",
        description: "Integer tempus eget sapien non sodales. ",
        category: "entertainment",
      });
    });
  });

  describe("/addTransaction", () => {
    test("should add a new transaction", async ({ app }) => {
      const newTransaction = {
        amount: 500,
        type: "outflow",
        description: "Test transaction",
        category: "entertainment",
      };

      const postRes = await app.inject({
        method: "POST",
        url: "/trpc/addTransaction",
        payload: newTransaction,
      });

      // Verify the response
      expect(JSON.parse(postRes.body).result.data).toMatchObject({
        amount: 500,
        type: "outflow",
        description: "Test transaction",
        category: "entertainment",
      });

      // Verify it was actually inserted
      const getRes = await app.inject({
        url:
          "/trpc/getTransaction?input=" +
          encodeURIComponent(
            JSON.stringify({ id: JSON.parse(postRes.body).result.data.id }),
          ),
        method: "GET",
      });

      expect(JSON.parse(getRes.body).result.data).toMatchObject({
        amount: 500,
        type: "outflow",
        description: "Test transaction",
        category: "entertainment",
      });
    });

    test("should reject negative amounts", async ({ app }) => {
      const transaction = {
        amount: -100,
        type: "outflow",
        description: "Invalid negative amount",
        category: "test",
      };

      const res = await app.inject({
        method: "POST",
        url: "/trpc/addTransaction",
        payload: transaction,
      });

      expect(res.statusCode).toBe(400);
      const body = JSON.parse(res.body);
      expect(body.error.message).toContain("too_small");
    });

    test("should reject invalid type", async ({ app }) => {
      const transaction = {
        amount: 100,
        type: "invalid-type",
        description: "Invalid type",
        category: "test",
      };

      const res = await app.inject({
        method: "POST",
        url: "/trpc/addTransaction",
        payload: transaction,
      });

      expect(res.statusCode).toBe(400);
      const body = JSON.parse(res.body);
      expect(body.error.message).toContain("invalid_value");
    });

    test("should reject malformed decimal string amounts", async ({ app }) => {
      const transaction = {
        amount: "abc123",
        type: "inflow",
        description: "Malformed amount",
        category: "test",
      };

      const res = await app.inject({
        method: "POST",
        url: "/trpc/addTransaction",
        payload: transaction,
      });

      expect(res.statusCode).toBe(400);
      const body = JSON.parse(res.body);
      expect(body.error.message).toContain("invalid_type");
    });

    test("should reject missing required fields", async ({ app }) => {
      const transaction = {
        amount: 100,
        // Missing type
        description: "Missing type field",
        category: "test",
      };

      const res = await app.inject({
        method: "POST",
        url: "/trpc/addTransaction",
        payload: transaction,
      });

      expect(res.statusCode).toBe(400);
      const body = JSON.parse(res.body);
      expect(body.error.message).toContain("invalid_value");
    });
  });

  describe("/updateTransaction", () => {
    test("should update an existing transaction", async ({ app }) => {
      const updatedData = {
        id: "043f1427-7019-433f-c34b-e221666c103a",
        amount: 9999,
        description: "Updated description",
      };

      const postRes = await app.inject({
        method: "POST",
        url: "/trpc/updateTransaction",
        payload: updatedData,
      });

      expect(JSON.parse(postRes.body).result.data).toMatchObject({
        amount: 9999,
        description: "Updated description",

        // Not updated fields should remain the same
        id: "043f1427-7019-433f-c34b-e221666c103a",
        type: "outflow",
        date: "2021-03-07T03:18:40.000Z",
        category: "entertainment",
      });

      // Verify it was actually updated
      const getRes = await app.inject({
        url:
          "/trpc/getTransaction?input=" +
          encodeURIComponent(
            JSON.stringify({ id: "043f1427-7019-433f-c34b-e221666c103a" }),
          ),
        method: "GET",
      });

      expect(JSON.parse(getRes.body).result.data).toMatchObject({
        amount: 9999,
        description: "Updated description",

        // Not updated fields should remain the same
        id: "043f1427-7019-433f-c34b-e221666c103a",
        type: "outflow",
        date: "2021-03-07T03:18:40.000Z",
        category: "entertainment",
      });
    });
  });

  describe("/deleteTransaction", () => {
    test("should delete a transaction", async ({ app }) => {
      const postRes = await app.inject({
        method: "POST",
        url: "/trpc/deleteTransaction",
        payload: { id: "043f1427-7019-433f-c34b-e221666c103a" },
      });

      expect(JSON.parse(postRes.body).result.data).toMatchObject({
        id: "043f1427-7019-433f-c34b-e221666c103a",
        amount: 18286,
        type: "outflow",
        date: "2021-03-07T03:18:40.000Z",
        description: "Integer tempus eget sapien non sodales. ",
        category: "entertainment",
      });

      // Verify it was actually deleted
      const getRes = await app.inject({
        url: "/trpc/getTransactions",
        method: "GET",
      });

      expect(JSON.parse(getRes.body).result.data.length).toBe(9);
    });
  });
});
