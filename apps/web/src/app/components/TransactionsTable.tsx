"use client";

import { useState } from "react";
import { Pagination } from "./Pagination";
import { TableHeader } from "./TableHeader";
import { TransactionRow } from "./TransactionRow";
import { sortTransactions } from "../../utils/transactions";
import { SortField, SortOrder, Transaction } from "@/types/transaction";

interface TransactionsTableProps {
  transactions: Transaction[] | undefined;
}

export function TransactionsTable({ transactions }: TransactionsTableProps) {
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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
    transactions || [],
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
      <table className="w-full text-left text-sm border-b border-zinc-200 dark:border-zinc-800">
        <TableHeader
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={handleSort}
        />
        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {paginatedTransactions.map((transaction) => (
            <TransactionRow key={transaction.id} transaction={transaction} />
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
