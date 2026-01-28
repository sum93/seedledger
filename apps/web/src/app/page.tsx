"use client";

import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import { TransactionsTable } from "./components/TransactionsTable";

export default function Home() {
  const transactionsQuery = useQuery(trpc.getTransactions.queryOptions());

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        {transactionsQuery.isFetched && (
          <div className="w-full">
            <h2 className="mb-4 text-2xl font-semibold text-black dark:text-zinc-50">
              Transactions
            </h2>
            <TransactionsTable transactions={transactionsQuery.data} />
          </div>
        )}
      </main>
    </div>
  );
}
