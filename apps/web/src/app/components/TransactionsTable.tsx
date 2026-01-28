"use client";

import { useState } from "react";

type Transaction = {
  id: string;
  type: "inflow" | "outflow";
  amount: number;
  date: string | Date;
  description: string | null;
  category: string | null;
};

type SortField = "type" | "amount" | "date" | "description" | "category";
type SortOrder = "asc" | "desc";

interface TransactionsTableProps {
  transactions: Transaction[] | undefined;
}

function SortIcon({
  field,
  sortField,
  sortOrder,
}: {
  field: SortField;
  sortField: SortField;
  sortOrder: SortOrder;
}) {
  if (sortField !== field) {
    return (
      <span className="text-zinc-400 dark:text-zinc-600">
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
          />
        </svg>
      </span>
    );
  }
  return (
    <span className="text-zinc-900 dark:text-zinc-100">
      {sortOrder === "asc" ? (
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 15l7-7 7 7"
          />
        </svg>
      ) : (
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      )}
    </span>
  );
}

export function TransactionsTable({ transactions }: TransactionsTableProps) {
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  if (!transactions || transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-zinc-200 bg-zinc-50 px-8 py-16 text-center dark:border-zinc-800 dark:bg-zinc-950">
        <div className="text-4xl">📊</div>
        <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          No transactions yet
        </h3>
        <p className="max-w-sm text-sm text-zinc-600 dark:text-zinc-400">
          Your transaction history will appear here once you start adding
          transactions.
        </p>
      </div>
    );
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const sortedTransactions = [...transactions].sort((a, b) => {
    let aValue: string | number | Date = a[sortField] ?? "";
    let bValue: string | number | Date = b[sortField] ?? "";

    if (sortField === "date") {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortOrder === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const totalItems = sortedTransactions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTransactions = sortedTransactions.slice(startIndex, endIndex);

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const formatDate = (date: string | Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(date));
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount / 100);
  };

  return (
    <div className="space-y-4">
      <div className="w-full overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
            <tr>
              <th
                className="cursor-pointer px-4 py-3 font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-800"
                onClick={() => handleSort("date")}
              >
                <div className="flex items-center gap-2">
                  Date
                  <SortIcon
                    field="date"
                    sortField={sortField}
                    sortOrder={sortOrder}
                  />
                </div>
              </th>
              <th
                className="cursor-pointer px-4 py-3 font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-800"
                onClick={() => handleSort("type")}
              >
                <div className="flex items-center gap-2">
                  Type
                  <SortIcon
                    field="type"
                    sortField={sortField}
                    sortOrder={sortOrder}
                  />
                </div>
              </th>
              <th
                className="cursor-pointer px-4 py-3 font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-800"
                onClick={() => handleSort("amount")}
              >
                <div className="flex items-center gap-2">
                  Amount
                  <SortIcon
                    field="amount"
                    sortField={sortField}
                    sortOrder={sortOrder}
                  />
                </div>
              </th>
              <th
                className="cursor-pointer px-4 py-3 font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-800"
                onClick={() => handleSort("category")}
              >
                <div className="flex items-center gap-2">
                  Category
                  <SortIcon
                    field="category"
                    sortField={sortField}
                    sortOrder={sortOrder}
                  />
                </div>
              </th>
              <th
                className="cursor-pointer px-4 py-3 font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-800"
                onClick={() => handleSort("description")}
              >
                <div className="flex items-center gap-2">
                  Description
                  <SortIcon
                    field="description"
                    sortField={sortField}
                    sortOrder={sortOrder}
                  />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {paginatedTransactions.map((transaction) => (
              <tr
                key={transaction.id}
                className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900"
              >
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                  {formatDate(transaction.date)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                      transaction.type === "inflow"
                        ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300"
                        : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
                    }`}
                  >
                    {transaction.type === "inflow" ? "+" : "-"}
                    {transaction.type === "inflow" ? "Inflow" : "Outflow"}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">
                  {formatAmount(transaction.amount)}
                </td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                  {transaction.category || "—"}
                </td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                  {transaction.description || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
            <span>
              Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of{" "}
              {totalItems} transactions
            </span>
            <select
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-900 transition-colors hover:border-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-1 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-zinc-600 dark:focus:border-zinc-500 dark:focus:ring-zinc-500"
            >
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:disabled:hover:bg-zinc-900"
            >
              First
            </button>
            <button
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}
              className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:disabled:hover:bg-zinc-900"
            >
              Previous
            </button>
            <span className="px-3 text-sm text-zinc-600 dark:text-zinc-400">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages}
              className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:disabled:hover:bg-zinc-900"
            >
              Next
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:disabled:hover:bg-zinc-900"
            >
              Last
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
