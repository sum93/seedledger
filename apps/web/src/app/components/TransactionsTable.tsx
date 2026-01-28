"use client";

import { useState } from "react";
import { Pagination } from "./Pagination";
import { SortDownIcon, SortUpIcon, UnsortedIcon } from "./icons";
import { sortTransactions } from "../../utils/transactions";
import { formatAmount, formatDate } from "../../utils/formatting";
import { DEFAULT_CURRENCY } from "../../utils/constants";

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
        <UnsortedIcon />
      </span>
    );
  }
  return (
    <span className="text-zinc-900 dark:text-zinc-100">
      {sortOrder === "asc" ? <SortUpIcon /> : <SortDownIcon />}
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

  const sortedTransactions = sortTransactions(
    transactions,
    sortField,
    sortOrder,
  );

  const totalItems = sortedTransactions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTransactions = sortedTransactions.slice(startIndex, endIndex);

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          startIndex={startIndex}
          endIndex={endIndex}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      )}
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
                Amount ({DEFAULT_CURRENCY})
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
                  {transaction.type === "inflow" ? "Inflow" : "Outflow"}
                </span>
              </td>
              <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">
                {formatAmount(transaction.amount, transaction.type)}
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

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          startIndex={startIndex}
          endIndex={endIndex}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      )}
    </div>
  );
}
