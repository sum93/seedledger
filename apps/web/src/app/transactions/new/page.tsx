"use client";

import { trpc } from "@/lib/trpc";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewTransactionPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    type: "inflow" as "inflow" | "outflow",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    category: "",
    description: "",
  });

  const addTransactionMutation = useMutation(
    trpc.addTransaction.mutationOptions({
      onSuccess: () => {
        router.push("/transactions");
      },
    }),
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const transactionData = {
      type: formData.type,
      amount: parseFloat(formData.amount),
      date: new Date(formData.date),
      category: formData.category || null,
      description: formData.description || null,
    };

    addTransactionMutation.mutate(transactionData);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-2xl flex-col gap-8 px-8 py-16">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/transactions")}
            className="text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-semibold text-black dark:text-zinc-50">
            Add Transaction
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950"
        >
          <div className="flex flex-col gap-6">
            {/* Type */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="type"
                className="text-sm font-medium text-zinc-900 dark:text-zinc-100"
              >
                Type
              </label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as "inflow" | "outflow",
                  })
                }
                className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-zinc-900 transition-colors focus:border-zinc-400 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                required
              >
                <option value="inflow">Inflow</option>
                <option value="outflow">Outflow</option>
              </select>
            </div>

            {/* Amount */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="amount"
                className="text-sm font-medium text-zinc-900 dark:text-zinc-100"
              >
                Amount
              </label>
              <input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-zinc-900 transition-colors focus:border-zinc-400 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                placeholder="0.00"
                required
              />
            </div>

            {/* Date */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="date"
                className="text-sm font-medium text-zinc-900 dark:text-zinc-100"
              >
                Date
              </label>
              <input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-zinc-900 transition-colors focus:border-zinc-400 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                required
              />
            </div>

            {/* Category */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="category"
                className="text-sm font-medium text-zinc-900 dark:text-zinc-100"
              >
                Category (optional)
              </label>
              <input
                id="category"
                type="text"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-zinc-900 transition-colors focus:border-zinc-400 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                placeholder="e.g., Groceries, Salary"
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="description"
                className="text-sm font-medium text-zinc-900 dark:text-zinc-100"
              >
                Description (optional)
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-zinc-900 transition-colors focus:border-zinc-400 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                placeholder="Add details about this transaction"
                rows={3}
              />
            </div>

            {/* Error message */}
            {addTransactionMutation.isError && (
              <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-red-950 dark:text-red-300">
                Error adding transaction. Please try again.
              </div>
            )}

            {/* Submit button */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={addTransactionMutation.isPending}
                className="flex-1 rounded-lg bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
              >
                {addTransactionMutation.isPending
                  ? "Adding..."
                  : "Add Transaction"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/")}
                className="rounded-lg border border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-900"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
